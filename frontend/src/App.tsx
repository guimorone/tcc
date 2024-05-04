import { QueryClient, QueryClientProvider, type QueryKey } from '@tanstack/react-query';
import Router from './Router';
import { httpRequest } from './services/api';
import type { AxiosRequestConfig } from 'axios';

export default function App() {
	const defaultQueryFn = ({
		queryKey,
	}: {
		queryKey: QueryKey | (string | AxiosRequestConfig<any>)[];
	}): void | Promise<any> => {
		if (!queryKey || !queryKey.length) return;

		// @ts-ignore
		return httpRequest(...queryKey);
	};

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				queryFn: defaultQueryFn,
				enabled: false,
				retry: false,
				retryOnMount: false,
				refetchOnMount: false,
				refetchOnWindowFocus: false,
				refetchOnReconnect: false,
				// cacheTime: 0,
				staleTime: Infinity,
			},
		},
	});

	return (
		<QueryClientProvider client={queryClient}>
			<Router />
		</QueryClientProvider>
	);
}
