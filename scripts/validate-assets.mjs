import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const ILLUSTRATIONS_DIR = path.join(ROOT_DIR, 'public', 'illustrations');
const DATA_DIR = path.join(ROOT_DIR, 'src', 'content', 'data');
const ILLUSTRATIONS_JSON = path.join(DATA_DIR, 'illustrations.json');
const DECKS_JSON = path.join(DATA_DIR, 'decks.json');
const CARDS_JSON_DIR = path.join(DATA_DIR, 'cards');

const SVG_BUDGET_BYTES = 10 * 1024; // 10 KB

function validateSvgContent(filePath, content) {
  const issues = [];
  const trimmed = content.trim();
  if (!trimmed.startsWith('<svg') || !trimmed.endsWith('</svg>')) {
    issues.push('Malformed SVG root element (<svg>...</svg> expected)');
  }
  if (!/viewBox="[^"]+"/.test(trimmed)) {
    issues.push('Missing viewBox attribute');
  }
  if (/data:image\//i.test(trimmed) || /<image\b/i.test(trimmed)) {
    issues.push('Embedded raster/base64 image is prohibited inside SVG');
  }
  if (/<script\b/i.test(trimmed) || /\bon\w+=/i.test(trimmed)) {
    issues.push('Inline script or event handler prohibited inside SVG');
  }
  return issues;
}

