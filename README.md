# Icebreaker Club — เว็บเกมไพ่ชวนคุย 2 ภาษา (Free Bilingual Icebreaking Card Game Platform)

เว็บเกมไพ่ชวนคุยสำหรับเพื่อนใหม่ คนรัก และกลุ่มปาร์ตี้สังสรรค์ รองรับ **2 ภาษา (ไทย / อังกฤษ)** เปิดเว็บ เลือกกองไพ่ เปิดไพ่คำถามหรือภารกิจ บันทึกรูปการ์ดคำถามลงโซเชียล และเล่นต่อได้ทันทีโดยไม่ต้องสมัครสมาชิก ฟรี 100% ไม่มีโฆษณาคั่น ไม่ใช้ AI API ระหว่างเล่น และไม่มีฐานข้อมูลหรือบริการที่เสียค่าใช้จ่าย

---

## 1. ฟีเจอร์หลัก (Key Features)

- **3 กองไพ่พร้อมเล่น รองรับ 2 ภาษา `TH | EN` (รวม 96 ใบ ไม่ซ้ำกัน)**:
  - **ทำความรู้จัก / Get to Know (`get-to-know`)** — 32 ใบ สำหรับเพื่อนใหม่ เพื่อนร่วมงาน หรือกลุ่มที่อยากเริ่มบทสนทนาอย่างเป็นธรรมชาติ
  - **คู่รักชวนคุย / Couples Edition (`couples`)** — 32 ใบ สำหรับคนคุย คู่เดต และคู่รัก เน้นความเข้าใจเชิงบวกโดยไม่สร้างความขัดแย้ง
  - **ปาร์ตี้ & ชนแก้ว / Party & Drinks (`party-drinks`)** — 32 ใบ สำหรับวงสังสรรค์ มีทั้งภารกิจสั้น ๆ โหวตหน้าวง และกติกาพิเศษ รองรับทั้งสายดื่มและสายจิบน้ำเปล่า/ทำท่าทางแทน
- **ข้อมูลทั้งหมดจัดเก็บในรูปแบบไฟล์ JSON (`src/content/data/`)**: แก้ไขหรือเพิ่มเติมคำถามและคำแปลได้ง่าย พร้อมสคริปต์ตรวจสอบความถูกต้องอัตโนมัติ
- **บันทึกรูปการ์ดคำถามสำหรับ IG Story / โซเชียลมีเดีย (`1080×1920`)**:
  - วาดภาพการ์ดคำถามความละเอียดสูงด้วย HTML5 Canvas 2D โดยแสดงเฉพาะกรอบการ์ด ภาพประกอบ และข้อความคำถามหลักที่ตัดบรรทัดภาษาไทย/อังกฤษอย่างสวยงาม (`Intl.Segmenter`) พร้อมบันทึกเป็นไฟล์ `.png` ลงเครื่องทันที
- **Pure Game Engine ที่ทดสอบได้ 100%**:
  - สับไพ่ด้วยอัลกอริทึม Fisher–Yates Shuffle ที่รองรับการส่งฟังก์ชัน PRNG เข้าไปทดสอบ
  - ไม่แสดงข้อมูลของไพ่ใบถัดไปล่วงหน้าก่อนกดเปิดไพ่
  - ป้องกันไพ่ซ้ำภายในรอบเดียวกัน 100%
  - ข้ามไพ่ (`Skip`) ได้ทุกใบโดยไม่นำไพ่ที่ข้ามกลับมาเล่นซ้ำในรอบเดิม
  - เริ่มรอบใหม่ (`Reset`) เพื่อสับไพ่ใหม่ทันทีโดยไม่ต้องรีโหลดหน้าเว็บ
