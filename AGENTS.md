# AGENTS.md — Development & Architecture Rules for Icebreaker Club

เอกสารนี้กำหนดข้อตกลงสถาปัตยกรรม มาตรฐานการเขียนโค้ด กฎการทดสอบ กฎด้านประสิทธิภาพ และข้อห้ามสำหรับนักพัฒนาและ AI Agent ทุกตัวที่ทำงานในโปรเจกต์นี้

---

## 1. Workflow & General Discipline

1. **อ่านเอกสารและโครงสร้างที่เกี่ยวข้องก่อนแก้ไขเสมอ**: ตรวจสอบ `docs/PRODUCT_SPEC.md`, `docs/ARCHITECTURE.md`, `docs/ASSET_GUIDELINES.md` และไฟล์ที่เกี่ยวข้องก่อนเริ่มงาน
2. **ทำงานเป็น Task ขนาดเล็ก**: แบ่งงานเป็นส่วนย่อยที่ตรวจสอบผลลัพธ์ (Acceptance Criteria) ได้ชัดเจน
3. **ห้ามแก้ไขไฟล์ที่ไม่เกี่ยวข้องกับ Task ปัจจุบัน**: รักษาขอบเขตการเปลี่ยนแปลงให้แคบและตรงประเด็น
4. **ห้ามเพิ่ม Dependencies โดยไม่มีเหตุผลอันสมควร**: ใช้ Web APIs มาตรฐาน, React, Next.js และ CSS ก่อนพิจารณาติดตั้งแพ็กเกจภายนอก
5. **รายงานผลทุกครั้งหลังจบงาน**: ต้องระบุรายการไฟล์ที่เปลี่ยนแปลง ผลการรัน Lint / Type Check / Tests / Build ปัญหาที่ยังค้าง (ถ้ามี) และขั้นตอนถัดไป

---

## 2. Strict Prohibitions (ข้อห้ามเด็ดขาด)

- **ห้ามเพิ่ม Backend, Authentication, Cloud Database, Payment หรือ AI API** โดยไม่ได้รับอนุญาตอย่างชัดเจน (MVP ต้องเป็น 100% Client/Static-friendly ฟรีทุกขั้นตอน)
- **ห้ามเพิ่ม Third-party Analytics หรือ Cookie Banner** ที่ไม่จำเป็นต่อการทำงานหลักของเว็บ
- **ห้ามใช้ LocalStorage หรือ IndexedDB เก็บข้อมูลที่ไม่จำเป็น**: สถานะเกมและภาษาเริ่มต้นให้ใช้ In-memory State เป็นค่าเริ่มต้นเพื่อป้องกัน Hydration Mismatch
- **ห้ามใส่ Content Data (คำถาม/ข้อมูลกองไพ่) ไว้ใน UI Component**: ต้องแยกไว้ในไฟล์ JSON ภายใต้ `src/content/data/` และส่งออกผ่าน `src/content/` เท่านั้น
- **ห้ามฝังข้อความคำถามลงในไฟล์รูปภาพ SVG ต้นฉบับ**: ข้อความบนการ์ดในหน้าเว็บต้องเรนเดอร์ด้วย HTML เสมอเพื่อการเข้าถึง (Accessibility) และการปรับขนาดตามหน้าจอ (ยกเว้นฟีเจอร์สร้างภาพ `.png` ด้วย `<canvas>` ตอนผู้ใช้กดบันทึกรูปการ์ดคำถาม)
- **ห้ามสร้างภาพซ้ำจำนวนมากโดยไม่จำเป็น**: ต้องใช้ระบบ Reusable Illustration System (`public/illustrations/*.svg`)
- **ห้ามใช้ `Math.random()` กระจายตาม UI Component**: การสุ่มทั้งหมดต้องผ่าน Game Engine (`src/features/game/shuffle.ts`) ที่สามารถส่งฟังก์ชัน PRNG เข้าไปทดสอบได้
- **ห้ามใช้ `any` เพื่อหลบข้อผิดพลาดของ TypeScript**
- **ห้ามใช้ `@ts-ignore`, `@ts-expect-error` หรือปิดกฎ ESLint (`eslint-disable`)** โดยไม่มีเหตุผลทางเทคนิคที่จำเป็นจริง ๆ

---

## 3. Architecture & Separation of Concerns

โครงสร้างหลักต้องแยกส่วนรับผิดชอบออกจากกันอย่างชัดเจน:

