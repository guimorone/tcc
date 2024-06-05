import { PlusCircleIcon } from '@heroicons/react/20/solid';
import { classNames, capitalizeString } from '../../utils';
import { useTypedOutletContext } from '../../utils/hooks';
import { LANGUAGES } from '../../constants';
import type { FC } from 'react';
import type { ResultType } from '../../@types';
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
				<b>ID &rarr;</b> {id}
			</h2>
			<h3 className="text-xs text-gray-700">
				<b>Language &rarr;</b> {LANGUAGES[language]}
			</h3>
			<h3 className="text-xs text-gray-700">
				<b>Type &rarr;</b> {capitalizeString(details.type)}
			</h3>
			{details.custom_dict_used ? (
				<h3 className="text-xs text-gray-700">
					<b>Custom Dictionary &rarr;</b> {details.custom_dict_used.filename} |{' '}
					{capitalizeString(details.custom_dict_used.usage_type)}
				</h3>
			) : (
				<h3 className="text-xs text-gray-700">
					<b>Custom Dictionary &rarr;</b> No custom dictionary used
				</h3>
			)}
			<h3 className="text-xs text-gray-700">
				<b>Google Cloud Vision &rarr;</b> {details.google_cloud_vision_used ? 'Used' : 'Not used'}
			</h3>
			{details.ignore_words && details.ignore_words.length > 0 && (
				<h3 className="text-xs text-gray-700">
					<b>Ignored Words &rarr;</b> {details.ignore_words.join(', ')}
				</h3>
			)}
			<p className="text-xs text-yellow-400">Some words may seem “strange” due to the icons present in the images</p>
			<div className="space-y-4 divide-y-2 divide-indigo-600 divide-dashed">
				{details?.files?.map(({ filename, words, image }, index) => (
					<div key={`result-${filename}-${index}`} className="space-y-4">
						<h3 className={classNames(index > 0 && 'mt-8', 'text-lg font-semibold leading-6 text-gray-900')}>
							{filename}
						</h3>
						{image && (
							<img src={`data:image/png;base64,${image}`} className="mx-auto bg-gray-200 p-4 rounded-md shadow-sm" />
						)}
						{!words || !words.length ? (
							<p className="text-base text-red-600">No incorrect words found.</p>
						) : (
							<ul role="list" className="divide-y divide-gray-100">
								{words?.map((word, idx) => {
									word = word.trim().toLowerCase();
									if (!word) return null;
									const isIgnored = ignoreWords?.includes(word);

									return (
										<li
											key={`details-word-${language}-${idx}`}
											className="flex items-center justify-between gap-x-6 py-5"
										>
											<p className="text-sm font-semibold leading-6 text-gray-900">{word}</p>
											<div className="space-y-2">
												<div className="flex shrink-0 items-center gap-x-6">
													<button
														disabled={isIgnored}
														className="rounded-md shadow-sm bg-gray-700 flex items-center gap-x-2 px-2.5 py-1.5 w-full hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 disabled:bg-gray-200 disabled:text-gray-600 disabled:hover:cursor-not-allowed"
														onClick={() => setIgnoreWords(prevState => [...(prevState || []), word])}
													>
														<PlusCircleIcon className="h-4 w-auto text-indigo-400" aria-hidden="true" />
														<span className="text-white text-sm leading-6">Add to ignore</span>
													</button>
												</div>
												{isIgnored && (
													<p className="text-xs font-medium leading-6 text-yellow-400">Word already ignored</p>
												)}
											</div>
										</li>
									);
								})}
							</ul>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default Details;
