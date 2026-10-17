import { BRAND } from '@/lib/brand';
import type { Messages } from '@/i18n/I18nProvider';
import { getIllustrationAsset } from '@/content/illustrations';
import type {
  DeckDefinition,
  IcebreakerCard,
  Locale,
} from '@/types/game';

export interface GenerateCardStoryImageInput {
  deck: DeckDefinition;
  card: IcebreakerCard;
  locale: Locale;
  t: Messages;
}

const STORY_WIDTH = 1080;
const STORY_HEIGHT = 1920;

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.closePath();
}

function segmentTextIntoUnits(text: string, locale: Locale): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter(locale === 'th' ? 'th' : 'en', {
      granularity: 'word',
    });
    return Array.from(segmenter.segment(text), (s) => s.segment);
  }
  return text.split(/(\s+)/);
}

function splitLongTokenByWidth(
  ctx: CanvasRenderingContext2D,
  token: string,
  maxWidth: number
): string[] {
  const graphemes =
    typeof Intl !== 'undefined' && 'Segmenter' in Intl
      ? Array.from(
          new Intl.Segmenter('th', { granularity: 'grapheme' }).segment(token),
          (s) => s.segment
        )
      : Array.from(token);

  const chunks: string[] = [];
  let current = '';

  for (const ch of graphemes) {
    const next = current + ch;
    if (ctx.measureText(next).width <= maxWidth || current === '') {
      current = next;
    } else {
      chunks.push(current);
      current = ch;
    }
  }
  if (current) {
    chunks.push(current);
  }
  return chunks;
}

export function wrapTextLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  locale: Locale
): string[] {
  const rawUnits = segmentTextIntoUnits(text.trim(), locale);
  const units: string[] = [];

  for (const unit of rawUnits) {
    if (ctx.measureText(unit).width > maxWidth && unit.trim().length > 0) {
      units.push(...splitLongTokenByWidth(ctx, unit, maxWidth));
    } else {
      units.push(unit);
    }
  }

  const lines: string[] = [];
  let currentLine = '';

  for (const unit of units) {
    // Skip leading whitespace at the start of a new line
    if (currentLine === '' && /^\s+$/.test(unit)) {
      continue;
    }

    const candidate = currentLine + unit;
    if (ctx.measureText(candidate.trimEnd()).width <= maxWidth) {
      currentLine = candidate;
    } else {
      if (currentLine.trim()) {
        lines.push(currentLine.trim());
      }
      currentLine = unit.trimStart();
    }
  }

  if (currentLine.trim()) {
    lines.push(currentLine.trim());
  }

  return lines;
}

function loadSvgImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    if (typeof Image === 'undefined') {
      resolve(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export async function generateCardStoryBlob({
  deck,
  card,
  locale,
  t,
}: GenerateCardStoryImageInput): Promise<Blob | null> {
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = STORY_WIDTH;
  canvas.height = STORY_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const fontStack =
    '"Noto Sans Thai", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

  // 1. Warm Editorial Story Background (1080x1920)
  ctx.fillStyle = '#FAF7F2';
  ctx.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT);

  // Subtle decorative dotted grid
  ctx.fillStyle = 'rgba(28, 25, 23, 0.06)';
  for (let gx = 60; gx < STORY_WIDTH; gx += 48) {
    for (let gy = 60; gy < STORY_HEIGHT; gy += 48) {
      ctx.beginPath();
      ctx.arc(gx, gy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 2. Top Brand Header (ICEBREAKER CLUB + Deck Title)
  const deckTitle = locale === 'th' ? deck.titleTh : deck.titleEn;
  ctx.font = `800 30px ${fontStack}`;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#9F1D2C';
  ctx.fillText(BRAND.name.toUpperCase(), STORY_WIDTH / 2, 165);

  ctx.font = `700 36px ${fontStack}`;
  ctx.fillStyle = '#1C1917';
  ctx.fillText(deckTitle, STORY_WIDTH / 2, 220);

  // 3. Physical Stacked Card Shadow & Outer Frame
  const cardX = 110;
  const cardY = 290;
  const cardW = STORY_WIDTH - cardX * 2; // 860
  const cardH = 1280;

  // Under-card stack offset
  drawRoundedRect(ctx, cardX + 16, cardY + 22, cardW, cardH, 56);
  ctx.fillStyle = '#1C1917';
  ctx.fill();

  // Main Card Shell
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 56);
  ctx.fillStyle = '#FFFDF9';
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#1C1917';
  ctx.stroke();

  // Inner Card Frame (Clean: NO card header, NO follow-up box, NO tags/ID)
  const innerMargin = 34;
  drawRoundedRect(
    ctx,
    cardX + innerMargin,
    cardY + innerMargin,
    cardW - innerMargin * 2,
    cardH - innerMargin * 2,
    40
  );
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = 'rgba(28, 25, 23, 0.18)';
  ctx.stroke();

  // 4. Center Illustration Medallion inside Card
  const centerX = STORY_WIDTH / 2;
  const illusCenterY = cardY + 370;
  ctx.beginPath();
  ctx.arc(centerX, illusCenterY, 115, 0, Math.PI * 2);
  ctx.fillStyle = '#FFF5F5';
  ctx.fill();
  ctx.lineWidth = 3.5;
  ctx.setLineDash([10, 8]);
  ctx.strokeStyle = 'rgba(28, 25, 23, 0.35)';
  ctx.stroke();
  ctx.setLineDash([]);

  const asset = getIllustrationAsset(card.illustration);
  const svgImg = await loadSvgImage(asset.path);
  if (svgImg) {
    const iconSize = 136;
    ctx.drawImage(
      svgImg,
      centerX - iconSize / 2,
      illusCenterY - iconSize / 2,
      iconSize,
      iconSize
    );
  }

  // 5. Main Question Prompt (Word-wrapped with Intl.Segmenter & auto-fitted inside inner card frame)
  const promptText = card.prompt[locale];
  const maxPromptWidth = cardW - innerMargin * 2 - 110; // 682px safe width inside inner frame

  let fontSize = 46;
  let lineHeight = 70;
  ctx.font = `800 ${fontSize}px ${fontStack}`;
  let promptLines = wrapTextLines(ctx, promptText, maxPromptWidth, locale);

  if (promptLines.length > 4) {
    fontSize = 40;
    lineHeight = 62;
    ctx.font = `800 ${fontSize}px ${fontStack}`;
    promptLines = wrapTextLines(ctx, promptText, maxPromptWidth, locale);
  }

  if (promptLines.length > 5) {
    fontSize = 36;
    lineHeight = 56;
    ctx.font = `800 ${fontSize}px ${fontStack}`;
    promptLines = wrapTextLines(ctx, promptText, maxPromptWidth, locale);
  }

  ctx.fillStyle = '#1C1917';
  ctx.textAlign = 'center';

  const promptBlockHeight = promptLines.length * lineHeight;
  const promptStartY = cardY + 790 - promptBlockHeight / 2 + fontSize * 0.85;

  promptLines.forEach((line, idx) => {
    ctx.fillText(line, centerX, promptStartY + idx * lineHeight, maxPromptWidth);
  });

  // 6. Bottom Story Call-to-Action Footer
  ctx.textAlign = 'center';
  ctx.font = `700 28px ${fontStack}`;
  ctx.fillStyle = '#57534E';
  ctx.fillText(t.share.storyWatermarkCta, centerX, 1710);

  // Pill CTA at bottom
  const ctaText = `${BRAND.name} • ${deckTitle}`;
  ctx.font = `800 30px ${fontStack}`;
  const ctaW = ctx.measureText(ctaText).width + 80;
  drawRoundedRect(ctx, centerX - ctaW / 2, 1745, ctaW, 68, 34);
  ctx.fillStyle = '#9F1D2C';
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#1C1917';
  ctx.stroke();

  ctx.fillStyle = '#FFFDF9';
  ctx.fillText(ctaText, centerX, 1790);

  return new Promise((resolve) => {
    if (typeof canvas.toBlob !== 'function') {
      resolve(null);
      return;
    }
    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}
