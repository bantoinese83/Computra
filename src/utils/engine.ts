import { UserPreferences } from '../types';

export const generatePrompt = (prefs: UserPreferences): string => {
  return `
    Act as a cloud infrastructure expert. Analyze the following user requirements for AI Compute:
    ${JSON.stringify(prefs, null, 2)}

    TASK 1: RECOMMENDATION
    Analyze the workload and recommend a specific GPU Tier (Entry, Mid, High, or Extreme) and a list of specific GPU models that fit the criteria.

    TASK 2: MARKET SEARCH
    Use Google Search to find the CURRENT, REAL-TIME hourly rental prices for the recommended GPUs. Look for providers like Lambda Labs, RunPod, Vast.ai, CoreWeave, AWS, GCP, and Azure.
    Prioritize the region: ${prefs.region || 'Any'}.
    Prioritize commitment: ${prefs.commitment || 'On-Demand'}.
    
    IMPORTANT: Also find the technical specifications (vRAM size in GB, FP16 TFLOPS) for every GPU model you recommend or find offers for.

    TASK 3: OUTPUT FORMAT
    You MUST output the data in the following strictly structured format so it can be parsed programmatically.

    BLOCK_REC_START
    [Tier Name]
    [Comma-separated list of recommended GPU IDs, e.g. h100, a100-80, l40s]
    [Explanation string]
    [Estimated Price Range string, e.g. "$0.50 - $2.00 / hr"]
    BLOCK_REC_END

    BLOCK_SPECS_START
    Format each GPU spec on a new line:
    ID|Name|vRAM (GB number)|FP16 TFLOPS (number)|Tier (Entry/Mid/High/Extreme)
    Example: h100|NVIDIA H100|80|989|Extreme
    BLOCK_SPECS_END

    BLOCK_OFFERS_START
    Format each offer on a new line using pipes (|) as delimiters:
    Provider Name|GPU ID (must match an ID in BLOCK_SPECS)|Region|Price (just the number)|Commitment (On-Demand/Spot/Reserved)|URL
    Example: Lambda|h100|US-East|2.49|On-Demand|https://lambdalabs.com/pricing
    BLOCK_OFFERS_END

    Find at least 5-8 distinct offers. Ensure every GPU ID used in offers is defined in BLOCK_SPECS.
  `;
};


