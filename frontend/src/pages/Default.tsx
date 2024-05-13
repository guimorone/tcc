import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getLocalStorageItem, setLocalStorageItem } from '../utils';
import { useDocumentTitle } from '../utils/hooks';
import { APP_NAME } from '../constants';
import { HOME } from '../constants/paths';
import type { IgnoreWordsType } from '../@types';

export default function Default() {
	const [ignoreWords, setIgnoreWords] = useState<IgnoreWordsType>(getLocalStorageItem('ignoreWords') || {});
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const setDocumentTitle = useDocumentTitle();

	useEffect(() => {
		if (pathname === '/') navigate(HOME);

		setDocumentTitle(`${APP_NAME} / ` + (pathname === `/${HOME}` ? 'Home' : 'Ignore File'));
	}, [pathname, navigate]);

	useEffect(() => setLocalStorageItem('ignoreWords', ignoreWords), [ignoreWords]);

	return (
		<div className="min-h-full">
			<Navbar />
			<div className="space-y-4 py-10 px-4 sm:px-6 lg:px-8">
				<header className="mx-auto max-w-7xl">
					<h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
						{pathname === `/${HOME}` ? 'Home' : 'Ignore File'}
					</h1>
				</header>
				<main className="mx-auto max-w-7xl">
					<Outlet context={{ ignoreWords, setIgnoreWords }} />
				</main>
			</div>
		</div>
	);
}
