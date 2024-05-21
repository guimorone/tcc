import { useState, type FC, type ChangeEvent } from 'react';
import localforage from 'localforage';
import { RiGoogleLine } from 'react-icons/ri';
import { PiBooks } from 'react-icons/pi';
import { CiImport, CiExport } from 'react-icons/ci';
import { DocumentTextIcon, TrashIcon } from '@heroicons/react/24/outline';
import GoogleCloudVision from './GoogleCloudVision';
import Dictionaries from './Dictionaries';
import IgnoreFile from './IgnoreFile';
import { classNames, onDownloadJSONButtonClick } from '../../utils';
import { CUSTOM_DICTS_KEY, DICT_TO_USE_KEY } from '../../constants/keys';

const Settings: FC = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const navigation = [
		{
			name: 'Google Cloud Vision',
			Icon: RiGoogleLine,
			description: 'Set if you want to use Google Cloud Vision API to check images with text detection.',
			Element: GoogleCloudVision,
		},
		{
			name: 'Dictionaries',
			Icon: PiBooks,
			description: 'Upload custom dictionaries for personalized checks.',
			Element: Dictionaries,
		},
		{
			name: 'Ignore File',
			Icon: DocumentTextIcon,
			description:
				'Configure the ignore file for your project. It is responsible for ignoring words while we check images with text detection.',
			Element: IgnoreFile,
		},
	];

	const importData = (event: ChangeEvent<HTMLInputElement>): void => {
		if (isLoading) return;

		setIsLoading(true);
		const file = event.target.files?.[0];
		if (!file) {
			setIsLoading(false);
			return;
		}
		const reader = new FileReader();
		reader.onload = async event => {
			const data: { [key: string]: any } = JSON.parse(event.target?.result as string);
			await Promise.all<void>(Object.keys(data).map(key => localforage.setItem(key, data[key])));
			window.location.reload();
			setIsLoading(false);
		};
		reader.readAsText(file);
	};
	const exportData = async (): Promise<void> => {
		if (isLoading) return;

		setIsLoading(true);
		const keys = await localforage.keys();
		const data: { [key: string]: any } = {};
		await Promise.all<void>(
			keys.map(async key => {
				if (key === CUSTOM_DICTS_KEY || key === DICT_TO_USE_KEY) return;

				data[key] = await localforage.getItem(key);
			})
		);
		onDownloadJSONButtonClick(data, 'config.json');
		setIsLoading(false);
	};
	const clearData = async (): Promise<void> => {
		if (isLoading) return;

		setIsLoading(true);
		await localforage.clear().finally(() => {
			window.location.reload();
			setIsLoading(false);
		});
	};

	return (
		<div className="mx-auto space-y-16 sm:space-y-20">
			{navigation.map(({ name, description, Element, Icon }, index) => (
				<div key={`settings-section-${index}`} className="space-y-6">
					<div className="flex items-center gap-x-4 pb-6 border-b border-gray-200">
						<Icon className="h-12 w-auto text-gray-400" aria-hidden="true" />
						<div className="space-y-1">
							<h2 className="text-base font-semibold leading-7 text-gray-900">{name}</h2>
							<p className="text-sm leading-6 text-gray-500">{description}</p>
						</div>
					</div>
					<Element />
				</div>
			))}
			<div className="space-y-4">
				<div className="flex items-center gap-x-4">
					<div>
						<input disabled={isLoading} hidden type="file" id="config-uploader" accept=".json" onChange={importData} />
						<label htmlFor="config-uploader" className="space-y-2">
							<div
								className={classNames(
									isLoading
										? 'bg-gray-200 text-gray-600 hover:cursor-wait'
										: 'bg-indigo-600 hover:bg-indigo-500 hover:cursor-pointer text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
									'inline-flex items-center gap-x-2 rounded px-3 py-2 text-sm font-semibold shadow-sm'
								)}
							>
								<CiImport className="h-4 w-auto" aria-hidden="true" />
								<span>Import Data</span>
							</div>
						</label>
					</div>
					<button
						disabled={isLoading}
						onClick={exportData}
						className="inline-flex items-center gap-x-2 rounded bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-200 disabled:text-gray-600 disabled:hover:cursor-wait"
					>
						<CiExport className="h-4 w-auto" aria-hidden="true" />
						<span>Export Data</span>
					</button>
					<button
						disabled={isLoading}
						onClick={clearData}
						className="ml-auto inline-flex items-center gap-x-2 rounded bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:bg-gray-200 disabled:text-gray-600 disabled:hover:cursor-wait"
					>
						<TrashIcon className="h-4 w-auto" aria-hidden="true" />
						<span>Clear Data</span>
					</button>
				</div>
				<ul role="list" className="text-red-600 text-sm font-medium space-y-1 list-disc list-inside">
					BE CAREFUL:
					<li className="text-xs font-normal">
						Import a config file will overwrite all other data that you had before!
					</li>
					<li className="text-xs font-normal">Exporting the data will NOT export the dictionaries with you!</li>
					<li className="text-xs font-normal">
						Clearing the data will exclude all your recordes, including the processing history!
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Settings;
