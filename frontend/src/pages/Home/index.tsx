import { useState, useEffect, type FC, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { PhotoIcon, PaperAirplaneIcon } from '@heroicons/react/20/solid';
import Select from '../../components/Select';
import { httpRequest } from '../../services/api';
import { classNames } from '../../utils';
import { useTypedOutletContext } from '../../utils/hooks';
import { LANGUAGES } from '../../constants';

const Home: FC = () => {
	const { ignoreWords } = useTypedOutletContext();
	const [fileFormData, setFileFormData] = useState<FormData | null>(null);
	const [file, setFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [languageSelected, setLanguageSelected] = useState<{ value: string; label: string }>({
		value: 'pt',
		label: LANGUAGES['pt'],
	});
	const sendImageMutation = useMutation({
		mutationFn: async () => {
			const response = await httpRequest('check', 'POST', {
				data: fileFormData,
				headers: { 'Content-Type': 'multipart/form-data' },
			});

			return response;
		},
	});

	useEffect(() => {
		if (!file) return;

		const formData = new FormData();
		const objectUrl = URL.createObjectURL(file);
		setPreview(objectUrl);
		formData.append('image', file);
		formData.append('ignore_words', JSON.stringify(ignoreWords));
		formData.append('language', languageSelected.value);
		setFileFormData(formData);

		return () => URL.revokeObjectURL(objectUrl);
	}, [file]);

	const handleSendImage = (): void => {
		if (!fileFormData || sendImageMutation.isPending) return;

		sendImageMutation.mutate();
	};

	const handleFileUpload = (event: FormEvent<HTMLInputElement>): void =>
		setFile(event.currentTarget.files?.[0] || null);

	return (
		<div className="flex flex-col gap-y-8 items-center justify-center text-center">
			{file && (
				<div className="space-y-2">
					<h3 className="text-base font-semibold leading-7">Image Preview</h3>
					{preview && <img src={preview} className="bg-gray-200 p-4 rounded-md shadow-sm w-full" />}
					<p className="text-sm text-gray-700">{file.name}</p>
				</div>
			)}
			<div className="flex items-start justify-center gap-x-12">
				<Select
					title="Target language"
					options={Object.keys(LANGUAGES).map(key => ({
						value: key,
						label: (LANGUAGES as { [key: string]: string })[key],
					}))}
					selectedOption={languageSelected}
					setSelectedOption={setLanguageSelected}
				/>
				<div>
					<input
						disabled={sendImageMutation.isPending}
						hidden
						type="file"
						id="imageUploader"
						accept="image/*"
						onChange={handleFileUpload}
					/>
					<label htmlFor="imageUploader" className="space-y-2">
						<div
							className={classNames(
								sendImageMutation.isPending
									? 'hover:cursor-not-allowed bg-gray-200 text-gray-600'
									: 'bg-gray-900/10 hover:cursor-pointer hover:bg-gray-900/20 text-gray-900',
								'inline-flex items-center gap-x-2 rounded-md px-3 py-2 shadow-sm'
							)}
						>
							<PhotoIcon className="h-4 w-auto" aria-hidden="true" />
							<span className="text-sm font-semibold">Upload {file && 'new'} screenshot</span>
						</div>
						<p className="text-xs leading-5 text-gray-400">Images only (JPG, JPEG, PNG, etc)</p>
					</label>
				</div>
				{fileFormData && (
					<div>
						<button
							onClick={handleSendImage}
							disabled={sendImageMutation.isPending}
							className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-200 disabled:text-gray-600 disabled:hover:cursor-wait"
						>
							<PaperAirplaneIcon className="h-4 w-auto" aria-hidden="true" />
							<span className="text-sm font-semibold">Send image</span>
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default Home;
