import { RiGoogleLine } from 'react-icons/ri';
import { PiBooks } from 'react-icons/pi';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import GoogleCloudVision from './GoogleCloudVision';
import Dictionaries from './Dictionaries';
import IgnoreFile from './IgnoreFile';
import type { FC } from 'react';

const Settings: FC = () => {
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
		</div>
	);
};

export default Settings;
