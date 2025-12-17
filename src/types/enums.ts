/**
 * Enum definitions for the application
 * These enums represent the various options and categories used throughout the app
 */

/**
 * Type of AI workload the user needs compute for
 */
export enum WorkloadType {
  TRAINING = 'Training',
  INFERENCE = 'Inference',
  FINE_TUNING = 'Fine-Tuning',
}

/**
 * Size category of the AI model
 */
export enum ModelSize {
  SMALL = 'Small (<7B params)',
  MEDIUM = 'Medium (7B-30B params)',
  LARGE = 'Large (30B-70B params)',
  HUGE = 'Huge (70B+ / Multi-modal)',
}

/**
 * Budget sensitivity preference
 */
export enum BudgetSensitivity {
  LOW = 'Budget Conscious',
  BALANCED = 'Balanced',
  PERFORMANCE = 'Performance First',
}

/**
 * Latency tolerance for the workload
 */
export enum LatencyTolerance {
  REALTIME = 'Real-time (Low Latency)',
  BATCH = 'Batch Processing (High Latency)',
}

/**
 * Geographic region preference
 */
export enum Region {
  US = 'United States',
  EU = 'Europe',
  APAC = 'Asia Pacific',
  GLOBAL = 'Any / Global',
}

/**
 * Commitment level for compute resources
 */
export enum Commitment {
  ON_DEMAND = 'On-Demand',
  SPOT = 'Spot / Interruptible',
  RESERVED = 'Reserved',
}

/**
 * GPU performance tier classification
 */
export enum GpuTier {
  ENTRY = 'Entry',
  MID = 'Mid',
  HIGH = 'High',
  EXTREME = 'Extreme',
}

