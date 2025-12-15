import type { MaskSettings } from './examples';
import type { AnimationStep } from './examples';

export const DEFAULT_EXAMPLE: MaskSettings = {
  name: '',
  maskImage: 'linear-gradient(to bottom, black, transparent)',
  maskSize: undefined,
  maskPosition: undefined,
  maskRepeat: undefined,
  maskMode: undefined,
  variables: [],
  animationSteps: []
};
class AppStore {
  currentExample = $state<MaskSettings>({ ...DEFAULT_EXAMPLE});
  maskSettings = $state<MaskSettings>({ ...DEFAULT_EXAMPLE});
  
  /** Updates the currentExample and maskSettings. */
  setExample(example: MaskSettings) {
    this.currentExample = { ...example };
    this.maskSettings = { ...example };
  }
  
  /** Updates maskSettings related to css properties */
  setMaskProperties(props: {
    maskImage: string;
    maskSize?: string;
    maskPosition?: string;
    maskRepeat?: string;
    maskMode?: string;
  }) {
    this.maskSettings = { ...this.maskSettings, ...props };
  }
  
  /** Sets variables on maskSettings */
  setVariables(vars: string[]) {
    this.maskSettings = { ...this.maskSettings, variables: [...vars] };
  }
  
  /** Sets animation steps on maskSettings */
  setAnimationSteps(steps: AnimationStep[]) {
    this.maskSettings = { ...this.maskSettings, animationSteps: [...steps] };
  }
}

export const appStore = new AppStore();
