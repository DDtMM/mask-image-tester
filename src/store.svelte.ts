import type { MaskExample } from './examples';

class AppStore {
  currentExample = $state<MaskExample | null>(null);
  exampleVersion = $state(0);
  
  setExample(example: MaskExample | null) {
    this.currentExample = example;
    this.exampleVersion++;
  }
}

export const appStore = new AppStore();
