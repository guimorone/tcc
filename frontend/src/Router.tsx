import { redirect, createBrowserRouter, RouterProvider } from 'react-router-dom';

import Default from './pages/Default';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Default />,
		children: [],
	},
	{
		path: '*',
		loader: () => redirect('/'),
	},
]);

export default function Router() {
	return <RouterProvider router={router} />;
}
