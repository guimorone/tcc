import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import localforage from 'localforage';
import App from './App.tsx';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

localforage.config({
	name: 'AppStorage', // Name of the database
	storeName: 'DataStore', // Name of the data store
	version: 1.0, // Database version
	description: 'Local storage for the app', // Description for the database
	size: 10 * 1024 * 1024, // Size of the database in bytes (10 MB in this example)
	driver: [localforage.WEBSQL, localforage.INDEXEDDB, localforage.LOCALSTORAGE], // Preferred storage drivers in order
});

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<App />
		<ToastContainer position="top-right" newestOnTop />
	</React.StrictMode>
);
