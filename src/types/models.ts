import { GpuTier, Commitment } from './enums';

/**
 * GPU specification data model
 * Represents the technical specifications of a GPU
 */
export interface GpuSpec {
  id: string;
  name: string;
  vram: number; // GB
  tier: GpuTier;
  fp16Tflops: number;
}

/**
 * Provider offer data model
 * Represents a compute offer from a cloud provider
 */
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

/**
 * Recommendation result data model
 * Represents the AI-generated recommendation for the user
 */
export interface RecommendationResult {
  tier: GpuTier;
  suggestedGpus: string[]; // GPU IDs
  explanation: string;
  priceRange: string;
}

