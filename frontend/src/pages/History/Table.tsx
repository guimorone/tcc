import { Link } from 'react-router-dom';
import { DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { TrashIcon } from '@heroicons/react/20/solid';
import { checkIfObjectIsEmpty, capitalizeString, classNames } from '../../utils';
import { LANGUAGES } from '../../constants';
import { HISTORY } from '../../constants/paths';
import type { FC } from 'react';
import type { ContextType } from '../../@types';

interface TableProps {
	history: ContextType['history'];
	setHistory: ContextType['setHistory'];
}

const Table: FC<TableProps> = ({ history, setHistory }) => {
	const clearHistory = (): void => setHistory({});
	const columns = [
		{ name: 'ID', isButton: false },
		{ name: 'Language', isButton: false },
		{ name: 'Type', isButton: false },
		{ name: 'Custom Dictionary', isButton: false },
		{ name: 'Google Cloud Vision', isButton: false },
		{ name: 'Time', isButton: false },
		{ name: 'Check Result', isButton: true },
		{ name: 'Delete Record', isButton: true },
	];

	return (
		<div className="space-y-8">
			<div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:gap-x-16">
				<div className="sm:flex-auto space-y-2">
					<h1 className="text-base font-semibold leading-6 text-gray-900">Results</h1>
					<p className="text-sm text-gray-700">
						Check out the records of the images or dumps you have processed on this device
					</p>
				</div>
				<div className="sm:flex-none">
					<button
						disabled={checkIfObjectIsEmpty(history || {})}
						onClick={clearHistory}
						className="inline-flex items-center gap-x-2 rounded-md bg-red-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:bg-gray-200 disabled:text-gray-600 disabled:hover:cursor-not-allowed"
					>
						<TrashIcon className="h-4 w-auto" aria-hidden="true" />
						<span>Clear History</span>
					</button>
				</div>
			</div>
			<div className="flow-root">
				<div className="-mx-4 -my-2 overflow-auto sm:-mx-6 lg:-mx-8 max-h-110 md:max-h-200">
					<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
						<table className="min-w-full divide-y divide-gray-300">
							<thead>
								<tr>
									{columns?.map(({ name, isButton }, index) =>
										isButton ? (
											<th
												key={`table-column-button-${name}-${index}`}
												scope="col"
												className={classNames(index === columns.length - 1 && 'sm:pr-0', 'relative py-3.5 pl-3 pr-4')}
											>
												<span className="sr-only">{name}</span>
											</th>
										) : (
											<th
												key={`table-column-${name}-${index}`}
												scope="col"
												className={classNames(
													index === 0 && 'sm:pl-0',
													'py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap'
												)}
											>
												{name}
											</th>
										)
									)}
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{Object.values(history || {})?.map(
									({ id, language, type, time, google_cloud_vision_used, custom_dict_used }, index) => (
										<tr key={`table-element-${id}-${index}`}>
											<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
												{id}
											</td>
											<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{LANGUAGES[language]}</td>
											<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{capitalizeString(type)}</td>
											<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
												{custom_dict_used
													? `${custom_dict_used?.filename} | (${capitalizeString(custom_dict_used?.usage_type)})`
													: 'No custom dictionary used'}
											</td>
											<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
												{google_cloud_vision_used ? 'Used' : 'Not used'}
											</td>
											<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{time}</td>
											<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right">
												<Link
													to={`/${HISTORY}/${id}`}
													target="_blank"
													className="inline-flex items-center gap-x-2 text-indigo-600 hover:text-indigo-900"
												>
													<DocumentMagnifyingGlassIcon className="h-4 w-auto" aria-hidden="true" />
													<span className="text-sm font-medium">
														Check Result<span className="sr-only">, {id}</span>
													</span>
												</Link>
											</td>
											<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right sm:pr-0">
												<button
													onClick={() =>
														setHistory(prevState => {
															const newState = { ...prevState };
															delete newState[id];

															return newState;
														})
													}
													className="inline-flex items-center gap-x-2 text-red-600 hover:text-red-900"
												>
													<TrashIcon className="h-4 w-auto" aria-hidden="true" />
													<span className="text-sm font-medium">
														Delete Record<span className="sr-only">, {id}</span>
													</span>
												</button>
											</td>
										</tr>
									)
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Table;
