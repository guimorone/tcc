import { useState, useEffect, type FC, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner, Carousel } from 'flowbite-react';
import { useMutation } from '@tanstack/react-query';
import { PhotoIcon, PaperAirplaneIcon } from '@heroicons/react/20/solid';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import Select from '../../components/Select';
import { httpRequest } from '../../services/api';
import { classNames, showErrorToast, showSuccessToast, showWarningToast } from '../../utils';
import { useTypedOutletContext } from '../../utils/hooks';
import { LANGUAGES } from '../../constants';
import { HISTORY } from '../../constants/paths';
import type { ResultType } from '../../@types';

const ImageProcesser: FC = () => {
	const navigate = useNavigate();
	const {
		languageSelected,
		setLanguageSelected,
		dictToUse,
		ignoreWords,
		setHistory,
		useGoogleCloudVision,
		googleServiceAccountCredentials,
	} = useTypedOutletContext();
	const [fileFormData, setFileFormData] = useState<FormData | null>(null);
	const [images, setImages] = useState<File[] | null>(null);
	const [previews, setPreviews] = useState<string[]>([]);
	const sendImagesMutation = useMutation<ResultType>({
		mutationFn: async (): Promise<any> => {
			const response = await httpRequest('check/image', 'POST', {
				data: fileFormData,
				headers: { 'Content-Type': 'multipart/form-data' },
			});

			return response;
		},
	});

	useEffect(() => {
		if (!languageSelected || !images || !images.length) return;

		const formData = new FormData();
		const newPreviews: string[] = [];
		// Images
		images.forEach(file => {
			const objectUrl = URL.createObjectURL(file);
			newPreviews.push(objectUrl);
			formData.append('images', file);
		});
		setPreviews(newPreviews);

		// Custom dictionary
		if (dictToUse?.dict) {
			formData.append('dict_file', dictToUse.dict);
			formData.append('dict_usage_type', dictToUse.usageType);
		}

		// Other variables
		formData.append('ignore_words', JSON.stringify(ignoreWords));
		formData.append('language', languageSelected.value.toString());
		formData.append('use_google_cloud_vision', useGoogleCloudVision ? 'true' : 'false');
		formData.append('google_service_account_credentials', googleServiceAccountCredentials?.trim() || '');
		setFileFormData(formData);

		// Release memory (Cleanup)
		return () => newPreviews.forEach(URL.revokeObjectURL);
	}, [languageSelected, images]);

	useEffect(() => {
		if (sendImagesMutation.isSuccess && sendImagesMutation.data) {
			setHistory(prevHistory => ({
				...(prevHistory || {}),
				[sendImagesMutation.data.id]: sendImagesMutation.data,
			}));
			showSuccessToast(`${images?.length == 1 ? 'Image' : 'Images'} processed successfully\nRedirecting to results...`);
			setTimeout(navigate, 3000, `/${HISTORY}/${sendImagesMutation.data.id}`);
		} else if (sendImagesMutation.isError)
			showErrorToast(
				(sendImagesMutation.error as any)?.response?.data?.message ||
					`Error processing the ${images?.length == 1 ? 'image' : 'images'}`
			);
	}, [
		navigate,
		sendImagesMutation.isSuccess,
		sendImagesMutation.data,
		sendImagesMutation.isError,
		sendImagesMutation.error,
	]);

	const handleSendImages = (): void => {
		if (!fileFormData || sendImagesMutation.isPending) return;
		if (useGoogleCloudVision && !googleServiceAccountCredentials) {
			showWarningToast('Google Cloud Service Account Credentials are required if you enabled this service.');
			return;
		}

		sendImagesMutation.mutate();
	};

	const handleImagesUpload = (event: FormEvent<HTMLInputElement>): void =>
		setImages(event.currentTarget.files ? Array.from(event.currentTarget.files) : []);

	return (
		<>
			{images && images.length > 0 && (
				<Carousel
					leftControl={
						<ChevronLeftIcon
							className="h-6 sm:h-8 lg:h-10 w-auto rounded-full bg-white p-2 text-gray-900 hover:opacity-90"
							aria-hidden="true"
						/>
					}
					rightControl={
						<ChevronRightIcon
							className="h-6 sm:h-8 lg:h-10 w-auto rounded-full bg-white p-2 text-gray-900 hover:opacity-90"
							aria-hidden="true"
						/>
					}
					pauseOnHover
					className="relative h-56 sm:h-64 xl:h-80 2xl:h-96 bg-gray-900 rounded-md shadow w-full mx-auto"
				>
					{images?.map((file, index) => (
						<div
							key={`preview-${file.name}-${index}`}
							className={classNames(sendImagesMutation.isPending && 'opacity-50', 'space-y-4')}
						>
							<h3 className="text-white text-base font-semibold leading-6">Image {index + 1} Preview</h3>
							<p className="text-sm text-gray-200">{file.name}</p>
							{previews[index] && (
								<>
									<img
										src={previews[index]}
										className={classNames(
											sendImagesMutation.isPending && 'opacity-50',
											'rounded m-auto max-h-32 sm:max-h-40 xl:max-h-48 2xl:max-h-56 h-full w-full object-scale-down object-center'
										)}
									/>
									{sendImagesMutation.isPending && (
										<div className="absolute inset-0 z-10 space-y-4 bg-white/30 w-fit h-fit m-auto p-4 backdrop-blur-sm">
											<Spinner size="lg" />
											<p className="motion-safe:animate-pulse text-base text-gray-200">
												The {images?.length === 1 ? 'image is' : 'images are'} being processed
											</p>
											<p className="motion-safe:animate-pulse text-sm text-gray-300 font-medium">
												This may take a while...
											</p>
										</div>
									)}
								</>
							)}
						</div>
					))}
				</Carousel>
			)}
			<div className="flex items-start justify-center gap-x-12">
				<Select
					title="Target Language"
					options={Object.keys(LANGUAGES).map(key => ({
						value: key,
						label: (LANGUAGES as { [key: string]: string })[key],
					}))}
					selectedOption={languageSelected as any}
					setSelectedOption={setLanguageSelected as any}
					disabled={sendImagesMutation.isPending}
				/>
				<div>
					<input
						disabled={sendImagesMutation.isPending}
						hidden
						type="file"
						id="images-uploader"
						accept="image/*"
						onChange={handleImagesUpload}
						multiple
					/>
					<label htmlFor="images-uploader" className="space-y-2">
						<div
							className={classNames(
								sendImagesMutation.isPending
									? 'hover:cursor-not-allowed bg-gray-200 text-gray-600'
									: 'bg-gray-900/10 hover:cursor-pointer hover:bg-gray-900/20 text-gray-900',
								'inline-flex items-center gap-x-2 rounded-md px-3 py-2 shadow-sm'
							)}
						>
							<PhotoIcon className="h-4 w-auto" aria-hidden="true" />
							<span className="text-sm font-semibold">Upload {images && images.length > 0 && 'new'} images</span>
						</div>
						<p className="text-xs leading-5 text-gray-400">Images file only (JPG, JPEG, PNG, etc)</p>
					</label>
				</div>
				{fileFormData && (
					<div>
						<button
							onClick={handleSendImages}
							disabled={sendImagesMutation.isPending}
							className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-200 disabled:text-gray-600 disabled:hover:cursor-wait"
						>
							<PaperAirplaneIcon className="h-4 w-auto" aria-hidden="true" />
							<span className="text-sm font-semibold">Send {images?.length === 1 ? 'image' : 'images'}</span>
						</button>
					</div>
				)}
			</div>
		</>
	);
};

export default ImageProcesser;
