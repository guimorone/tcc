import { redirect, createBrowserRouter, RouterProvider } from 'react-router-dom';

import Default from './pages/Default';
import Home from './pages/Home';
import IgnoreFile from './pages/IgnoreFile';
import History from './pages/History';

import * as paths from './constants/paths';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Default />,
		children: [
			{ path: paths.HOME, element: <Home /> },
			{ path: paths.IGNORE_FILE, element: <IgnoreFile /> },
			{ path: paths.HISTORY, element: <History /> },
			{ path: `${paths.HISTORY}/:id`, element: <History /> },
		],
	},
	{
		path: '*',
		loader: () => redirect('/'),
	},
]);

export default function Router() {
	return <RouterProvider router={router} />;
}
