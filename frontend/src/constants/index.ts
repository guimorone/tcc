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
export const GOOGLE_SERVICE_ACCOUNT_EXAMPLE = `{
  "type": "service_account",
  "project_id": "project-id",
  "private_key_id": "123abcdedf1234567890abcdef1234567890abcdef",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...teste...\n-----END PRIVATE KEY-----\n",
  "client_email": "123abc@project-id.iam.gserviceaccount.com",
  "client_id": "123456789123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/123abc%40project-id.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}`;