function main() {
  console.log('=== Icebreaker Club — Asset & Bilingual JSON Validation ===\n');
  const errors = [];
  const warnings = [];

  if (!fs.existsSync(ILLUSTRATIONS_DIR)) {
    console.error(`ERROR: Illustrations directory not found at ${ILLUSTRATIONS_DIR}`);
    process.exit(1);
  }

  // 1. Inspect SVG files on disk
  const diskFiles = fs.readdirSync(ILLUSTRATIONS_DIR);
  const svgFiles = diskFiles.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    if (ext !== '.svg') {
      errors.push(`Disallowed file extension in public/illustrations: ${file}`);
      return false;
    }
    return true;
  });

  const diskAssetMap = new Map();
  let totalBytes = 0;

  console.log('1. SVG Asset Size Report (Budget: 10,240 bytes per file):');
  console.log('------------------------------------------------------------');
  for (const file of svgFiles.sort()) {
    const fullPath = path.join(ILLUSTRATIONS_DIR, file);
    const stat = fs.statSync(fullPath);
    const content = fs.readFileSync(fullPath, 'utf8');
    const id = path.basename(file, '.svg');

    totalBytes += stat.size;
    diskAssetMap.set(id, { file, size: stat.size, fullPath });

    const status = stat.size <= SVG_BUDGET_BYTES ? 'OK' : 'OVER BUDGET';
    console.log(`  - ${file.padEnd(26)} ${String(stat.size).padStart(6)} bytes  [${status}]`);

    if (stat.size > SVG_BUDGET_BYTES) {
      errors.push(
        `SVG file "${file}" exceeds 10 KB budget (${stat.size} bytes > ${SVG_BUDGET_BYTES} bytes)`
      );
    }

    const svgIssues = validateSvgContent(fullPath, content);
    for (const issue of svgIssues) {
      errors.push(`SVG validation failed for "${file}": ${issue}`);
    }
  }
  console.log('------------------------------------------------------------');
  console.log(
    `Total SVG files: ${svgFiles.length} | Total size: ${totalBytes} bytes (${(
      totalBytes / 1024
    ).toFixed(2)} KB)\n`
  );

  // 2. Parse registered illustration IDs in src/content/data/illustrations.json
  const illustrationsList = JSON.parse(fs.readFileSync(ILLUSTRATIONS_JSON, 'utf8'));
  const seenRegisteredIds = new Set();

  for (const item of illustrationsList) {
    if (seenRegisteredIds.has(item.id)) {
      errors.push(`Duplicate illustration id "${item.id}" in illustrations.json`);
    }
    if (!item.titleTh || !item.titleEn || !item.altTh || !item.altEn) {
      errors.push(`Missing bilingual title/alt fields for illustration "${item.id}"`);
    }
    seenRegisteredIds.add(item.id);

    if (!diskAssetMap.has(item.id)) {
      errors.push(
        `Registered illustration "${item.id}" does not have a matching file public/illustrations/${item.id}.svg`
      );
    }
  }

  // 3. Parse Deck definitions in src/content/data/decks.json
  const decksList = JSON.parse(fs.readFileSync(DECKS_JSON, 'utf8'));
  const deckSlugs = decksList.map((d) => d.slug);
  const coverIllustrations = decksList.map((d) => d.coverIllustration);

  const usedIllustrations = new Set(coverIllustrations);

  for (const deck of decksList) {
    if (!deck.shortDescription?.th || !deck.shortDescription?.en) {
      errors.push(`Deck "${deck.slug}" is missing bilingual shortDescription`);
    }
    if (!deck.longDescription?.th || !deck.longDescription?.en) {
      errors.push(`Deck "${deck.slug}" is missing bilingual longDescription`);
    }
    if (!diskAssetMap.has(deck.coverIllustration)) {
      errors.push(
        `Deck coverIllustration "${deck.coverIllustration}" references a missing SVG file`
      );
    }
  }

  const cardFiles = ['get-to-know.json', 'couples.json', 'party-drinks.json'];
  const allCardIds = new Set();
  const allCardPromptsTh = new Set();
  const allCardPromptsEn = new Set();
  let totalCards = 0;

  console.log('2. Bilingual JSON Card Content & Reference Report:');
  console.log('------------------------------------------------------------');

  for (const cardFile of cardFiles) {
    const filePath = path.join(CARDS_JSON_DIR, cardFile);
    const cards = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const illustrations = cards.map((c) => c.illustration);

    console.log(
      `  - ${cardFile.padEnd(22)} ${String(cards.length).padStart(3)} cards | ${
        new Set(illustrations).size
      } unique illustrations`
    );

    if (cards.length < 30) {
      errors.push(`Deck file ${cardFile} has fewer than 30 cards (${cards.length})`);
    }

    for (const card of cards) {
      if (allCardIds.has(card.id)) {
        errors.push(`Duplicate card ID found: "${card.id}" in ${cardFile}`);
      }
      allCardIds.add(card.id);
      totalCards += 1;

      if (!deckSlugs.includes(card.deckId)) {
        errors.push(`Card "${card.id}" in ${cardFile} references unknown deckId "${card.deckId}"`);
      }

      const thPrompt = card.prompt?.th?.trim();
      const enPrompt = card.prompt?.en?.trim();

      if (!thPrompt || !enPrompt) {
        errors.push(`Card "${card.id}" in ${cardFile} is missing Thai or English prompt`);
      } else {
        if (allCardPromptsTh.has(thPrompt)) {
          errors.push(`Duplicate Thai prompt in ${cardFile}: "${thPrompt}"`);
        }
        allCardPromptsTh.add(thPrompt);

        if (allCardPromptsEn.has(enPrompt)) {
          errors.push(`Duplicate English prompt in ${cardFile}: "${enPrompt}"`);
        }
        allCardPromptsEn.add(enPrompt);
      }

      if (!card.tags?.th?.length || !card.tags?.en?.length) {
        errors.push(`Card "${card.id}" in ${cardFile} is missing bilingual tags`);
      }

      usedIllustrations.add(card.illustration);
      if (!diskAssetMap.has(card.illustration)) {
        errors.push(
          `Card "${card.id}" in ${cardFile} references non-existent illustration "${card.illustration}"`
        );
      }
      if (!seenRegisteredIds.has(card.illustration)) {
        errors.push(
          `Card "${card.id}" in ${cardFile} references illustration "${card.illustration}" not registered in illustrations.json`
        );
      }
    }
  }

  console.log('------------------------------------------------------------');
  console.log(
    `Total cards validated: ${totalCards} | Unique TH prompts: ${allCardPromptsTh.size} | Unique EN prompts: ${allCardPromptsEn.size} | Used illustrations: ${usedIllustrations.size}/${diskAssetMap.size}\n`
  );

  if (totalCards < 90) {
    errors.push(`Total card count (${totalCards}) is below the minimum requirement of 90 cards`);
  }

  // 4. Check for unused SVG files on disk
  for (const [id, info] of diskAssetMap.entries()) {
    if (!usedIllustrations.has(id)) {
      errors.push(`Unused illustration file on disk: public/illustrations/${info.file}`);
    }
  }

  if (warnings.length > 0) {
    console.log('Warnings:');
    for (const w of warnings) {
      console.log(`  [WARN] ${w}`);
    }
    console.log('');
  }

  if (errors.length > 0) {
    console.error('Asset & Content Validation FAILED with the following errors:');
    for (const err of errors) {
      console.error(`  [ERROR] ${err}`);
    }
    process.exit(1);
  }

  console.log(
    'SUCCESS: All assets, SVG budgets, deck references, and 96 bilingual JSON cards passed validation!'
  );
}

main();