- `src/lib/brand.ts`: เก็บชื่อแบรนด์ คำโปรย และค่าคงที่ของแบรนด์ แยกออกจากโค้ดส่วนอื่นเพื่อให้เปลี่ยนชื่อแบรนด์ในอนาคตได้ง่าย
- `src/lib/shareCardImage.ts`: ระบบวาดรูปการ์ดคำถามขนาด Story (`1080×1920`) ด้วย HTML5 Canvas 2D API พร้อมระบบตัดคำภาษาไทย/อังกฤษอัตโนมัติ (`Intl.Segmenter`)
- `src/types/`: เก็บ TypeScript Interfaces และ Types ทั้งหมด (Strict Mode) รองรับระบบ 2 ภาษา (`Locale = 'th' | 'en'`, `LocalizedText`, `LocalizedStringList`)
- `src/i18n/`: เก็บระบบแปลภาษา (`I18nProvider.tsx`) และไฟล์พจนานุกรม JSON (`locales/th.json`, `locales/en.json`)
- `src/content/data/`: เก็บข้อมูล JSON ต้นฉบับทั้งหมด (`illustrations.json`, `decks.json`, `cards/*.json`)
- `src/content/`: Typed wrapper modules (`illustrations.ts`, `decks.ts`, `cards/*.ts`) ที่โหลดข้อมูลจาก `src/content/data/`
- `src/features/game/`: เก็บ Pure Functions ของ Game Engine (`shuffle.ts`, `drawCard.ts`, `gameState.ts`) **ห้าม import React หรือผูกกับ DOM ในโฟลเดอร์นี้**
- `src/components/`: แยกเป็นคอมโพเนนต์ย่อยตามหน้าที่ (`ui/`, `layout/`, `deck/`, และ `game/`) โดยการ์ดเล่นเกม (`PlayingCardBack.tsx`, `PlayingCardFront.tsx`) มีความสูงคงที่และจำกัดข้อความคำถามบนหน้าเว็บสูงสุด 4 บรรทัด (`line-clamp-4`)
- `src/app/`: Next.js App Router pages และ metadata ใช้ Server Components เป็นค่าเริ่มต้น และใส่ `'use client'` เฉพาะส่วนที่ต้องมี State หรือ Browser API

---

## 4. Performance & Asset Rules

1. **SVG Budget**: ไฟล์ภาพประกอบ SVG ใน `public/illustrations/` ต้องมีขนาดไม่เกิน **10 KB** ต่อไฟล์ ไม่ฝัง Base64 Raster Image และไม่มี Filter ที่ซับซ้อนเกินจำเป็น
2. **Zero Unreferenced or Broken Assets**: ไพ่ทุกใบต้องอ้างอิง `illustration` ID ที่มีอยู่ใน Asset Registry จริง มีข้อมูลครบทั้ง 2 ภาษา (`th` และ `en`) และตรวจผ่าน `npm run validate:assets`
3. **Minimal Client JS**: ใช้ CSS Transitions/Animations แทน JS Animation Libraries
4. **Reduced Motion**: แอนิเมชันพลิกไพ่และทรานซิชันทั้งหมดต้องเคารพ `@media (prefers-reduced-motion: reduce)` โดยปรับเป็นการเปลี่ยนสถานะแบบนุ่มนวลแทนการหมุน 3 มิติ (หลีกเลี่ยงการใช้ `animation-duration: 0.01ms` แบบเหมารวมที่ทำให้ภาพกระตุก)
5. **Compositor-friendly Transforms**: กำหนดค่าเริ่มต้น `translate: 0px; rotate: 0deg; scale: 1;` บนองค์ประกอบที่มีการเปลี่ยน Transform ตอน `:hover` หรือเปลี่ยนสถานะ เพื่อป้องกัน Stacking Context กระโดด

---

## 5. Testing & Quality Gates

ทุกครั้งที่แก้ไข Game Logic, Content หรือ UI ต้องรันตรวจสอบตามลำดับ:

1. `npm run lint` — ตรวจสอบคุณภาพโค้ดด้วย ESLint (ต้อง 0 errors และ 0 warnings)
2. `npm run typecheck` — ตรวจสอบชนิดข้อมูลด้วย `tsc --noEmit`
3. `npm run test` — รัน Unit Tests และ Component/Flow Tests ทั้งหมดด้วย Vitest
4. `npm run validate:assets` — ตรวจสอบความถูกต้องของข้อมูลไพ่ JSON 2 ภาษาและขนาดไฟล์ SVG
5. `npm run build` — ตรวจสอบว่า Production Build ผ่านสมบูรณ์
