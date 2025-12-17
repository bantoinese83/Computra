export enum WorkloadType {
  TRAINING = 'Training',
  INFERENCE = 'Inference',
  FINE_TUNING = 'Fine-Tuning'
}

export enum ModelSize {
  SMALL = 'Small (<7B params)',
  MEDIUM = 'Medium (7B-30B params)',
  LARGE = 'Large (30B-70B params)',
  HUGE = 'Huge (70B+ / Multi-modal)'
}

export enum BudgetSensitivity {
  LOW = 'Budget Conscious',
  BALANCED = 'Balanced',
  PERFORMANCE = 'Performance First'
}

export enum LatencyTolerance {
  REALTIME = 'Real-time (Low Latency)',
  BATCH = 'Batch Processing (High Latency)'
}

export enum Region {
  US = 'United States',
  EU = 'Europe',
  APAC = 'Asia Pacific',
  GLOBAL = 'Any / Global'
}

export enum Commitment {
  ON_DEMAND = 'On-Demand',
  SPOT = 'Spot / Interruptible',
  RESERVED = 'Reserved'
}

export enum GpuTier {
  ENTRY = 'Entry',
  MID = 'Mid',
  HIGH = 'High',
  EXTREME = 'Extreme'
}

// Configuration State
export interface UserPreferences {
  workload: WorkloadType | null;
  modelSize: ModelSize | null;
  budget: BudgetSensitivity | null;
  latency: LatencyTolerance | null;
  region: Region | null;
  commitment: Commitment | null;
}

// Data Models
export interface GpuSpec {
  id: string;
  name: string;
  vram: number; // GB
  tier: GpuTier;
  fp16Tflops: number;
}

export interface ProviderOffer {
  id: string;
  providerName: string;
  gpuId: string;
  region: string; // Changed to string to accommodate search results
  pricePerHour: number;
  commitment: Commitment;
  url: string; // Changed from affiliateSlug to url
  isVerified?: boolean;
}

export interface RecommendationResult {
  tier: GpuTier;
  suggestedGpus: string[]; // GPU IDs
  explanation: string;
  priceRange: string;
}


