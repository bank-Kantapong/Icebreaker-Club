export type Locale = 'th' | 'en';

export interface LocalizedText {
  readonly th: string;
  readonly en: string;
}

export interface LocalizedStringList {
  readonly th: readonly string[];
  readonly en: readonly string[];
}

export type DeckSlug = 'get-to-know' | 'couples' | 'party-drinks';

export type CardType = 'question' | 'mission' | 'vote' | 'wildcard';

export type CardIntensity = 1 | 2 | 3;

export type IntensityFilter = 'all' | CardIntensity;

export type IllustrationId =
  | 'coffee-chat'
  | 'noodle-bowl'
  | 'sparkles-star'
  | 'happy-smile'
  | 'speech-bubbles'
  | 'high-five'
  | 'compass-journey'
  | 'headphones-music'
  | 'book-story'
  | 'camera-memory'
  | 'clock-time'
  | 'hobby-palette'
  | 'twin-hearts'
  | 'love-letter'
  | 'holding-hands'
  | 'moon-stars'
  | 'gift-box'
  | 'home-cozy'
  | 'cheers-glasses'
  | 'party-confetti'
  | 'dice-luck'
  | 'megaphone-vote'
  | 'trophy-crown'
  | 'lightning-dare';

export interface IllustrationAsset {
  id: IllustrationId;
  path: `/illustrations/${IllustrationId}.svg`;
  titleTh: string;
  titleEn: string;
  altTh: string;
  altEn: string;
  category: 'general' | 'couples' | 'party';
}

export interface IcebreakerCard {
  id: string;
  deckId: DeckSlug;
  type: CardType;
  prompt: LocalizedText;
  followUp?: LocalizedText;
  illustration: IllustrationId;
  intensity: CardIntensity;
  tags: LocalizedStringList;
}

export interface IntensityLevelMeta {
  level: CardIntensity;
  label: LocalizedText;
  description: LocalizedText;
}

export interface DeckDefinition {
  id: DeckSlug;
  slug: DeckSlug;
  titleTh: string;
  titleEn: string;
  badgeText: LocalizedText;
  shortDescription: LocalizedText;
  longDescription: LocalizedText;
  audienceLabel: LocalizedText;
  recommendedPlayers: LocalizedText;
  coverIllustration: IllustrationId;
  accentColorHex: string;
  accentBgClass: string;
  accentTextClass: string;
  accentBorderClass: string;
  howToPlaySteps: LocalizedStringList;
  safetyNotice?: LocalizedText;
  intensityLevels: readonly IntensityLevelMeta[];
}

export type GamePhase = 'empty' | 'ready' | 'playing' | 'completed';

export interface GameSessionState {
  deckId: DeckSlug;
  intensityFilter: IntensityFilter;
  /** Shuffled cards for the current round */
  cards: readonly IcebreakerCard[];
  /** Index of the active card in `cards` (0-indexed) */
  currentIndex: number;
  /** Whether the current card face is flipped open */
  isCurrentCardRevealed: boolean;
  /** IDs of cards that were flipped and read in this round */
  playedCardIds: readonly string[];
  /** IDs of cards that were skipped in this round */
  skippedCardIds: readonly string[];
  /** Current round number (increments on reset) */
  round: number;
  /** Current game lifecycle phase */
  phase: GamePhase;
}
