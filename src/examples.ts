export interface AnimationStep {
  easing: string;
  duration: number;
  variables: string[];
}

export interface MaskSettings {
  name: string;
  maskImage: string;
  maskSize?: string;
  maskPosition?: string;
  maskRepeat?: string;
  maskMode?: string;
  variables?: string[];
  animationSteps?: AnimationStep[];
}

export async function loadExamples(): Promise<MaskSettings[]> {
  const response = await fetch('/examples.json');
  return response.json();
}

export type { MaskSettings as default };
