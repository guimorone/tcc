import { LanguagesKeys } from '../@types';

export const APP_NAME = import.meta.env.VITE_APP_NAME;
export const LANGUAGES: { [key in LanguagesKeys]: string } = {
	en: 'English',
	pt: 'Português',
	es: 'Español',
};