- **Visual Design System (Cute Minimal & Tactile Card Deck)**:
  - พื้นหลังสีครีมอบอุ่น (`#FAF7F2`) ตัดกับสีแดงเข้ม (`#9F1D2C`) และลายเส้นสีชาร์โคล (`#1C1917`)
  - การ์ดมีความสูงคงที่ (`h-97.5 sm:h-102.5`) และจำกัดคำถามบนหน้าเว็บสูงสุด 4 บรรทัด (`line-clamp-4`) เพื่อไม่ให้ปุ่มควบคุมกระโดด
  - ชุดภาพประกอบลายเส้นขาวดำต้นฉบับ 24 ไฟล์ (`public/illustrations/*.svg`) ขนาดรวมทั้งหมดเพียง ~11.70 KB (เฉลี่ยไฟล์ละ ~0.5 KB ต่ำกว่างบ 10 KB ต่อไฟล์มาก)
  - แอนิเมชันจั่วและพลิกไพ่ด้วย CSS 3D Transform ที่เคารพค่า `prefers-reduced-motion`

---

## 2. โครงสร้างโปรเจกต์ (Project Structure)

```text
src/
  app/
    layout.tsx                        # Root Layout, Noto Sans Thai font, I18nProvider, SEO metadata
    page.tsx                          # Home Page (HowToBanner + 3 Deck Covers)
    not-found.tsx                     # หน้า 404 (Bilingual)
    sitemap.ts                        # Dynamic Sitemap
    robots.ts                         # Dynamic robots.txt
    decks/[slug]/page.tsx             # Deck Detail & Game Setup Page
    play/[slug]/page.tsx              # Playing Screen
  components/
    layout/
      Header.tsx                      # แถบเมนูด้านบนพร้อมปุ่มสลับภาษา
      LanguageSwitcher.tsx            # ปุ่มสลับภาษา TH | EN
      HowToBanner.tsx                 # แถบวิธีเล่น 3 ขั้นตอนสั้น ๆ
      Footer.tsx
    deck/
      BackToHomeLink.tsx
      DeckCard.tsx
      DeckOverviewHero.tsx
      DeckSetupPanel.tsx
      DeckRulesCard.tsx
      ShareDeckButton.tsx
    game/
      GameBoard.tsx
      PlayingCard.tsx
      PlayingCardBack.tsx
      PlayingCardFront.tsx
      GameControls.tsx
      ShareCardStoryButton.tsx        # ปุ่มบันทึกรูปการ์ดคำถาม .png
      RoundCompleteView.tsx
      EmptyDeckView.tsx
      __tests__/userFlow.test.tsx     # Integration / i18n / Line-wrap Tests
    ui/
      CardIllustration.tsx
  features/
    game/
      shuffle.ts                      # Fisher-Yates shuffle + Seeded PRNG
      drawCard.ts                     # Filter, Draw, Skip, Remaining calculation
      gameState.ts                    # Session initialization & Reset logic
      __tests__/gameEngine.test.ts    # Game Engine Unit Tests
  i18n/
    I18nProvider.tsx                  # Bilingual Context Provider (th | en)
    locales/
      th.json                         # คำแปล UI ภาษาไทย
      en.json                         # คำแปล UI ภาษาอังกฤษ
  content/
    data/
      illustrations.json              # ข้อมูลภาพประกอบ 24 ชิ้น (TH/EN)
      decks.json                      # ข้อมูล 3 กองไพ่หลัก (TH/EN)
      cards/
        get-to-know.json              # 32 ใบ (กองทำความรู้จัก TH/EN)
        couples.json                  # 32 ใบ (กองคู่รัก TH/EN)
        party-drinks.json             # 32 ใบ (กองปาร์ตี้ TH/EN)
    illustrations.ts                  # Typed Illustration Registry
    decks.ts                          # Typed Deck Registry
    cards/
      get-to-know.ts
      couples.ts
      party-drinks.ts
      index.ts                        # Unified Card Registry (รวม 96 ใบ)
  lib/
    brand.ts                          # ข้อมูลแบรนด์ (เปลี่ยนชื่อโปรเจกต์ได้ที่นี่)
    url.ts                            # Helper สำหรับอ่าน NEXT_PUBLIC_SITE_URL
    shareCardImage.ts                 # HTML5 Canvas Story Card Image Generator
  types/
    game.ts                           # Strict TypeScript Types
public/
  illustrations/                      # ไฟล์ภาพประกอบขาวดำ SVG 24 ไฟล์
scripts/
  validate-assets.mjs                 # สคริปต์ตรวจสอบไฟล์ SVG, ขนาดไฟล์ และข้อมูลไพ่ JSON 2 ภาษา
docs/
  PRODUCT_SPEC.md                     # เอกสารข้อกำหนดผลิตภัณฑ์
  ARCHITECTURE.md                     # เอกสารสถาปัตยกรรมระบบ
  ASSET_GUIDELINES.md                 # แนวทางและการตรวจสอบภาพประกอบ
AGENTS.md                             # กฎการทำงานและมาตรฐานโค้ดสำหรับนักพัฒนา/AI Agent
```

