import { FaBook } from 'react-icons/fa';
import { TrashIcon } from '@heroicons/react/20/solid';
import { checkIfObjectIsEmpty } from '../../utils';
import { useTypedOutletContext } from '../../utils/hooks';
import type { FC, ChangeEventHandler } from 'react';

const Dictionaries: FC = () => {
	const { customDicts, setCustomDicts, dictToUse, setDictToUse } = useTypedOutletContext();

	const handleDictsUpload: ChangeEventHandler<HTMLInputElement> = event =>
		setCustomDicts(prev => [...(prev || []), ...(event.target.files ? Array.from(event.target.files) : [])]);
	const clearDicts = (): void => setCustomDicts([]);

	return (
		<div className="space-y-4">
			{customDicts?.map((dict, index) => (
				<>
					{!checkIfObjectIsEmpty(dict) ? (
						<div key={`custom-dict-${index}`} className="flex items-center justify-between gap-x-4">
							<p className="text-sm font-semibold">{dict.name}</p>
							<button
								type="button"
								onClick={() => setCustomDicts(prev => (prev || []).filter((_, idx) => index !== idx))}
								className="text-sm text-red-600 hover:text-red-500"
							>
								Remove
							</button>
						</div>
					) : null}
				</>
			))}
			<div className="flex items-baseline gap-x-4">
				<div>
					<input hidden type="file" id="dicts-uploader" accept=".txt" onChange={handleDictsUpload} multiple />
					<label htmlFor="dicts-uploader" className="space-y-2">
						<div className="inline-flex items-center gap-x-2 rounded-md px-3 py-2 shadow-sm bg-gray-900/10 hover:cursor-pointer hover:bg-gray-900/20 text-gray-900">
							<FaBook className="h-4 w-auto" aria-hidden="true" />
							<span className="text-sm font-semibold">
								Upload {customDicts && customDicts.length > 0 && 'new'} dicts
							</span>
						</div>
						<p className="text-xs leading-5 text-gray-400">Text files only (.txt)</p>
					</label>
				</div>
				<button
					disabled={!customDicts || !customDicts.length}
					onClick={clearDicts}
					className="inline-flex items-center gap-x-2 rounded bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:bg-gray-200 disabled:text-gray-600 disabled:hover:cursor-not-allowed"
				>
					<TrashIcon className="h-4 w-auto" aria-hidden="true" />
					<span>Clear Dicts</span>
				</button>
			</div>
		</div>
	);
};

export default Dictionaries;
