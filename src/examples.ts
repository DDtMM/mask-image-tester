export interface AnimationStep {
  easing: string;
  duration: number;
  variables: string[];
}

export interface MaskExample {
  name: string;
  maskImage: string;
  maskSize?: string;
  maskPosition?: string;
  maskRepeat?: string;
  maskMode?: string;
  variables?: string[];
  animationSteps?: AnimationStep[];
}

export async function loadExamples(): Promise<MaskExample[]> {
  const response = await fetch('/examples.json');
  return response.json();
}

export type { MaskExample as default };
