import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import HomePage from '@/app/page';
import { DECKS } from '@/content/decks';
import { GET_TO_KNOW_CARDS } from '@/content/cards/get-to-know';
import { I18nProvider } from '@/i18n/I18nProvider';
import { Header } from '@/components/layout/Header';
import { DeckSetupPanel } from '@/components/deck/DeckSetupPanel';
import { GameBoard } from '@/components/game/GameBoard';
import { wrapTextLines } from '@/lib/shareCardImage';

const pushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe('User Flow, Bilingual i18n & Story Share Integration Tests', () => {
  it('renders minimal Home Page with top 3-step how-to strip and immediate 3 decks', () => {
    render(
      <I18nProvider>
        <HomePage />
      </I18nProvider>
    );

    // Compact how-to strip at the very top
    expect(
      screen.getByLabelText(/วิธีเล่นง่าย ๆ 3 ขั้นตอน/i)
    ).toBeInTheDocument();

    // Concise heading
    expect(
      screen.getByRole('heading', {
        name: /เลือกสำรับไพ่ แล้วเริ่มคุยกันเลย/i,
      })
    ).toBeInTheDocument();

    // All 3 decks rendered immediately with titles and 32 card count badges
    for (const deck of DECKS) {
      expect(
        screen.getByRole('heading', { name: deck.titleTh })
      ).toBeInTheDocument();
    }
    expect(screen.getAllByText('32 ใบ').length).toBeGreaterThanOrEqual(3);
  });

  it('switches language between Thai (TH) and English (EN) dynamically across UI and decks', () => {
    render(
      <I18nProvider>
        <Header />
        <HomePage />
      </I18nProvider>
    );

    // Initially in Thai
    expect(
      screen.getByRole('heading', {
        name: /เลือกสำรับไพ่ แล้วเริ่มคุยกันเลย/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('เลือกกองไพ่')).toBeInTheDocument();

    // Click EN button in LanguageSwitcher
    const enBtn = screen.getByRole('button', { name: 'EN' });
    fireEvent.click(enBtn);

    // Heading, aria-label, and deck titles switch to English
    expect(
      screen.getByRole('heading', {
        name: /Pick a Deck & Spark the Conversation/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Choose a card deck')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Get to Know' })
    ).toBeInTheDocument();
    expect(screen.getAllByText('32 cards').length).toBeGreaterThanOrEqual(3);
  });

  it('allows selecting intensity in DeckSetupPanel and navigates to Play screen with chosen filter', () => {
    pushMock.mockReset();
    const deck = DECKS[0]!;
    render(
      <I18nProvider>
        <DeckSetupPanel deck={deck} cards={GET_TO_KNOW_CARDS} />
      </I18nProvider>
    );

    // Default is all 32 cards
    expect(screen.getByText('พร้อมเล่น 32 ใบ')).toBeInTheDocument();

    // Select Intensity Level 1
    const level1Radio = screen.getByRole('radio', {
      name: /ระดับ 1 • อุ่นเครื่องสบาย ๆ/i,
    });
    fireEvent.click(level1Radio);

    expect(screen.getByText('พร้อมเล่น 11 ใบ')).toBeInTheDocument();

    // Click Start Game
    const startBtn = screen.getByRole('button', {
      name: /เริ่มเล่นกองนี้ \(11 ใบ\)/i,
    });
    fireEvent.click(startBtn);

    expect(pushMock).toHaveBeenCalledWith('/play/get-to-know?intensity=1');
  });

  it('completes full Playing Screen flow: unrevealed -> reveal (shows Save Card Image button) -> skip -> play until exhausted -> reset new round', () => {
    const deck = DECKS[0]!;
    const miniCards = GET_TO_KNOW_CARDS.slice(0, 3);

    render(
      <I18nProvider>
        <GameBoard
          deck={deck}
          allDeckCards={miniCards}
          initialIntensity="all"
        />
      </I18nProvider>
    );

    // 1. Initially unrevealed: 0 played, 3 remaining, 0 skipped
    expect(screen.getByTestId('played-count')).toHaveTextContent('0 ใบ');
    expect(screen.getByTestId('remaining-count')).toHaveTextContent('3 ใบ');
    expect(screen.getByTestId('skipped-count')).toHaveTextContent('0 ใบ');
    expect(
      screen.getByRole('heading', { name: /แตะที่ไพ่เพื่อเปิดใบแรก/i })
    ).toBeInTheDocument();

    // Ensure no card prompt is leaked before reveal
    for (const c of miniCards) {
      expect(screen.queryByText(c.prompt.th)).not.toBeInTheDocument();
    }

    // 2. Reveal card #1
    const revealButtons = screen.getAllByRole('button', {
      name: /เปิดไพ่ใบนี้/i,
    });
    fireEvent.click(revealButtons[0]!);

    expect(screen.getByTestId('played-count')).toHaveTextContent('1 ใบ');
    expect(screen.getByTestId('remaining-count')).toHaveTextContent('2 ใบ');

    // Save card image button appears when card is revealed
    expect(
      screen.getByRole('button', { name: /บันทึกรูปการ์ดคำถาม/i })
    ).toBeInTheDocument();

    // 3. Skip card #1 -> moves to card #2 and marks 1 skipped
    const skipBtn = screen.getByRole('button', { name: /ข้ามไพ่ใบนี้/i });
    fireEvent.click(skipBtn);

    expect(screen.getByTestId('skipped-count')).toHaveTextContent('1 ใบ');
    expect(screen.getByTestId('played-count')).toHaveTextContent('1 ใบ');
    expect(screen.getByTestId('remaining-count')).toHaveTextContent('1 ใบ');

    // 4. Advance to card #3 (last card)
    const nextBtn = screen.getByRole('button', { name: /ไพ่ใบถัดไป/i });
    fireEvent.click(nextBtn);

    expect(screen.getByTestId('played-count')).toHaveTextContent('2 ใบ');
    expect(screen.getByTestId('remaining-count')).toHaveTextContent('0 ใบ');

    // 5. Finish round
    const finishBtn = screen.getByRole('button', { name: /สรุปจบรอบ/i });
    fireEvent.click(finishBtn);

    expect(screen.getByTestId('round-complete-screen')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /จบสำรับ .*ทำความรู้จัก.* รอบนี้/i })
    ).toBeInTheDocument();

    // 6. Start a new round without reloading
    const restartBtn = screen.getByRole('button', {
      name: /สับไพ่เริ่มรอบใหม่/i,
    });
    fireEvent.click(restartBtn);

    expect(screen.getByText('รอบที่ 2')).toBeInTheDocument();
    expect(screen.getByTestId('played-count')).toHaveTextContent('0 ใบ');
    expect(screen.getByTestId('remaining-count')).toHaveTextContent('3 ใบ');
    expect(screen.getByTestId('skipped-count')).toHaveTextContent('0 ใบ');
  });

  it('handles keyboard Enter/Space on card back and EmptyDeckView recovery flow', () => {
    const deck = DECKS[0]!;
    const onlyLevel1Cards = GET_TO_KNOW_CARDS.filter(
      (c) => c.intensity === 1
    ).slice(0, 2);

    // Start with intensity=3 when only level 1 cards exist -> triggers EmptyDeckView
    render(
      <I18nProvider>
        <GameBoard
          deck={deck}
          allDeckCards={onlyLevel1Cards}
          initialIntensity={3}
        />
      </I18nProvider>
    );

    expect(
      screen.getByRole('heading', { name: /ไม่พบไพ่ในตัวเลือกนี้/i })
    ).toBeInTheDocument();

    // Click "แสดงไพ่ทุกระดับ" to recover from empty filter state
    const showAllBtn = screen.getByRole('button', {
      name: /แสดงไพ่ทุกระดับ/i,
    });
    fireEvent.click(showAllBtn);

    expect(screen.getByTestId('remaining-count')).toHaveTextContent('2 ใบ');

    // Trigger reveal via keyboard Enter on the card back button
    const cardBackButtons = screen.getAllByRole('button', {
      name: /เปิดไพ่ใบนี้/i,
    });
    fireEvent.keyDown(cardBackButtons[0]!, { key: 'Enter' });

    expect(screen.getByTestId('played-count')).toHaveTextContent('1 ใบ');
    expect(screen.getByTestId('remaining-count')).toHaveTextContent('1 ใบ');
  });

  it('wraps Thai prompts containing spaces without overflowing maxWidth', () => {
    const fakeCtx = {
      measureText: (str: string) => ({ width: str.length * 22 }),
    } as unknown as CanvasRenderingContext2D;

    const prompt =
      'เวลาที่คุณเหนื่อยมาก ๆ จากข้างนอก การกระทำแบบไหนของอีกฝ่ายที่ช่วยฮีลใจคุณได้ดีที่สุด?';
    const maxWidth = 680;
    const lines = wrapTextLines(fakeCtx, prompt, maxWidth, 'th');

    expect(lines.length).toBeGreaterThanOrEqual(3);
    for (const line of lines) {
      expect(fakeCtx.measureText(line).width).toBeLessThanOrEqual(maxWidth);
    }
  });
});
