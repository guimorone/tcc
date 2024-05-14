import { Link } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/20/solid';
import { checkIfObjectIsEmpty, setLocalStorageItem } from '../../utils';
import { LANGUAGES } from '../../constants';
import { HISTORY } from '../../constants/paths';
import type { FC } from 'react';
import type { HistoryType } from '../../@types';

interface TableProps {
	history: HistoryType;
}

const Table: FC<TableProps> = ({ history }) => {
	const clearHistory = (): void => {
		setLocalStorageItem('history', {});
		window.location.reload();
	};

	return (
		<>
			<div className="sm:flex sm:items-center">
				<div className="sm:flex-auto">
					<h1 className="text-base font-semibold leading-6 text-gray-900">Results</h1>
					<p className="mt-2 text-sm text-gray-700">Check out the results of the images you have processed</p>
				</div>
				<div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
					<button
						disabled={checkIfObjectIsEmpty(history)}
						onClick={clearHistory}
						className="inline-flex items-center gap-x-2 rounded-md bg-red-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:bg-gray-200 disabled:text-gray-600 disabled:hover:cursor-not-allowed"
					>
						<TrashIcon className="h-4 w-auto" aria-hidden="true" />
						<span>Clear History</span>
					</button>
				</div>
			</div>
			<div className="mt-8 flow-root">
				<div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
					<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
						<table className="min-w-full divide-y divide-gray-300">
							<thead>
								<tr>
									<th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
										ID
									</th>
									<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
										Language
									</th>
									<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
										Time
									</th>
									<th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
										<span className="sr-only">Link</span>
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{Object.values(history)?.map(({ id, language, time }, index) => (
									<tr key={`table-element-${id}-${index}`}>
										<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{id}</td>
										<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
											{LANGUAGES[language]} ({language})
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{time}</td>
										<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
											<Link to={`/${HISTORY}/${id}`} className="text-indigo-600 hover:text-indigo-900">
												Check results<span className="sr-only">, {id}</span>
											</Link>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</>
	);
};

export default Table;
