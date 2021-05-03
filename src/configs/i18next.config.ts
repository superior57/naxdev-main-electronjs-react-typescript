import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import detector from "i18next-browser-languagedetector";
const i18nextBackend =  require('i18next-fs-backend');
const config = require('./app.config');
import * as path from 'path';
import {constants} from '@/constants';

const loadTranslation = constants.DEV_ENV ? './locales/{{lng}}/{{ns}}.json' : path.join(__dirname,'../../locales/{{lng}}/{{ns}}.json');
const loadMissingTranslation = constants.DEV_ENV ? './locales/{{lng}}/{{ns}}.missing.json' : path.join(__dirname,'../../locales/{{lng}}/{{ns}}.missing.json');

const i18nextOptions = {
  backend:{

    // path where resources get loaded from
    loadPath: loadTranslation,
  
    // path to post missing resources
    addPath: loadMissingTranslation,

    // jsonIndent to use when storing json files
    jsonIndent: 2,
  },
  interpolation: {
    escapeValue: false
  },
  saveMissing: true,
  fallbackLng: config.fallbackLng,
  whitelist: config.languages,
  react: {
    wait: false
  }
};

i18n
  .use(detector).use(initReactI18next).use(i18nextBackend);

// initialize if not already initialized
if (!i18n.isInitialized) {
   i18n
    .init(i18nextOptions);
}

module.exports = i18n;
