import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getIndexedDBItem, setIndexedDBItem, getPageTitle } from '../utils';
import { useDocumentTitle } from '../utils/hooks';
import { APP_NAME, LANGUAGES } from '../constants';
import { HOME } from '../constants/paths';
import * as keys from '../constants/keys';
import type { IgnoreWordsType, HistoryType, OptionType, DictToUseType } from '../@types';

export default function Default() {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const setDocumentTitle = useDocumentTitle();
	const [languageSelected, setLanguageSelected] = useState<OptionType | undefined>(undefined);
	const [ignoreWords, setIgnoreWords] = useState<IgnoreWordsType | undefined>(undefined);
	const [history, setHistory] = useState<HistoryType | undefined>(undefined);
	const [useGoogleCloudVision, setUseGoogleCloudVision] = useState<boolean | undefined>(undefined);
	const [googleServiceAccountCredentials, setGoogleServiceAccountCredentials] = useState<string | undefined>(undefined);
	const [customDicts, setCustomDicts] = useState<File[] | undefined>(undefined);
	const [dictToUse, setDictToUse] = useState<DictToUseType | null | undefined>(undefined);

	const currentPage = pathname.split('/')[1];

	const updateLanguageSelected = async (): Promise<void> => {
		if (languageSelected === undefined) return;

		await setIndexedDBItem(keys.LANGUAGE_SELECTED_KEY, languageSelected);
	};
	const updateIgnoreWords = async (): Promise<void> => {
		if (ignoreWords === undefined) return;

		await setIndexedDBItem(keys.IGNORE_WORDS_KEY, ignoreWords);
	};
	const updateHistory = async (): Promise<void> => {
		if (history === undefined) return;

		await setIndexedDBItem(keys.HISTORY_KEY, history);
	};
	const updateUseGoogleCloudVision = async (): Promise<void> => {
		if (useGoogleCloudVision === undefined) return;

		await setIndexedDBItem(keys.USE_GOOGLE_CLOUD_VISION_KEY, useGoogleCloudVision);
	};
	const updateGoogleServiceAccountCredentials = async (): Promise<void> => {
		if (googleServiceAccountCredentials === undefined) return;

		await setIndexedDBItem(keys.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_KEY, googleServiceAccountCredentials);
	};
	const updateCustomDicts = async (): Promise<void> => {
		if (customDicts === undefined) return;

		await setIndexedDBItem(keys.CUSTOM_DICTS_KEY, customDicts);
	};
	const updateDictToUse = async (): Promise<void> => {
		if (dictToUse === undefined) return;

		await setIndexedDBItem(keys.DICT_TO_USE_KEY, dictToUse);
	};

	useEffect(() => {
		if (languageSelected === undefined)
			getIndexedDBItem(keys.LANGUAGE_SELECTED_KEY).then(data =>
				setLanguageSelected(
					data || {
						value: 'pt',
						label: LANGUAGES['pt'],
					}
				)
			);
		if (ignoreWords === undefined) getIndexedDBItem(keys.IGNORE_WORDS_KEY).then(data => setIgnoreWords(data || []));
		if (history === undefined) getIndexedDBItem(keys.HISTORY_KEY).then(data => setHistory(data || {}));
		if (useGoogleCloudVision === undefined)
			getIndexedDBItem(keys.USE_GOOGLE_CLOUD_VISION_KEY).then(data =>
				setUseGoogleCloudVision(data === null ? true : data)
			);
		if (googleServiceAccountCredentials === undefined)
			getIndexedDBItem(keys.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_KEY).then(data =>
				setGoogleServiceAccountCredentials(data || '')
			);
		if (customDicts === undefined) getIndexedDBItem(keys.CUSTOM_DICTS_KEY).then(data => setCustomDicts(data || []));
		if (dictToUse === undefined) getIndexedDBItem(keys.DICT_TO_USE_KEY).then(data => setDictToUse(data || null));
	}, []);

	useEffect(() => {
		if (!currentPage) navigate(HOME);

		setDocumentTitle(`${APP_NAME} / ` + getPageTitle(currentPage));
	}, [currentPage, navigate]);
	useEffect(() => {
		updateLanguageSelected();
	}, [languageSelected]);
	useEffect(() => {
		updateIgnoreWords();
	}, [ignoreWords]);
	useEffect(() => {
		updateHistory();
	}, [history]);
	useEffect(() => {
		updateUseGoogleCloudVision();
	}, [useGoogleCloudVision]);
	useEffect(() => {
		updateGoogleServiceAccountCredentials();
	}, [updateGoogleServiceAccountCredentials]);
	useEffect(() => {
		updateCustomDicts();
	}, [customDicts]);
	useEffect(() => {
		updateDictToUse();
	}, [dictToUse]);

	return (
		<div className="min-h-full">
			<Navbar />
			<div className="space-y-4 py-10 px-4 sm:px-6 lg:px-8">
				<header className="mx-auto max-w-7xl">
					<h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">{getPageTitle(currentPage)}</h1>
				</header>
				<main className="mx-auto max-w-7xl">
					<Outlet
						context={{
							currentPage,
							ignoreWords,
							languageSelected,
							setLanguageSelected,
							setIgnoreWords,
							history,
							setHistory,
							useGoogleCloudVision,
							setUseGoogleCloudVision,
							googleServiceAccountCredentials,
							setGoogleServiceAccountCredentials,
							customDicts,
							setCustomDicts,
							dictToUse,
							setDictToUse,
						}}
					/>
				</main>
			</div>
		</div>
	);
}
