# 🎴 Icebreaker Club — Spark Conversations & Break the Ice

> **"Spark meaningful conversations, deepen connections, and bring genuine laughter to every table."**
> 
> A free, bilingual (**Thai / English**) digital card game playable directly in your browser. Zero downloads, no sign-ups, no ads, and 100% free forever.

---

## 🌟 The Vision Behind Icebreaker Club

Have you ever experienced moments like these?
- Sitting with new friends or colleagues where awkward silence takes over, and nobody knows what to ask next.
- On a date or hanging out with your partner, looking for thoughtful questions that uncover new perspectives without causing drama.
- At a house party or road trip, searching for a quick, inclusive game where everyone can join in without peer pressure.

**Icebreaker Club** was created as a welcoming, judgment-free space to ignite memorable conversations. Just open the website, place your phone in the middle of the table (or pass it around), draw a card, and let the stories flow in seconds.

---

## 🎯 3 Thoughtfully Curated Decks (96 Bilingual Cards)

All cards are stored as structured bilingual JSON data (`TH` and `EN`), crafted to match three distinct social vibes:

### 1. ☕ Get to Know (`get-to-know`) — 32 Cards
*For new friends, teammates, dinner meetups, or any group breaking the ice.*
- **Themes**: Comfort food, dream weekend mornings, bucket-list travel, formative memories, creative hobbies, and gentle philosophical reflections.
- **Tone**: Warm, approachable, easy to answer, and strictly non-intrusive.

### 2. ❤️ Couples Edition (`couples`) — 32 Cards
*For dating partners, couples, or long-time companions seeking deeper intimacy.*
- **Themes**: First impressions, cherished micro-moments, love languages, how to comfort each other on tough days, and shared dreams for the future.
- **Tone**: Positive, tender, safe, with zero trap questions or forced confessions.

### 3. 🍻 Party & Drinks (`party-drinks`) — 32 Cards
*For social gatherings, house parties, game nights, and road trips.*
- **Themes**: Fast-paced group votes, lighthearted dares, mini-challenges, and hilarious confessions.
- **Inclusivity & Safety**: Non-drinkers are fully embraced. Anyone can substitute a sip with water, soda, or a funny gesture—and every card can be skipped without explanation.

---

## ✨ Key Highlights & Features

- ⚡ **Zero-Friction Minimal UX**: Clean, distraction-free landing page with an immediate 3-step guide and tactile deck covers. Tap and play within seconds.
- 🌐 **Instant Bilingual Toggle (`TH | EN`)**: Seamlessly switch between Thai and English at any time from the top navigation bar. Every prompt, button, and deck description updates instantaneously.
- 🎚️ **Adjustable Intensity Filters**: Tailor the mood of your gathering with 3 intensity levels (*Level 1: Chill Warm-up*, *Level 2: Story Starters*, *Level 3: Deeper Reflections/Party Energy*) or shuffle *All Levels Mixed*.
- 📸 **Downloadable Story Cards (Social-Ready)**: Love a particular prompt? Tap **"⬇ Save Card Image"** to instantly generate and download a clean, high-resolution story card (`1080×1920 px`). Perfectly formatted with native Thai/English hyphenation (`Intl.Segmenter`) for Instagram Stories, Facebook, or group chats.
- 🃏 **Tactile Physical Card Feel**:
  - Handcrafted warm editorial aesthetics with cream backgrounds (`#FAF7F2`), deep crimson accents (`#9F1D2C`), and charcoal ink (`#1C1917`).
  - 24 custom hand-drawn black & white SVG illustrations totaling just ~11.7 KB.
  - Smooth 3D draw-and-flip card animations with full support for `prefers-reduced-motion`.
  - Constant card heights and a 4-line prompt clamp to ensure buttons never jump unexpectedly on mobile screens.
- 🔒 **Privacy-First & Completely Free**: Zero user tracking, no database, no logins, and zero AI inference cost during gameplay. Blazing fast, static-ready, and lightweight.

---

## 🎮 How to Play in 3 Simple Steps

```text
  [ 1. Pick a Deck ]  ──>  [ 2. Tap to Draw ]  ──>  [ 3. Chat or Skip Anytime ]
```

1. **Pick a Deck**: Choose the deck that matches your group's current vibe (*Get to Know*, *Couples*, or *Party & Drinks*).
2. **Tap to Reveal**: The person who draws reads the card out loud and shares their answer first, then opens the floor to the group.
3. **Skip Without Pressure**: If anyone feels hesitant or uncomfortable with a question, simply tap **"Skip This Card"**—no justification needed.

---

## 🛠️ The Tech Stack

Engineered using a modern, static-first architecture for maximum speed, resilience, and free-tier hosting:

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Components & Static Site Generation)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Game Engine**: Pure TypeScript Functions (Fisher–Yates Shuffle with deterministic seeded PRNG testing)
- **Data & Localization**: Clean JSON data (`src/content/data/`) + Hydration-safe React Context I18n Provider
- **Canvas Rendering**: HTML5 Canvas 2D API for high-resolution 9:16 story card export
- **Testing & Quality Gates**: [Vitest](https://vitest.dev/), React Testing Library, ESLint

---

## 💻 Getting Started (Local Development)

Interested in exploring the codebase or contributing?

### Prerequisites
- **Node.js**: `18.18+` or `20+` / `22+` / `24+`
- **npm**: `9+`

### Installation & Run

```bash
# 1. Clone the repository
git clone https://github.com/your-username/ice-breaker-club.git
cd ice-breaker-club

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License & Community

Icebreaker Club is free and open for personal and community use. Built with ❤️ to bring people closer, one conversation at a time.
