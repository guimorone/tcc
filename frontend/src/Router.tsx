import { redirect, createBrowserRouter, RouterProvider } from 'react-router-dom';
import Default from './pages/Default';
import Home from './pages/Home';
import Settings from './pages/Settings';
import History from './pages/History';

import * as paths from './constants/paths';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Default />,
		children: [
			{ path: paths.HOME, element: <Home /> },
			{ path: paths.HISTORY, element: <History /> },
			{ path: `${paths.HISTORY}/:id`, element: <History /> },
			{ path: paths.SETTINGS, element: <Settings /> },
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
