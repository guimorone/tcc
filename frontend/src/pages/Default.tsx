import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Spinner } from 'flowbite-react';
import Navbar from '../components/Navbar';
import { getIndexedDBItem, setIndexedDBItem, getPageTitle } from '../utils';
import { useDocumentTitle } from '../utils/hooks';
import { APP_NAME } from '../constants';
import { HOME } from '../constants/paths';
import type { IgnoreWordsType, HistoryType, DictToUseType } from '../@types';

export default function Default() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const setDocumentTitle = useDocumentTitle();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ignoreWords, setIgnoreWords] = useState<IgnoreWordsType | undefined>(undefined);
  const [history, setHistory] = useState<HistoryType | undefined>(undefined);
  const [useGoogleCloudVision, setUseGoogleCloudVision] = useState<boolean | undefined>(undefined);
  const [customDicts, setCustomDicts] = useState<File[] | undefined>(undefined);
  const [dictToUse, setDictToUse] = useState<DictToUseType | null | undefined>(undefined);

  const currentPage = pathname.split('/')[1];

  const updateIgnoreWords = async (): Promise<void> => {
    if (ignoreWords === undefined) return;

    setIsLoading(true);
    await setIndexedDBItem('ignoreWords', ignoreWords);
    setIsLoading(false);
  };
  const updateHistory = async (): Promise<void> => {
    if (history === undefined) return;

    setIsLoading(true);
    await setIndexedDBItem('history', history);
    setIsLoading(false);
  };
  const updateUseGoogleCloudVision = async (): Promise<void> => {
    if (useGoogleCloudVision === undefined) return;

    setIsLoading(true);
    await setIndexedDBItem('useGoogleCloudVision', useGoogleCloudVision);
    setIsLoading(false);
  };
  const updateCustomDicts = async (): Promise<void> => {
    if (customDicts === undefined) return;

    setIsLoading(true);
    await setIndexedDBItem('customDicts', customDicts);
    setIsLoading(false);
  };
  const updateDictToUse = async (): Promise<void> => {
    if (dictToUse === undefined) return;

    setIsLoading(true);
    await setIndexedDBItem('dictToUse', dictToUse);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    if (ignoreWords === undefined) getIndexedDBItem('ignoreWords').then(data => setIgnoreWords(data || []));
    if (history === undefined) getIndexedDBItem('history').then(data => setHistory(data || {}));
    if (useGoogleCloudVision === undefined)
      getIndexedDBItem('useGoogleCloudVision').then(data => setUseGoogleCloudVision(data || true));
    if (customDicts === undefined) getIndexedDBItem('customDicts').then(data => setCustomDicts(data || []));
    if (dictToUse === undefined) getIndexedDBItem('dictToUse').then(data => setDictToUse(data || null));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!currentPage) navigate(HOME);

    setDocumentTitle(`${APP_NAME} / ` + getPageTitle(currentPage));
  }, [currentPage, navigate]);
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
    updateCustomDicts();
  }, [customDicts]);
  useEffect(() => {
    updateDictToUse();
  }, [dictToUse]);

  return (
    <div className="min-h-full">
      {isLoading && (
        <div className="w-screen h-screen fixed top-0 bottom-0 bg-gray-200 bg-opacity-50 z-40">
          <Spinner size="" className="absolute inset-x-0 bottom-1/2 z-50 h-1/6 w-full" />
        </div>
      )}
      <Navbar />
      <div className="space-y-4 py-10 px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            {getPageTitle(currentPage)}
          </h1>
        </header>
        <main className="mx-auto max-w-7xl">
          <Outlet
            context={{
              currentPage,
              ignoreWords,
              setIgnoreWords,
              history,
              setHistory,
              useGoogleCloudVision,
              setUseGoogleCloudVision,
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
