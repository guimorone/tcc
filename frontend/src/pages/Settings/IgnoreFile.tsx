import { Fragment, useState, type FC, type ChangeEvent } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
	EllipsisVerticalIcon,
	TrashIcon,
	PlusCircleIcon,
	PencilSquareIcon,
	CheckIcon,
	XMarkIcon,
} from '@heroicons/react/20/solid';
import { classNames, showWarningToast } from '../../utils';
import { useTypedOutletContext } from '../../utils/hooks';

const IgnoreFile: FC = () => {
	const [newWord, setNewWord] = useState<string>('');
	const [editedWord, setEditedWord] = useState<string>('');
	const [editedWordIndex, setEditedWordIndex] = useState<number>(-1);
	const { ignoreWords, setIgnoreWords } = useTypedOutletContext();

	const clearFile = (): void => setIgnoreWords([]);
	const handleChangeNewWord = ({ target }: ChangeEvent<HTMLInputElement>): void =>
		setNewWord(target.value.trim().toLowerCase());
	const handleEditedWord = ({ target }: ChangeEvent<HTMLInputElement>): void =>
		setEditedWord(target.value.trim().toLowerCase());
	const handleChangeEditedWord = (): void => {
		if (ignoreWords?.includes(editedWord)) {
			showWarningToast('Word already ignored');
			return;
		}

		setIgnoreWords(prevState => {
			if (!prevState || !prevState.length) return [editedWord];

			prevState[editedWordIndex] = editedWord;
			return prevState;
		});
		setEditedWord('');
		setEditedWordIndex(-1);
	};
	const handleAddNewWord = (): void => {
		if (ignoreWords?.includes(newWord)) {
			showWarningToast('Word already ignored');
			return;
		}

		setIgnoreWords(prevState => [...(prevState || []), newWord]);
		setNewWord('');
	};

	return (
		<div className="w-full space-y-8">
			<button
				disabled={!ignoreWords || !ignoreWords.length}
				onClick={clearFile}
				className="inline-flex items-center gap-x-2 rounded bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:bg-gray-200 disabled:text-gray-600 disabled:hover:cursor-not-allowed"
			>
				<TrashIcon className="h-4 w-auto" aria-hidden="true" />
				<span>Clear File</span>
			</button>
			{ignoreWords && ignoreWords.length > 0 && (
				<ul role="list" className="divide-y divide-gray-100">
					{ignoreWords?.map((word, index) => (
						<li key={`ignore-file-word-${word}-${index}`} className="flex justify-between gap-x-6 py-5">
							{editedWordIndex === index ? (
								<div className="flex items-center gap-x-4">
									<div>
										<label htmlFor="edit-word" className="sr-only">
											Edit word
										</label>
										<input
											type="text"
											name="edit-word"
											id="edit-word"
											value={editedWord}
											onChange={handleEditedWord}
											className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
										/>
									</div>
									<button
										type="button"
										onClick={handleChangeEditedWord}
										className="inline-flex items-center gap-x-2 rounded bg-green-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
									>
										<CheckIcon className="h-4 w-auto" aria-hidden="true" />
										<span>Confirm changes</span>
									</button>
									<button
										type="button"
										onClick={() => {
											setEditedWord('');
											setEditedWordIndex(-1);
										}}
										className="inline-flex items-center gap-x-2 rounded bg-gray-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
									>
										<XMarkIcon className="h-4 w-auto" aria-hidden="true" />
										<span>Cancel</span>
									</button>
								</div>
							) : (
								<p className="text-sm font-semibold leading-6 text-gray-900">{word}</p>
							)}
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
														onClick={() => {
															setEditedWord(word);
															setEditedWordIndex(index);
														}}
													>
														<PencilSquareIcon className="h-4 w-auto text-indigo-600" aria-hidden="true" />
														<span className="text-gray-900 text-sm leading-6">Edit</span>
													</button>
												)}
											</Menu.Item>
											<Menu.Item>
												{({ active }) => (
													<button
														className={classNames(
															active ? 'bg-gray-50' : '',
															'flex items-center gap-x-2 px-3 py-1 w-full'
														)}
														onClick={() =>
															setIgnoreWords(prevState => [...(prevState || [])].filter(value => value !== word))
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
			<div className="flex items-center gap-x-4">
				<div>
					<label htmlFor="add-to-ignore" className="sr-only">
						Add to ignore
					</label>
					<input
						type="text"
						name="add-to-ignore"
						id="add-to-ignore"
						value={newWord}
						onChange={handleChangeNewWord}
						className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					/>
				</div>
				<button
					type="button"
					onClick={handleAddNewWord}
					className="inline-flex items-center gap-x-2 rounded bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
				>
					<PlusCircleIcon className="h-4 w-auto" aria-hidden="true" />
					<span>Add to file</span>
				</button>
			</div>
		</div>
	);
};

export default IgnoreFile;
