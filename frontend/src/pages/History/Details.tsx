import { PlusCircleIcon } from '@heroicons/react/20/solid';
import { useTypedOutletContext } from '../../utils/hooks';
import { LANGUAGES } from '../../constants';
import type { FC } from 'react';
import type { LanguagesKeys, ResultType } from '../../@types';

interface DetailsProps {
	id: string;
	details: ResultType;
}

const Details: FC<DetailsProps> = ({ id, details }) => {
	const { ignoreWords, setIgnoreWords } = useTypedOutletContext();
	const language = details.language;

	return (
		<div className="space-y-4">
			<h2 className="text-xs text-gray-700">
				{LANGUAGES[language]} | {id}
			</h2>
			{!details.words || !details.words.length ? (
				<p className="text-base text-red-600">No incorrect words found.</p>
			) : (
				<ul role="list" className="divide-y divide-gray-100">
					{details.words?.map((word, idx) => {
						const isIgnored = ignoreWords[language as LanguagesKeys]?.includes(word.toLowerCase());

						return (
							<li key={`details-word-${language}-${idx}`} className="flex items-center justify-between gap-x-6 py-5">
								<p className="text-sm font-semibold leading-6 text-gray-900">{word}</p>

								<div className="space-y-2">
									<div className="flex shrink-0 items-center gap-x-6">
										<button
											disabled={isIgnored}
											className="rounded-md shadow-sm bg-gray-700 flex items-center gap-x-2 px-2.5 py-1.5 w-full hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 disabled:bg-gray-200 disabled:text-gray-600 disabled:hover:cursor-not-allowed"
											onClick={() =>
												setIgnoreWords(prevState => ({
													...prevState,
													[language]: [...(prevState[language as LanguagesKeys] || []), word.toLowerCase()],
												}))
											}
										>
											<PlusCircleIcon className="h-4 w-auto text-indigo-400" aria-hidden="true" />
											<span className="text-white text-sm leading-6">Add to ignore</span>
										</button>
									</div>
									{isIgnored && <p className="text-xs font-medium leading-6 text-yellow-400">Word already ignored</p>}
								</div>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
};

export default Details;
