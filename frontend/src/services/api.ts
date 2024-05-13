import axios, { type AxiosRequestConfig, type Method } from 'axios';

const api = axios.create({ baseURL: `${import.meta.env.VITE_BACKEND_URL}` });

export async function httpRequest(
	resourcePath: string,
	endpoint: string,
	method: Method,
	additionalConfig?: AxiosRequestConfig<any>
): Promise<any> {
	0;
	const url = `/${resourcePath}/${endpoint}`;
	const config = { method, ...additionalConfig };

	const response = await api(url, config);

	return 'data' in response ? response.data : response;
}

export default api;
