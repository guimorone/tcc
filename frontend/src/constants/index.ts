import type { LanguagesKeys } from '../@types';

export const APP_NAME = import.meta.env.VITE_APP_NAME;
export const LANGUAGES: { [key in LanguagesKeys]: string } = {
	bn: 'বাংলা (bn) | Bengali',
	de: 'Deutsch (de) | German',
	en: 'English (en)',
	es: 'Español (es) | Spanish',
	fr: 'Français (fr) | French',
	hi: 'हिन्दी (hi) | Hindi',
	it: 'Italiano (it) | Italian',
	ja: '日本語 (ja) | Japanese',
	jv: 'Basa Jawa (jv) | Javanese',
	ko: '한국어 (ko) | Korean',
	mr: 'मराठी (mr) | Marathi',
	ms: 'Bahasa Melayu (ms) | Malay',
	pl: 'Polski (pl) | Polish',
	pt: 'Português (pt) | Portuguese',
	ro: 'Română (ro) | Romanian',
	ru: 'Русский (ru) | Russian',
	ta: 'தமிழ் (ta) | Tamil',
	tr: 'Türkçe (tr) | Turkish',
	uk: 'Українська (uk) | Ukrainian',
	zh: '中文 (zh) | Chinese',
};
