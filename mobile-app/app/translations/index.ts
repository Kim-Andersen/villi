import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import * as en from './en.json';

const translations = {
  en
};

export type Translation = typeof translations.en;

const i18n = new I18n(translations);

// Set the locale once at the beginning of your app.
i18n.locale = Localization.locale;

// When a value is missing from a language it'll fallback to another language with the key present.
i18n.enableFallback = true;
// To see the fallback mechanism uncomment line below to force app to use Japanese language.
// i18n.locale = 'ja';


export type TranslationKey = NestedKeyOf<Translation>;

export function translate(key: TranslationKey): string {
  return i18n.t(key);
}

export const translationKey = (key: NestedKeyOf<Translation>): string => key;

type NestedKeyOf<ObjectType extends object> = 
{[Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object 
  // @ts-ignore
  ? `${Key}.${NestedKeyOf<ObjectType[Key]>}`
  // ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
: `${Key}`
}[keyof ObjectType & (string | number)];