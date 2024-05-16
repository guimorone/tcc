import { Link, useLocation } from 'react-router-dom';
import { MdHistory } from 'react-icons/md';
import { HomeIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { classNames } from '../../utils';
import * as paths from '../../constants/paths';
import type { FC } from 'react';

const Navbar: FC = () => {
	const { pathname } = useLocation();
	const currentPage = pathname.split('/')[1];

	const navigation = [
		{ label: 'Home', path: paths.HOME, current: currentPage === paths.HOME, Icon: HomeIcon },
		{ label: 'History', path: paths.HISTORY, current: currentPage === paths.HISTORY, Icon: MdHistory },
		{ label: 'Settings', path: paths.SETTINGS, current: currentPage === paths.SETTINGS, Icon: Cog6ToothIcon },
	];

	return (
		<nav className="sticky z-30 inset-x-0 top-0 border-b border-gray-200 bg-white backdrop-blur-md bg-opacity-80">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 justify-center items-center">
					<div className="-my-px flex gap-x-8 items-center justify-center">
						{navigation.map(({ label, path, current, Icon }, index) => (
							<Link
								key={`navbar-link-${index}`}
								to={path}
								className={classNames(
									current
										? 'border-indigo-500 text-gray-900'
										: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
									'inline-flex items-center gap-x-2 border-b-2 px-1 pt-1'
								)}
								aria-current={current ? 'page' : undefined}
							>
								<Icon className="h-4 w-auto" aria-hidden="true" />
								<span className="text-sm font-medium">{label}</span>
							</Link>
						))}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
