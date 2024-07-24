import { useState, type FC } from 'react';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import { classNames } from '../../utils';
import type { IconType } from '../../@types';

interface NavigationProps {
	section: string;
	settings: {
		name: string;
		Icon: IconType;
		description: string;
		Element: FC;
	}[];
}

const Navigation: FC<NavigationProps> = ({ section, settings }) => {
	const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

	const handleIsCollapsed = () => setIsCollapsed(prev => !prev);

	return (
		<div className="space-y-8">
			<button
				className="text-gray-700 flex items-center gap-x-2 md:gap-x-4 hover:underline underline-offset-4"
				onClick={handleIsCollapsed}
			>
				<h2 className="text-xl md:text-2xl font-semibold">{section}</h2>
				{isCollapsed ? (
					<ArrowUpIcon className="w-auto h-4 md:h-5" aria-hidden="true" />
				) : (
					<ArrowDownIcon className="w-auto h-4 md:h-5" aria-hidden="true" />
				)}
			</button>
			{settings.map(({ name, description, Element, Icon }, index) => (
				<div
					key={`settings-section-${section}-item-${index}`}
					className={classNames(isCollapsed && 'hidden', 'space-y-6')}
				>
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

export default Navigation;
