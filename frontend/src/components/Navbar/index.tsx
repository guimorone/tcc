import { Link, useLocation } from 'react-router-dom';
import { classNames } from '../../utils';
import * as paths from '../../constants/paths';
import type { FC } from 'react';

const Navbar: FC = () => {
	const { pathname } = useLocation();

	const navigation = [
		{ label: 'Home', path: paths.HOME, current: pathname === `/${paths.HOME}` },
		{ label: 'Ignore File', path: paths.IGNORE_FILE, current: pathname === `/${paths.IGNORE_FILE}` },
	];

	return (
		<nav className="sticky z-50 inset-x-0 top-0 border-b border-gray-200 bg-white backdrop-blur-md bg-opacity-80">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 justify-center items-center">
					<div className="-my-px ml-6 flex space-x-8 items-center justify-center">
						{navigation.map(({ label, path, current }, index) => (
							<Link
								key={`navbar-link-${index}`}
								to={path}
								className={classNames(
									current
										? 'border-indigo-500 text-gray-900'
										: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
									'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
								)}
								aria-current={current ? 'page' : undefined}
							>
								{label}
							</Link>
						))}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
