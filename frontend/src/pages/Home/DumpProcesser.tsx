import { useState, useEffect, type FC, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'flowbite-react';
import { BsFiletypeXml } from 'react-icons/bs';
import { useMutation } from '@tanstack/react-query';
import { PhotoIcon, PaperAirplaneIcon } from '@heroicons/react/20/solid';
import Select from '../../components/Select';
import { httpRequest } from '../../services/api';
import { classNames, showErrorToast, showSuccessToast, showWarningToast } from '../../utils';
import { useTypedOutletContext } from '../../utils/hooks';
import { LANGUAGES } from '../../constants';
import { HISTORY } from '../../constants/paths';
import type { ResultType } from '../../@types';

const DumpProcesser: FC = () => {
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
	const [image, setImage] = useState<File | null>(null);
	const [xml, setXml] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string>('');
	const [xmlPreview, setXmlPreview] = useState<string>('');
	const sendImageMutation = useMutation<ResultType>({
		mutationFn: async (): Promise<any> => {
			const response = await httpRequest('check/dump', 'POST', {
				data: fileFormData,
				headers: { 'Content-Type': 'multipart/form-data' },
			});

			return response;
		},
	});

	useEffect(() => {
		if (!image) return;

		const objectUrl = URL.createObjectURL(image);
		setImagePreview(objectUrl);

		return () => URL.revokeObjectURL(objectUrl);
	}, [image]);

	useEffect(() => {
		if (!xml) return;

		xml.text().then(xmlParsed => setXmlPreview(xmlParsed));
	}, [xml]);

	useEffect(() => {
		if (!languageSelected || !image || !xml) return;

		const formData = new FormData();
		formData.append('image', image);
		formData.append('xml', xml);

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
	}, [languageSelected, image, xml]);

	useEffect(() => {
		if (sendImageMutation.isSuccess && sendImageMutation.data) {
			setHistory(prevHistory => ({
				...(prevHistory || {}),
				[sendImageMutation.data.id]: sendImageMutation.data,
			}));
			showSuccessToast('Image processed successfully\nRedirecting to results...');
			setTimeout(navigate, 3000, `/${HISTORY}/${sendImageMutation.data.id}`);
		} else if (sendImageMutation.isError)
			showErrorToast((sendImageMutation.error as any)?.response?.data?.message || 'Error processing the image');
	}, [
		navigate,
		sendImageMutation.isSuccess,
		sendImageMutation.data,
		sendImageMutation.isError,
		sendImageMutation.error,
	]);

	const handleSendImage = (): void => {
		if (!fileFormData || sendImageMutation.isPending) return;
		if (useGoogleCloudVision && !googleServiceAccountCredentials) {
			showWarningToast('Google Cloud Service Account Credentials are required if you enabled this service.');
			return;
		}

		sendImageMutation.mutate();
	};

	const handleImageUpload = (event: FormEvent<HTMLInputElement>): void =>
		setImage(event.currentTarget.files ? event.currentTarget.files[0] : null);

	const handleXmlUpload = (event: FormEvent<HTMLInputElement>): void =>
		setXml(event.currentTarget.files ? event.currentTarget.files[0] : null);

	return (
		<>
			<div className={classNames(sendImageMutation.isPending && 'opacity-50', 'relative flex items-center gap-x-4')}>
				{image && (
					<div className="space-y-4">
						<h3 className="text-gray-900 text-base font-semibold leading-6">Image Preview</h3>
						<p className="text-sm text-gray-700">{image.name}</p>
						{imagePreview && (
							<>
								<img
									src={imagePreview}
									className={classNames(
										sendImageMutation.isPending && 'opacity-50',
										'rounded m-auto max-h-40 sm:max-h-60 xl:max-h-72 2xl:max-h-96 h-full w-full object-scale-down object-center'
									)}
								/>
								{sendImageMutation.isPending && (
									<div className="absolute inset-0 z-10 space-y-4 bg-white/30 w-fit h-fit m-auto p-4 backdrop-blur-sm">
										<Spinner size="lg" />
										<p className="motion-safe:animate-pulse text-base text-gray-200">The image is being processed</p>
										<p className="motion-safe:animate-pulse text-sm text-gray-300 font-medium">
											This may take a while...
										</p>
									</div>
								)}
							</>
						)}
					</div>
				)}
				{xml && (
					<div className="bg-gray-200 rounded relative max-h-40 sm:max-h-60 xl:max-h-72 2xl:max-h-96 w-full h-full overflow-hidden text-ellipsis">
						<div className="absolute inset-x-0 top-1/2">
							<h3 className="text-gray-900 text-base font-semibold leading-6">XML preview</h3>
							<p className="text-sm text-gray-700">{xml.name}</p>
						</div>
						<p className="blur-sm opacity-70">{xmlPreview}</p>
					</div>
				)}
			</div>
			<div className="flex items-start justify-center gap-x-12">
				<Select
					title="Target Language"
					options={Object.keys(LANGUAGES).map(key => ({
						value: key,
						label: (LANGUAGES as { [key: string]: string })[key],
					}))}
					selectedOption={languageSelected as any}
					setSelectedOption={setLanguageSelected as any}
					disabled={sendImageMutation.isPending}
				/>
				<div>
					<input
						disabled={sendImageMutation.isPending}
						hidden
						type="file"
						id="dump-image-uploader"
						accept="image/*"
						onChange={handleImageUpload}
					/>
					<label htmlFor="dump-image-uploader" className="space-y-2">
						<div
							className={classNames(
								sendImageMutation.isPending
									? 'hover:cursor-not-allowed bg-gray-200 text-gray-600'
									: 'bg-gray-900/10 hover:cursor-pointer hover:bg-gray-900/20 text-gray-900',
								'inline-flex items-center gap-x-2 rounded-md px-3 py-2 shadow-sm'
							)}
						>
							<PhotoIcon className="h-4 w-auto" aria-hidden="true" />
							<span className="text-sm font-semibold">Upload {image !== null && 'new'} image</span>
						</div>
						<p className="text-xs leading-5 text-gray-400">Images file only (JPG, JPEG, PNG, etc)</p>
					</label>
				</div>
				<div>
					<input
						disabled={sendImageMutation.isPending}
						hidden
						type="file"
						id="dump-xml-uploader"
						accept="text/xml"
						onChange={handleXmlUpload}
					/>
					<label htmlFor="dump-xml-uploader">
						<div
							className={classNames(
								sendImageMutation.isPending
									? 'hover:cursor-not-allowed bg-gray-200 text-gray-600'
									: 'bg-gray-900/10 hover:cursor-pointer hover:bg-gray-900/20 text-gray-900',
								'inline-flex items-center gap-x-2 rounded-md px-3 py-2 shadow-sm'
							)}
						>
							<BsFiletypeXml className="h-4 w-auto" aria-hidden="true" />
							<span className="text-sm font-semibold">Upload {xml !== null && 'new'} xml</span>
						</div>
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
							<span className="text-sm font-semibold">Send image and xml</span>
						</button>
					</div>
				)}
			</div>
		</>
	);
};

export default DumpProcesser;
