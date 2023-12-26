import i18n, {LanguageDetectorModule} from 'i18next';
import {initReactI18next} from 'react-i18next';
import {en, id, hi} from './translations';
import {MMKV} from 'react-native-mmkv';

const STORE_LANGUAGE_KEY = 'app_lang';
const storage = new MMKV();

const languageDetectorPlugin = {
  type: 'languageDetector' as LanguageDetectorModule['type'],
  init: () => {},
  detect: () => {
    let appLang = storage.getString(STORE_LANGUAGE_KEY);
    if (appLang === undefined) {
      return 'en';
    }
    return appLang;
  },
  cacheUserLanguage: function (language: string) {
    storage.set(STORE_LANGUAGE_KEY, language);
  },
};

const resources = {
  en: {
    translation: en,
  },
  id: {
    translation: id,
  },
  hi: {
    translation: hi,
  },
};

i18n
  .use(initReactI18next)
  .use(languageDetectorPlugin)
  .init({
    resources,
    compatibilityJSON: 'v3',
    // fallback language is set to english
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
