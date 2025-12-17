import { GpuSpec, GpuTier } from '../types';

/**
 * Static GPU specifications database
 * Contains default GPU specs that can be overridden by API responses
 */
export const GPUS: Record<string, GpuSpec> = {
  't4': { id: 't4', name: 'NVIDIA T4', vram: 16, tier: GpuTier.ENTRY, fp16Tflops: 65 },
  'l4': { id: 'l4', name: 'NVIDIA L4', vram: 24, tier: GpuTier.ENTRY, fp16Tflops: 120 },
  'a10g': { id: 'a10g', name: 'NVIDIA A10G', vram: 24, tier: GpuTier.MID, fp16Tflops: 125 },
  'a100-40': { id: 'a100-40', name: 'NVIDIA A100 (40GB)', vram: 40, tier: GpuTier.HIGH, fp16Tflops: 312 },
  'a100-80': { id: 'a100-80', name: 'NVIDIA A100 (80GB)', vram: 80, tier: GpuTier.HIGH, fp16Tflops: 312 },
  'h100': { id: 'h100', name: 'NVIDIA H100', vram: 80, tier: GpuTier.EXTREME, fp16Tflops: 989 },
  'rtx4090': { id: 'rtx4090', name: 'NVIDIA RTX 4090', vram: 24, tier: GpuTier.MID, fp16Tflops: 82 }, // Consumer card, good for budget
};

