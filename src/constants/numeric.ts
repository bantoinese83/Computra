/**
 * Centralized numeric constants
 * All magic numbers should be defined here for maintainability
 */

// Timeouts and Delays (in milliseconds)
export const TIMEOUTS = {
  COPY_LINK_FEEDBACK: 2500,
  FOCUS_DELAY: 100,
  ANIMATION_SHORT: 200,
  ANIMATION_MEDIUM: 300,
  ANIMATION_LONG: 500,
  ANIMATION_EXTRA_LONG: 700,
} as const;

// Limits and Constraints
export const LIMITS = {
  MAX_COMPARISON_OFFERS: 4,
  MAX_GROUNDING_SOURCES_DISPLAY: 5,
  PRICE_DECIMAL_PLACES: 3,
  LOG_MESSAGE_MAX_LENGTH: 100,
} as const;

// Icon Sizes (in pixels)
export const ICON_SIZES = {
  XS: 12,
  SM: 14,
  MD: 16,
  LG: 18,
  XL: 20,
  XXL: 22,
  XXXL: 24,
  HUGE: 32,
  EXTRA_HUGE: 36,
} as const;

// Z-Index Layers
export const Z_INDEX = {
  BASE: 0,
  DROPDOWN: 10,
  STICKY: 20,
  HEADER: 30,
  FLOATING: 40,
  MODAL: 50,
} as const;

// Scale Values (for animations)
export const SCALE = {
  ACTIVE_PRESS: 0.98,
  HOVER_LIFT: 1.05,
  ACTIVE_PRESS_ALT: 0.95,
} as const;

// Stroke Widths
export const STROKE_WIDTH = {
  THIN: 2,
  MEDIUM: 3,
  THICK: 4,
} as const;

// Spacing and Dimensions (in pixels)
export const SPACING = {
  CHAT_WINDOW_WIDTH: 384, // 24rem
  CHAT_WINDOW_HEIGHT: 512, // 32rem
  MAX_SOURCE_TITLE_WIDTH: 200,
} as const;

// Animation Durations (in milliseconds)
export const ANIMATION_DURATION = {
  INSTANT: 150,
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 700,
} as const;

// Opacity Values
export const OPACITY = {
  HIDDEN: 0,
  SEMI_TRANSPARENT: 0.5,
  VISIBLE: 1,
} as const;

// Percentage Values
export const PERCENTAGE = {
  MESSAGE_MAX_WIDTH: 85,
  MODAL_MAX_HEIGHT: 90,
} as const;

// API Configuration
export const API_CONFIG = {
  GEMINI_TEMPERATURE: 0.2,
  MIN_RECOMMENDATION_LINES: 4,
  MIN_SPEC_LINES: 4,
  MIN_OFFER_LINES: 6,
} as const;

