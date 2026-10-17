# Asset Guidelines — Icebreaker Club

## 1. แนวทางศิลปะและเอกลักษณ์ภาพ (Visual Direction)

Icebreaker Club ใช้ระบบภาพประกอบแบบ **Cute Minimal Hand-drawn Black & White Illustration**:
- ลายเส้นสีดำชาร์โคล (`#1C1917`) บนพื้นหลังสีขาวอมครีมอบอุ่น (`#FAF7F2`)
- ใช้เส้นโค้งมน (`stroke-linecap="round"`, `stroke-linejoin="round"`) ที่ให้ความรู้สึกเหมือนวาดด้วยปากกาหมึกซึมหรือมาร์กเกอร์ลงบนการ์ดจริง
- มีองค์ประกอบตกแต่งเล็ก ๆ เช่น ดาวประกาย จุดไข่ปลา หรือเส้นโค้งแสดงอารมณ์ เพื่อความน่ารักและเป็นมิตร
- **ห้ามฝังข้อความคำถามลงในไฟล์ SVG**: ข้อความบนหน้าเว็บต้องแสดงผลผ่าน HTML เสมอ

---

## 2. ระบบภาพประกอบที่ใช้ซ้ำได้ (Reusable Illustration System)

แทนที่จะสร้างไฟล์ภาพแยกสำหรับไพ่ทุกใบ เราใช้ชุดภาพประกอบต้นฉบับใน `public/illustrations/` ที่กำหนดข้อมูล 2 ภาษา (`titleTh`, `titleEn`, `altTh`, `altEn`) ไว้ใน `src/content/data/illustrations.json` และส่งออกผ่าน `src/content/illustrations.ts`

หมวดหมู่ภาพประกอบหลัก (24 ภาพ):
1. `coffee-chat.svg` — แก้วกาแฟชวนคุย / Coffee Chat
2. `noodle-bowl.svg` — จานโปรดแสนอร่อย / Favorite Dish
3. `sparkles-star.svg` — ประกายความคิด / Sparkling Idea
4. `happy-smile.svg` — รอยยิ้มเป็นมิตร / Friendly Smile
5. `speech-bubbles.svg` — บทสนทนาแลกเปลี่ยน / Conversation Bubbles
6. `high-five.svg` — แท็กมือเพื่อนซี้ / High Five
7. `compass-journey.svg` — เข็มทิศการเดินทาง / Travel Compass
8. `headphones-music.svg` — จังหวะดนตรีในใจ / Music Headphones
9. `book-story.svg` — หนังสือเรื่องราวชีวิต / Open Story Book
10. `camera-memory.svg` — กล้องบันทึกความทรงจำ / Vintage Camera
11. `clock-time.svg` — เข็มนาฬิกาและกาลเวลา / Timepiece Clock
12. `hobby-palette.svg` — จานสีงานอดิเรก / Art Palette
13. `twin-hearts.svg` — หัวใจสองดวง / Twin Hearts
14. `love-letter.svg` — จดหมายเปิดใจ / Love Letter
15. `holding-hands.svg` — จับมือเคียงข้าง / Holding Hands
16. `moon-stars.svg` — คืนเดือนหงาย / Moon and Stars
17. `gift-box.svg` — ของขวัญเซอร์ไพรส์ / Surprise Gift Box
18. `home-cozy.svg` — พื้นที่ปลอดภัยของเรา / Cozy Home
19. `cheers-glasses.svg` — ชนแก้วสังสรรค์ / Cheers Glasses
20. `party-confetti.svg` — ปาร์ตี้สุดเหวี่ยง / Party Confetti
21. `dice-luck.svg` — ลูกเต๋าเสี่ยงทาย / Lucky Dice
22. `megaphone-vote.svg` — เปิดโหวตหน้าวง / Group Vote Megaphone
23. `trophy-crown.svg` — แชมป์ประจำวง / Champion Trophy
24. `lightning-dare.svg` — สายฟ้าท้าทาย / Lightning Dare

---

## 3. ข้อกำหนดทางเทคนิคของไฟล์ SVG

1. **ViewBox มาตรฐาน**: ใช้ `viewBox="0 0 120 120"` เพื่อให้จัดวางในการ์ดและวาดลง `<canvas>` ได้สม่ำเสมอทุกใบ
2. **ขนาดไฟล์ (File Size Budget)**:
   - งบประมาณสูงสุดต่อไฟล์: **10 KB (10,240 bytes)**
   - ขนาดจริงปัจจุบัน: **377 – 753 bytes** ต่อไฟล์ (รวมทั้ง 24 ไฟล์เพียง **11.70 KB**)
3. **ข้อห้ามในไฟล์ SVG**:
   - ห้ามมี `<image>` หรือข้อมูล `data:image/...;base64` ฝังอยู่ภายใน
   - ห้ามมี `<script>` หรือ Event Handlers (`onload`, `onclick` ฯลฯ)
   - ห้ามใช้ `<filter>` ที่ซับซ้อนซึ่งทำให้เบราว์เซอร์มือถือเรนเดอร์ช้า
4. **การตั้งชื่อไฟล์**: ใช้ตัวพิมพ์เล็กคั่นด้วยขีดกลาง (`kebab-case.svg`) และต้องตรงกับ `id` ใน `src/content/data/illustrations.json`

---

## 4. การตรวจสอบความถูกต้องอัตโนมัติ (`scripts/validate-assets.mjs`)

ทุกครั้งที่รัน `npm run validate:assets` สคริปต์จะตรวจสอบ:
- ไฟล์ SVG ทุกไฟล์ใน `public/illustrations/` มีโครงสร้าง `<svg ... viewBox="...">...</svg>` ที่ถูกต้องและไม่มี Base64 หรือ Script แปลกปลอม
- ขนาดไฟล์ทุกไฟล์ไม่เกิน Budget 10 KB พร้อมแสดงตารางรายงานขนาดไฟล์จริง
- ข้อมูลใน `src/content/data/illustrations.json`, `src/content/data/decks.json` และ `src/content/data/cards/*.json` มีข้อความครบทั้งภาษาไทย (`th`) และอังกฤษ (`en`)
- ไม่มี `id` ของภาพประกอบหรือไพ่ซ้ำกัน และไม่มีคำถาม (`prompt.th` หรือ `prompt.en`) ซ้ำกันในทั้ง 96 ใบ
- ไพ่ทุกใบและภาพปกทุกกองอ้างอิง `illustration` ที่มีไฟล์จริงอยู่ครบถ้วน และไม่มีไฟล์ SVG ที่ไม่ได้ใช้งาน (Unused Assets)
