import { useEffect, useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { generatePrompt } from '../utils/engine';
import { logger } from '../utils/logger';
import { getCachedResults, setCachedResults } from '../utils/cache';
import {
  Commitment,
  GpuSpec,
  GpuTier,
  ProviderOffer,
  RecommendationResult,
  UserPreferences,
} from '../types';
import { GPUS, API_CONFIG } from '../constants';

interface UseGpuRecommendationsResult {
  recommendation: RecommendationResult | null;
  offers: ProviderOffer[];
  gpuSpecs: Record<string, GpuSpec>;
  groundingSources: { title: string; uri: string }[];
  isLoading: boolean;
  error: string | null;
}

export function useGpuRecommendations(prefs: UserPreferences): UseGpuRecommendationsResult {
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [offers, setOffers] = useState<ProviderOffer[]>([]);
  const [gpuSpecs, setGpuSpecs] = useState<Record<string, GpuSpec>>(GPUS);
  const [groundingSources, setGroundingSources] = useState<{ title: string; uri: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const run = async () => {
      // Guard: missing required preferences
      if (!prefs.workload) {
        setRecommendation(null);
        setOffers([]);
        setGpuSpecs(GPUS);
        setGroundingSources([]);
        setIsLoading(false);
        setError('We could not read your answers. Please go back and complete the questions.');
        return;
      }

      // Check cache first
      const cached = getCachedResults(prefs);
      if (cached) {
        setRecommendation(cached.recommendation);
        setOffers(cached.offers);
        setGpuSpecs(cached.gpuSpecs);
        setGroundingSources(cached.groundingSources);
        setIsLoading(false);
        setError(null);
        return; // Use cached data, skip API call
      }

      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        setIsLoading(false);
        setError('This tool needs to be set up before it can show suggestions.');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = generatePrompt(prefs);

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            tools: [{ googleSearch: {} }],
            temperature: API_CONFIG.GEMINI_TEMPERATURE,
          },
        });

        if (isCancelled) return;

        const text = response.text || '';

        // Grounding sources
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources = chunks
          .filter((c: any) => c.web?.uri && c.web?.title)
          .map((c: any) => ({ title: c.web.title, uri: c.web.uri }));
        setGroundingSources(sources);

        // Parse structured blocks and cache results
        const parsedData = parseResponse(text, sources);
        
        // Cache the results if we have valid data
        if (parsedData.recommendation && parsedData.offers.length > 0) {
          setCachedResults(prefs, {
            recommendation: parsedData.recommendation,
            offers: parsedData.offers,
            gpuSpecs: parsedData.gpuSpecs,
            groundingSources: sources,
          });
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        logger.error('Failed to fetch GPU recommendations from Gemini API', error, {
          workload: prefs.workload,
          modelSize: prefs.modelSize,
          region: prefs.region,
        });
        if (!isCancelled) {
          setError('We could not fetch offers right now. Please try again in a moment.');
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    const parseResponse = (
      text: string,
      sources: { title: string; uri: string }[],
    ): {
      recommendation: RecommendationResult | null;
      offers: ProviderOffer[];
      gpuSpecs: Record<string, GpuSpec>;
    } => {
      try {
        let parsedRecommendation: RecommendationResult | null = null;

        // Recommendation block
        const recBlockMatch = text.match(/BLOCK_REC_START([\s\S]*?)BLOCK_REC_END/);
        if (recBlockMatch) {
          const lines = recBlockMatch[1].trim().split('\n').filter((l) => l.trim());
          if (lines.length >= API_CONFIG.MIN_RECOMMENDATION_LINES) {
            const tier = lines[0].trim() as GpuTier;
            const suggestedGpus = lines[1].split(',').map((s) => s.trim().toLowerCase());
            const explanation = lines[2].trim();
            const priceRange = lines[3].trim();

            parsedRecommendation = {
              tier,
              suggestedGpus,
              explanation,
              priceRange,
            };
            setRecommendation(parsedRecommendation);
          }
        }

        // Specs block
        const specsBlockMatch = text.match(/BLOCK_SPECS_START([\s\S]*?)BLOCK_SPECS_END/);
        const newSpecs: Record<string, GpuSpec> = { ...GPUS };

        if (specsBlockMatch) {
          const lines = specsBlockMatch[1].trim().split('\n');
          lines.forEach((line) => {
            if (!line.includes('|')) return;
            const parts = line.split('|').map((s) => s.trim());
            if (parts.length >= API_CONFIG.MIN_SPEC_LINES) {
              const id = parts[0].toLowerCase();
              newSpecs[id] = {
                id,
                name: parts[1],
                vram: Number.parseFloat(parts[2]) || 0,
                fp16Tflops: Number.parseFloat(parts[3]) || 0,
                tier: (parts[4] as GpuTier) || GpuTier.MID,
              };
            }
          });
        }
        setGpuSpecs(newSpecs);

        // Offers block
        const offersBlockMatch = text.match(/BLOCK_OFFERS_START([\s\S]*?)BLOCK_OFFERS_END/);
        const parsedOffers: ProviderOffer[] = [];

        if (offersBlockMatch) {
          const lines = offersBlockMatch[1].trim().split('\n');
          lines.forEach((line, idx) => {
            if (!line.includes('|')) return;
            const parts = line.split('|').map((p) => p.trim());
            if (parts.length >= API_CONFIG.MIN_OFFER_LINES) {
              const gpuIdRaw = parts[1].toLowerCase();
              const knownSpec = newSpecs[gpuIdRaw] || GPUS['l4'];
              const gpuId = knownSpec.id;

              parsedOffers.push({
                id: `offer-${idx}`,
                providerName: parts[0],
                gpuId,
                region: parts[2],
                pricePerHour: Number.parseFloat(parts[3].replace('$', '')) || 0,
                commitment: (parts[4] as Commitment) || Commitment.ON_DEMAND,
                url: parts[5],
                isVerified: true,
              });
            }
          });
        }
        setOffers(parsedOffers);

        return {
          recommendation: parsedRecommendation,
          offers: parsedOffers,
          gpuSpecs: newSpecs,
        };
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        logger.error('Failed to parse Gemini API response', error, {
          responseLength: text.length,
          hasRecBlock: text.includes('BLOCK_REC_START'),
          hasSpecsBlock: text.includes('BLOCK_SPECS_START'),
          hasOffersBlock: text.includes('BLOCK_OFFERS_START'),
        });
        setError('We could not understand the data we received. Please refresh and try again.');
      }
    };

    run();

    return () => {
      isCancelled = true;
    };
  }, [JSON.stringify(prefs)]);

  return { recommendation, offers, gpuSpecs, groundingSources, isLoading, error };
}


