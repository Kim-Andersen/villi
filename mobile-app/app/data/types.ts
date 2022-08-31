import { TranslationKey } from '../translations';

export type Action = { id: string; title: TranslationKey; description: TranslationKey; };

export type ActionTree = {
  categories: Array<{
    title: TranslationKey;
    description: TranslationKey;
    icon: string;
    groups: Array<{
      title: TranslationKey;
      description: TranslationKey;
      why: TranslationKey;
      actions: Array<Action>
    }>
  }>
};