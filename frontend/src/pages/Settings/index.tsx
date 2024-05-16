import { useLocation } from 'react-router-dom';
import { RiGoogleLine } from 'react-icons/ri';
import { PiBooks } from 'react-icons/pi';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import GoogleCloudVision from './GoogleCloudVision';
import Dictionaries from './Dictionaries';
import IgnoreFile from './IgnoreFile';
import { classNames } from '../../utils';
import type { FC } from 'react';

const Settings: FC = () => {
	const { hash } = useLocation();
	const navigation = [
		{
			id: 'google-cloud-vision',
			name: 'Google Cloud Vision',
			current: hash === '#google-cloud-vision',
			Icon: RiGoogleLine,
			description: 'Set if you want to use Google Cloud Vision API to check images with text detection.',
			Element: GoogleCloudVision,
		},
		{
			id: 'dictionaries',
			name: 'Dictionaries',
			current: hash === '#dictionaries',
			Icon: PiBooks,
			description: 'Upload custom dictionaries for personalized checks.',
			Element: Dictionaries,
		},
		{
			id: 'ignore-file',
			name: 'Ignore File',
			current: hash === '#ignore-file',
			Icon: DocumentTextIcon,
			description:
				'Configure the ignore file for your project. It is responsible for ignoring words while we check images with text detection.',
			Element: IgnoreFile,
		},
	];

	return (
		<div className="lg:flex lg:gap-x-16">
			<aside className="flex overflow-x-auto border-b border-gray-900/5 pb-4 mb-4 lg:block lg:w-64 lg:flex-none lg:border-0">
				<nav className="flex-none">
					<ul role="list" className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col">
						{navigation.map(({ id, name, current, Icon }, index) => (
							<li key={`settings-navigation-${id}-${index}`}>
								<a
									href={`#${id}`}
									className={classNames(
										current ? 'bg-gray-50 text-indigo-600' : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
										'group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm leading-6 font-semibold'
									)}
								>
									<Icon
										className={classNames(
											current ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
											'h-6 w-6 shrink-0'
										)}
										aria-hidden="true"
									/>
									{name}
								</a>
							</li>
						))}
					</ul>
				</nav>
			</aside>
			<div className="lg:flex-auto">
				<div className="mx-auto space-y-16 sm:space-y-20">
					{navigation.map(({ id, name, description, Element }, index) => (
						<div key={`settings-section-${id}-${index}`} id={id} className="space-y-6">
							<div className="space-y-1 pb-6 border-b border-gray-200">
								<h2 className="text-base font-semibold leading-7 text-gray-900">{name}</h2>
								<p className="text-sm leading-6 text-gray-500">{description}</p>
							</div>
							<Element />
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Settings;
