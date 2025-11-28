export type SimulateAiAnalysisInput = {
  photoDataUri: string;
};

export type SimulateAiAnalysisOutput = {
  riskLevel: 'Safe' | 'Warning' | 'Danger';
};

export async function simulateAiAnalysis(
  input: SimulateAiAnalysisInput
): Promise<SimulateAiAnalysisOutput> {
  // Simulate AI analysis by returning a random risk level after a delay
  // This is a client-side mock to replace the Genkit server-side flow.
  console.log('Simulating AI analysis for:', input.photoDataUri.substring(0, 50) + '...');
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const riskLevels = ['Safe', 'Warning', 'Danger'];
  const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)] as SimulateAiAnalysisOutput['riskLevel'];
  
  return { riskLevel };
}
