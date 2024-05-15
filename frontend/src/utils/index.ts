import { AxiosError, type AxiosResponse } from 'axios';
import { toast, type ToastPosition } from 'react-toastify';
import * as paths from '../constants/paths';
import type { FormEvent } from 'react';
import type { DataItem, Sizes } from '../@types';

export function formatNumber(
	value: number | bigint,
	style: Intl.NumberFormatOptions['style'] = 'currency',
	format: string | string[] = 'pt-BR',
	currency: Intl.NumberFormatOptions['currency'] = 'BRL'
): string {
	const options: Intl.NumberFormatOptions = {
		style,
		currency: style === 'currency' ? currency : undefined,
		minimumFractionDigits: 2,
		maximumFractionDigits: style === 'currency' ? 2 : 20,
		minimumSignificantDigits: style !== 'currency' ? 1 : undefined,
		maximumSignificantDigits: style !== 'currency' ? 20 : undefined,
	};

	return new Intl.NumberFormat(format, options).format(value);
}

export function divideArray(arr: any[], elementsPerIndex = 3): any[][] {
	const copy = [...arr];

	return new Array(Math.ceil(copy.length / elementsPerIndex))
		.fill(undefined)
		.map(() => copy.splice(0, elementsPerIndex));
}

export const classNames = (...classes: any[]): string => classes.filter(Boolean).join(' ');

export const csvStringFromArrayOfObjects = (header: string[], array: DataItem[], separator = ';'): string =>
	[
		header,
		...array.map(item => {
			const newArray: typeof array = [];

			Object.values(item).forEach(value => newArray.push(value));

			return newArray;
		}),
	]
		.map(e => e.join(separator))
		.join('\n');

export function onDownloadCSVButtonClick(
	header: string[],
	data: DataItem[],
	downloadTitle: string,
	titleWithDate = true
): void {
	const csv = csvStringFromArrayOfObjects(header, data);

	const hiddenElement = document.createElement('a');
	hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
	hiddenElement.target = '_blank';
	hiddenElement.download = titleWithDate
		? `${downloadTitle}_${new Date().toLocaleDateString()}.csv`
		: `${downloadTitle}.csv`;
	hiddenElement.click();
	hiddenElement.remove();
}

export function onDownloadJSONButtonClick(
	data: DataItem | undefined,
	downloadTitle: string | undefined,
	titleWithDate = true
): void {
	const json = JSON.stringify(data);

	const hiddenElement = document.createElement('a');
	hiddenElement.href = 'data:application/json;charset=utf-8,' + encodeURI(json);
	hiddenElement.target = '_blank';
	hiddenElement.download = titleWithDate
		? `${downloadTitle}_${new Date().toLocaleDateString()}.json`
		: `${downloadTitle}.json`;
	hiddenElement.click();
	hiddenElement.remove();
}

// \u00A0 == &nbsp;
export const noBreakLineSpace = (str: string): string =>
	typeof str === 'string' ? str.split(' ').join('\u00A0') : str;

export const checkIfObjectIsEmpty = (obj: object): boolean =>
	!obj || (!Object.keys(obj).length && Object.getPrototypeOf(obj) === Object.prototype);

export const checkIfObjectsAreEqual = (...objs: { [key: string | number]: any }[]): boolean => {
	const checkIfTwoObjectsAreEqual = (
		obj1: { [key: string | number]: any },
		obj2: { [key: string | number]: any }
	): boolean => {
		const objectKeysMethod = Object.keys,
			tx = typeof obj1,
			ty = typeof obj2;

		return obj1 && obj2 && tx === 'object' && tx === ty
			? objectKeysMethod(obj1).length === objectKeysMethod(obj2).length &&
					objectKeysMethod(obj1).every(key => checkIfTwoObjectsAreEqual(obj1[key], obj2[key]))
			: obj1 === obj2;
	};

	let areEqual = true;

	objs.forEach((obj, index, array) => {
		if (index === objs.length - 1 || !areEqual) return;

		areEqual = checkIfTwoObjectsAreEqual(obj, array[index + 1]);
	});

	return areEqual;
};

export function getWindowDimensions(): { width: number; height: number } {
	const { innerWidth: width, innerHeight: height } = window;

	return { width, height };
}

export const removeAccentsOrDiacriticsInString = (
	str: string,
	form: 'NFC' | 'NFD' | 'NFKC' | 'NFKD' = 'NFD'
): string => (typeof str === 'string' ? str.normalize(form).replace(/[\u0300-\u036f]/g, '') : str);

export const normalizeValue = (value: string | number | bigint): string =>
	removeAccentsOrDiacriticsInString(typeof value === 'string' ? value : value.toString())
		.trim()
		.toLowerCase();

export const capitalizeString = (str: string): string =>
	typeof str === 'string' ? str.charAt(0).toUpperCase() + str.substring(1) : str;

export function booleanPropSort(
	property: string,
	reverse = false
): (a: { [key: string]: boolean }, b: { [key: string]: boolean }) => number {
	return (a: { [key: typeof property]: boolean }, b: { [key: typeof property]: boolean }) =>
		a[property] === b[property] ? 0 : a[property] ? (reverse ? 1 : -1) : reverse ? -1 : 1;
}

