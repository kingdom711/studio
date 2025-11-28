'use server';

/**
 * @fileOverview Simulates AI analysis of uploaded photos, returning a risk level.
 *
 * - simulateAiAnalysis - Simulates AI analysis and returns a risk level.
 * - SimulateAiAnalysisInput - The input type for simulateAiAnalysis.
 * - SimulateAiAnalysisOutput - The return type for simulateAiAnalysis.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulateAiAnalysisInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' /
    ),
});
export type SimulateAiAnalysisInput = z.infer<
  typeof SimulateAiAnalysisInputSchema
>;

const SimulateAiAnalysisOutputSchema = z.object({
  riskLevel: z.enum(['Safe', 'Warning', 'Danger']).describe('The risk level of the photo.'),
});
export type SimulateAiAnalysisOutput = z.infer<
  typeof SimulateAiAnalysisOutputSchema
>;

export async function simulateAiAnalysis(
  input: SimulateAiAnalysisInput
): Promise<SimulateAiAnalysisOutput> {
  return simulateAiAnalysisFlow(input);
}

const simulateAiAnalysisFlow = ai.defineFlow(
  {
    name: 'simulateAiAnalysisFlow',
    inputSchema: SimulateAiAnalysisInputSchema,
    outputSchema: SimulateAiAnalysisOutputSchema,
  },
  async () => {
    // Simulate AI analysis by returning a random risk level after a delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    const riskLevels = ['Safe', 'Warning', 'Danger'];
    const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)] as SimulateAiAnalysisOutput['riskLevel'];
    return {riskLevel};
  }
);
