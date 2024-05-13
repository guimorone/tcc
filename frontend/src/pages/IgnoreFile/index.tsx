import { Fragment, type FC } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon, TrashIcon, PlusCircleIcon } from '@heroicons/react/20/solid';
import { onSubmitFormHandler, classNames, checkIfObjectIsEmpty } from '../../utils';
import { useTypedOutletContext } from '../../utils/hooks';
import { LANGUAGES } from '../../constants';
import type { LanguagesKeys } from '../../@types';

const IgnoreFile: FC = () => {
	const { ignoreWords, setIgnoreWords } = useTypedOutletContext();

	const clearFile = (): void => setIgnoreWords({});

	return (
		<div className="w-full space-y-8">
			<button
				disabled={checkIfObjectIsEmpty(ignoreWords)}
				onClick={clearFile}
				className="flex items-center gap-x-2 rounded bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:bg-gray-200 disabled:text-gray-600 disabled:hover:cursor-not-allowed"
			>
				<TrashIcon className="h-4 w-auto" aria-hidden="true" />
				<span>Clear File</span>
			</button>
			{Object.keys(LANGUAGES).map((language, index) => (
				<div key={`ignore-file-language-${language}-${index}`} className="space-y-2">
					<h2 className="uppercase text-lg font-medium">{LANGUAGES[language as LanguagesKeys]}</h2>
					{language in ignoreWords && (
						<ul role="list" className="divide-y divide-gray-100">
							{ignoreWords[language as LanguagesKeys]?.map((word, idx) => (
								<li key={`ignore-file-word-${language}-${idx}`} className="flex justify-between gap-x-6 py-5">
									<p className="text-sm font-semibold leading-6 text-gray-900">{word}</p>
									<div className="flex shrink-0 items-center gap-x-6">
										<Menu as="div" className="relative flex-none">
											<Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
												<span className="sr-only">Open options</span>
												<EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
											</Menu.Button>
											<Transition
												as={Fragment}
												enter="transition ease-out duration-100"
												enterFrom="transform opacity-0 scale-95"
												enterTo="transform opacity-100 scale-100"
												leave="transition ease-in duration-75"
												leaveFrom="transform opacity-100 scale-100"
												leaveTo="transform opacity-0 scale-95"
											>
												<Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
													<Menu.Item>
														{({ active }) => (
															<button
																className={classNames(
																	active ? 'bg-gray-50' : '',
																	'flex items-center gap-x-2 px-3 py-1 w-full'
																)}
																onClick={() =>
																	setIgnoreWords(prevState => ({
																		...prevState,
																		[language]: [...(prevState[language as LanguagesKeys] || [])].filter(
																			value => value !== word
																		),
																	}))
																}
															>
																<TrashIcon className="h-4 w-auto text-red-600" aria-hidden="true" />
																<span className="text-gray-900 text-sm leading-6">Delete</span>
															</button>
														)}
													</Menu.Item>
												</Menu.Items>
											</Transition>
										</Menu>
									</div>
								</li>
							))}
						</ul>
					)}
					<form
						id={`add-word-${language}`}
						className="flex items-center gap-x-4"
						onSubmit={event => {
							const newWord = onSubmitFormHandler(event);
							if (
								!(language in newWord) ||
								!newWord[language] ||
								ignoreWords[language as LanguagesKeys]?.includes(newWord[language].trim())
							)
								return;

							setIgnoreWords(prevState => ({
								...prevState,
								[language]: [...(prevState[language as LanguagesKeys] || []), newWord[language].trim()],
							}));

							event.currentTarget.reset();
						}}
					>
						<div>
							<label htmlFor={language} className="sr-only">
								{language}
							</label>
							<input
								type="text"
								name={language}
								id={language}
								className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
							/>
						</div>
						<button
							type="submit"
							className="inline-flex items-center gap-x-2 rounded bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						>
							<PlusCircleIcon className="h-4 w-auto" aria-hidden="true" />
							<span>Add to file</span>
						</button>
					</form>
				</div>
			))}
		</div>
	);
};

export default IgnoreFile;
