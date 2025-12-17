import { 
  GpuSpec, 
  GpuTier, 
  Region, 
  Commitment,
  WorkloadType,
  ModelSize,
  LatencyTolerance,
  BudgetSensitivity
} from './types';

// --- Static Database ---

export const GPUS: Record<string, GpuSpec> = {
  't4': { id: 't4', name: 'NVIDIA T4', vram: 16, tier: GpuTier.ENTRY, fp16Tflops: 65 },
  'l4': { id: 'l4', name: 'NVIDIA L4', vram: 24, tier: GpuTier.ENTRY, fp16Tflops: 120 },
  'a10g': { id: 'a10g', name: 'NVIDIA A10G', vram: 24, tier: GpuTier.MID, fp16Tflops: 125 },
  'a100-40': { id: 'a100-40', name: 'NVIDIA A100 (40GB)', vram: 40, tier: GpuTier.HIGH, fp16Tflops: 312 },
  'a100-80': { id: 'a100-80', name: 'NVIDIA A100 (80GB)', vram: 80, tier: GpuTier.HIGH, fp16Tflops: 312 },
  'h100': { id: 'h100', name: 'NVIDIA H100', vram: 80, tier: GpuTier.EXTREME, fp16Tflops: 989 },
  'rtx4090': { id: 'rtx4090', name: 'NVIDIA RTX 4090', vram: 24, tier: GpuTier.MID, fp16Tflops: 82 }, // Consumer card, good for budget
};

// OFFERS removed to use Google Search Grounding dynamic data

// --- Questionnaire Metadata ---

export const STEPS = [
  {
    id: 'workload',
    title: 'What are you working on?',
    description: 'Tell us what you mainly need the compute for.',
    tooltip: 'Training teaches a model; inference uses an existing model to answer questions.',
    options: Object.values(WorkloadType)
  },
  {
    id: 'modelSize',
    title: 'How big is your model?',
    description: 'Roughly how heavy is the model or workload you are running?',
    tooltip: 'Bigger models need more powerful machines and more memory.',
    options: Object.values(ModelSize)
  },
  {
    id: 'budget',
    title: 'Budget vs. speed',
    description: 'How do you balance cost and performance?',
    tooltip: 'Budget friendly favors cheaper machines; performance first favors faster machines even if they cost more.',
    options: Object.values(BudgetSensitivity)
  },
  {
    id: 'latency',
    title: 'Speed of responses',
    description: 'Do you need instant responses, or can your jobs wait a bit?',
    tooltip: 'Real-time means snappy responses for end users; batching is better for jobs that can run in the background and usually costs less.',
    options: Object.values(LatencyTolerance)
  },
  {
    id: 'region',
    title: 'Where should the servers live?',
    description: 'Pick a general region based on your users or data.',
    tooltip: 'Choose a region close to your users for lower delays, or a cheaper region for background training.',
    options: Object.values(Region)
  },
  {
    id: 'commitment',
    title: 'How flexible do you need to be?',
    description: 'Choose how long you expect to keep the machines running.',
    tooltip: 'On-demand is pay-as-you-go. Short‑term deals can be cheaper but may be interrupted. Long‑term deals trade commitment for lower prices.',
    options: Object.values(Commitment)
  }
];


