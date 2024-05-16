import { useState, type FC, type Dispatch, type SetStateAction } from 'react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Combobox } from '@headlessui/react';
import { classNames, filterData } from '../../utils';
import type { OptionType } from '../../@types';
interface SelectProps {
  title: string;
  options: OptionType[];
  selectedOption: OptionType | null;
  setSelectedOption: Dispatch<SetStateAction<OptionType | null>>;
  disabled?: boolean;
  includeNullOption?: boolean;
}

const Select: FC<SelectProps> = ({
  title,
  options,
  selectedOption,
  setSelectedOption,
  disabled = false,
  includeNullOption = false,
}) => {
  const [query, setQuery] = useState<string>('');

  const filteredOptions = filterData(query, options, ['label']);

  return (
    <Combobox
      as="div"
      value={selectedOption}
      onChange={option => {
        setQuery('');
        setSelectedOption(option);
      }}
      disabled={disabled}
    >
      <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">{title}</Combobox.Label>
      <div className="relative mt-2">
        <Combobox.Input
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:bg-gray-200 disabled:hover:cursor-not-allowed"
          onChange={event => setQuery(event.target.value)}
          onBlur={() => setQuery('')}
          displayValue={(option: { label: string; value: string }) => option?.label || 'NO OPTION'}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>
        {filteredOptions.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {includeNullOption && (
              <Combobox.Option
                value={null}
                className={({ active }) =>
                  classNames(
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                    active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span className={classNames('block truncate', selected && 'font-semibold')}>NO OPTION</span>
                    {selected && (
                      <span
                        className={classNames(
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                          active ? 'text-white' : 'text-indigo-600'
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            )}
            {filteredOptions.map(option => (
              <Combobox.Option
                key={option.value}
                value={option}
                className={({ active }) =>
                  classNames(
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                    active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span className={classNames('block truncate', selected && 'font-semibold')}>
                      {option.label}
                    </span>

                    {selected && (
                      <span
                        className={classNames(
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                          active ? 'text-white' : 'text-indigo-600'
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
};

export default Select;
