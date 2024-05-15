import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getLocalStorageItem, setLocalStorageItem, getPageTitle } from '../utils';
import { useDocumentTitle } from '../utils/hooks';
import { APP_NAME } from '../constants';
import { HOME } from '../constants/paths';
import type { IgnoreWordsType, HistoryType } from '../@types';

export default function Default() {
	const [ignoreWords, setIgnoreWords] = useState<IgnoreWordsType>(getLocalStorageItem('ignoreWords') || []);
	const [history, setHistory] = useState<HistoryType>(getLocalStorageItem('history') || {});
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const setDocumentTitle = useDocumentTitle();
	const currentPage = pathname.split('/')[1];

	useEffect(() => {
		if (!currentPage) navigate(HOME);

		setDocumentTitle(`${APP_NAME} / ` + getPageTitle(currentPage));
	}, [currentPage, navigate]);

	useEffect(() => setLocalStorageItem('ignoreWords', ignoreWords), [ignoreWords]);
	useEffect(() => setLocalStorageItem('history', history), [history]);

	return (
		<div className="min-h-full">
			<Navbar />
			<div className="space-y-4 py-10 px-4 sm:px-6 lg:px-8">
				<header className="mx-auto max-w-7xl">
					<h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">{getPageTitle(currentPage)}</h1>
				</header>
				<main className="mx-auto max-w-7xl">
					<Outlet context={{ currentPage, ignoreWords, setIgnoreWords, history, setHistory }} />
				</main>
			</div>
		</div>
	);
}