export const filterData = (query: string, data: DataItem[], fieldsToMatch: string[] = []): any[] => {
	if (!data || !data.length) return [];
	if (!fieldsToMatch || !fieldsToMatch.length) return data;

	const queryTrim = normalizeValue(query);

	return queryTrim
		? data?.filter(obj => {
				let match = false;

				fieldsToMatch?.forEach(f => {
					const value = deepFind(obj, f);
					if (value === undefined) return;

					if (normalizeValue(value).includes(queryTrim)) {
						match = true;

						return;
					}
				});

				return match;
			})
		: data;
};

export function chooseIconSize(size: Sizes | string): string {
	switch (size) {
		case 'xs':
			return 'h-4 w-4';
		case 'sm':
			return 'h-6 w-6';
		case 'md':
			return 'h-8 w-8';
		case 'lg':
			return 'h-10 w-10';
		case 'xl':
			return 'h-12 w-12';
		case '2xl':
			return 'h-16 w-16';
		case '3xl':
			return 'h-20 w-20';
		case '4xl':
			return 'h-24 w-24';
		case '5xl':
			return 'h-28 w-28';
		case '6xl':
			return 'h-44 w-44';
		case '7xl':
			return 'h-60 w-60';
		case '8xl':
			return 'h-72 w-72';
		case '9xl':
			return 'h-80 w-80';
		case '10xl':
			return 'h-96 w-96';
		default:
			return size;
	}
}

export function getErrorMsg(error: AxiosError | any): string | { [key: string]: Array<string> } {
	const data = error?.response?.data;
	const msg = data?.detail || data;

	return msg || 'Erro desconhecido.';
}

export function getQueryData(data: AxiosResponse | any, key: string | null = null): any {
	if (!data) return null;

	return key && key in data ? data[key] : data;
}

export function enterAndSubmitListenerUseEffect(formId: string): () => void {
	const listener = (event: globalThis.KeyboardEvent): void => {
		if (event.code === 'Enter' || event.code === 'NumpadEnter') {
			const element = document.getElementById(formId);

			if (element instanceof HTMLFormElement) element.requestSubmit();
		}
	};

	document.addEventListener('keydown', listener);
	return () => document.removeEventListener('keydown', listener);
}

export const onSubmitFormHandler = (
	event: FormEvent<HTMLFormElement>,
	preventDefault = true
): { [key: string]: any } => {
	if (preventDefault) event.preventDefault();

	const newParams: { [key: string]: any } = {};
	const elements = Array.from(event.currentTarget.elements);

	elements.forEach(element => {
		if (
			(element instanceof HTMLInputElement ||
				element instanceof HTMLTextAreaElement ||
				element instanceof HTMLSelectElement) &&
			element.name
		)
			newParams[element.name] =
				element.getAttribute('type') === 'checkbox' && 'checked' in element ? element.checked : element.value;
	});

	return newParams;
};

export const deepFind = (o: DataItem, p: string): any => p.split('.').reduce((a, v) => a[v], o);

export async function copyToClipboard(text: string, onSuccess?: VoidFunction, onError?: VoidFunction): Promise<void> {
	// Navigator clipboard api needs a secure context (https)
	if (navigator.clipboard && window.isSecureContext)
		await navigator.clipboard
			.writeText(text)
			.then(() => {
				if (onSuccess) onSuccess();
			})
			.catch(() => {
				if (onError) onError();
			});
	else {
		// Use the 'out of viewport hidden text area' trick
		const textArea = document.createElement('textarea');
		textArea.value = text;

		// Move textarea out of the viewport so it's not visible
		textArea.style.position = 'absolute';
		textArea.style.left = '-999999px';

		document.body.prepend(textArea);
		textArea.select();

		try {
			document.execCommand('copy');
			if (onSuccess) onSuccess();
		} catch (error) {
			console.error(error);
			if (onError) onError();
		} finally {
			textArea.remove();
		}
	}
}

export function dataURLtoFile(dataurl: string, filename: string): File | null {
	const arr = dataurl.split(',');

	if (!arr || !arr.length) return null;
	const mime = arr[0].match(/:(.*?);/)?.at(1),
		bstr = atob(arr[arr.length - 1]);

	let n = bstr.length;
	const u8arr = new Uint8Array(n);

	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}

	return new File([u8arr], filename, { type: mime });
}

export function setCharAt(str: string, index: number, chr: string): string {
	if (typeof str !== 'string' || typeof chr !== 'string' || index > str.length - 1) return str;

	return str.substring(0, index) + chr + str.substring(index + 1);
}

export const getLocalStorageItem = (key: string): any => {
	const item = localStorage.getItem(key);

	if (!item) return null;

	try {
		return JSON.parse(item);
	} catch (error) {
		return item;
	}
};

export const setLocalStorageItem = (key: string, value: any): void => localStorage.setItem(key, JSON.stringify(value));

export const showSuccessToast = (message: string, position?: ToastPosition): void => {
	toast.success(message, {
		position: `${position ? position : 'top-right'}`,
		autoClose: 3000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: 'colored',
	});
};

export const showErrorToast = (message: string, position?: ToastPosition): void => {
	toast.error(message, {
		position: `${position ? position : 'top-right'}`,
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: 'colored',
	});
};

export const showWarningToast = (message: string, position?: ToastPosition) => {
	toast.warning(message, {
		position: `${position ? position : 'top-right'}`,
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: 'colored',
	});
};

export const getPageTitle = (page: string): string => {
	switch (page) {
		case paths.HOME:
			return 'Home';
		case paths.HISTORY:
			return 'History';
		case paths.SETTINGS:
			return 'Settings';
		default:
			return page;
	}
};
