import { useState, useEffect, Fragment, type FC, type ChangeEventHandler } from 'react';
import { FaBook } from 'react-icons/fa';
import { TrashIcon } from '@heroicons/react/20/solid';
import Select from '../../components/Select';
import { checkIfObjectIsEmpty, capitalizeString } from '../../utils';
import { useTypedOutletContext } from '../../utils/hooks';
import type { DictUsageType, OptionType } from '../../@types';

const Dictionaries: FC = () => {
  const usageOptions: { value: DictUsageType; label: string }[] = [
    { value: 'complement', label: 'Complement' },
    { value: 'replacement', label: 'Replacement' },
  ];
  const { customDicts, setCustomDicts, dictToUse, setDictToUse } = useTypedOutletContext();
  const dictOptions = customDicts?.map((dict, index) => ({ label: dict.name, value: index })) || [];
  const [dictSelected, setDictSelected] = useState<OptionType | null>(null);
  const [usageType, setUsageType] = useState<{ value: DictUsageType; label: string }>({
    value: dictToUse?.usageType || 'complement',
    label: dictToUse?.usageType ? capitalizeString(dictToUse?.usageType) : 'Complement',
  });

  useEffect(() => {
    if (!dictToUse?.dict) return;
    const currentDictToUseIndex = dictToUse?.dict
      ? (customDicts || [])?.findIndex(file => file.name === dictToUse?.dict?.name)
      : -1;
    if (customDicts && customDicts.length > 0 && currentDictToUseIndex !== -1)
      setDictSelected({ label: customDicts[currentDictToUseIndex].name, value: currentDictToUseIndex });
  }, [dictToUse?.dict]);

  useEffect(() => {
    if (!usageType) return;

    setDictToUse({
      dict:
        dictSelected && customDicts?.[dictSelected?.value as number]
          ? customDicts?.[dictSelected?.value as number]
          : null,
      usageType: usageType.value,
    });
  }, [dictSelected, usageType]);

  const handleDictsUpload: ChangeEventHandler<HTMLInputElement> = event =>
    setCustomDicts(prev => [...(prev || []), ...(event.target.files ? Array.from(event.target.files) : [])]);
  const clearDicts = (): void => setCustomDicts([]);

  return (
    <div className="space-y-4">
      {customDicts?.map((dict, index) => (
        <Fragment key={`custom-dict-${index}`}>
          {!checkIfObjectIsEmpty(dict) ? (
            <div className="flex items-center justify-between gap-x-4 text-sm">
              <p className="font-semibold">{dict.name}</p>
              <button
                type="button"
                onClick={() => setCustomDicts(prev => (prev || []).filter((_, idx) => index !== idx))}
                className=" text-red-600 hover:text-red-500"
              >
                Remove
              </button>
            </div>
          ) : null}
        </Fragment>
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
      <div className="flex items-center gap-x-4">
        <Select
          title="Select Dictionary"
          options={dictOptions}
          selectedOption={dictSelected}
          setSelectedOption={setDictSelected}
          disabled={!customDicts || !customDicts.length}
          includeNullOption
        />
        <Select
          title="Dict Usage Type"
          options={usageOptions}
          selectedOption={usageType}
          setSelectedOption={setUsageType as any}
          disabled={!dictSelected}
        />
      </div>
      <div className="space-y-1 text-xs">
        <p>
          <b>Complement &rarr;</b> Incorporate custom dictionary to server default language dictionary. In other
          words, works WITH our dictionary.
        </p>
        <p>
          <b>Replacement &rarr;</b> Incorporate custom dictionary to server, wihtout using out default language
          dictionary. In other words, works WITHOUT our dictionary.
        </p>
      </div>
    </div>
  );
};

export default Dictionaries;