---

## 3. วิธีติดตั้งและรันในเครื่อง (Local Development)

### ข้อกำหนดเบื้องต้น
- **Node.js**: เวอร์ชัน 18.18+ หรือ 20+ / 22+ / 24+
- **npm**: เวอร์ชัน 9+

### ขั้นตอนการติดตั้งและรัน
```bash
# 1. ติดตั้ง Dependencies
npm install

# 2. รันเซิร์ฟเวอร์สำหรับพัฒนา (Development Server)
npm run dev
```
เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`

---

## 4. คำสั่งตรวจสอบคุณภาพและทดสอบ (Quality Gates & Testing)

```bash
# ตรวจสอบคุณภาพโค้ดด้วย ESLint
npm run lint

# ตรวจสอบความถูกต้องของชนิดข้อมูลด้วย TypeScript Strict Mode
npm run typecheck

# รัน Unit Tests และ User Flow Tests ทั้งหมดด้วย Vitest
npm run test

# ตรวจสอบไฟล์ภาพประกอบ SVG และข้อมูลไพ่ JSON 2 ภาษา
npm run validate:assets

# สร้าง Production Build
npm run build

# รัน Production Server หลัง Build
npm run start
```

---

## 5. ตัวแปรสภาพแวดล้อม (Environment Variables)

โปรเจกต์นี้ **ไม่จำเป็นต้องตั้งค่า API Key หรือตัวแปรสภาพแวดล้อมใด ๆ เพื่อเล่นเกมพื้นฐาน**

หากต้องการกำหนด Canonical URL สำหรับ SEO และ Sitemap บน Production Domain สามารถตั้งค่าตัวแปร (Optional) ดังนี้:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.example.com
```

---

## 6. ขั้นตอนการ Deploy แบบฟรี (Free Tier Deployment Guide)

โปรเจกต์นี้ออกแบบให้เป็น Static / Pre-rendered Next.js App ที่ไม่มีฐานข้อมูลและไม่มี Paid API จึงสามารถ Deploy บนบริการ Free Tier ได้ทันที

### ทางเลือกที่ 1: Deploy บน Vercel (Hobby / Free Plan)
1. อัปโหลดโค้ดขึ้น GitHub, GitLab หรือ Bitbucket Repository ของคุณ
2. ล็อกอินเข้าสู่ระบบ [Vercel](https://vercel.com) แล้วกด **Add New... -> Project**
3. เลือก Repository `ice-breaker-club`
4. ค่าเริ่มต้นจะถูกตั้งเป็น **Framework Preset: Next.js**, **Build Command: `npm run build`**, **Output Directory: `.next`**
5. (ทางเลือก) ตั้งค่า Environment Variable `NEXT_PUBLIC_SITE_URL` เป็น URL ของโปรเจกต์
6. กด **Deploy**

### ทางเลือกที่ 2: Deploy บน Cloudflare Pages หรือ Netlify (Free Tier)
1. เชื่อมต่อ Git Repository เข้ากับ Cloudflare Pages หรือ Netlify
2. ตั้งค่า Build Command เป็น `npm run build`
3. หากต้องการส่งออกเป็น Static HTML ล้วน (Static Export) สามารถเพิ่ม `output: 'export'` ใน `next.config.ts` แล้วใช้โฟลเดอร์ `out/` ในการอัปโหลดได้ทันที เนื่องจากทุกเส้นทาง (`/`, `/decks/[slug]`, `/play/[slug]`) รองรับ `generateStaticParams` ครบถ้วน
