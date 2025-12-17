import {
  WorkloadType,
  ModelSize,
  BudgetSensitivity,
  LatencyTolerance,
  Region,
  Commitment,
} from './enums';

/**
 * User preferences configuration
 * Represents the user's answers to the questionnaire
 */
export interface UserPreferences {
  workload: WorkloadType | null;
  modelSize: ModelSize | null;
  budget: BudgetSensitivity | null;
  latency: LatencyTolerance | null;
  region: Region | null;
  commitment: Commitment | null;
}

