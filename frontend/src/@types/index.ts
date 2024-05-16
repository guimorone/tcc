import type {
  Dispatch,
  SetStateAction,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  SVGProps,
  RefAttributes,
  JSX,
} from 'react';

export type OrderType = 'asc' | 'desc';
export type DataItem = { [key: string]: any };
export type Column = { label: string; value: string };

export type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>;

export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;

export type Sizes =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | '7xl'
  | '8xl'
  | '9xl'
  | '10xl';

export type IconType =
  | ForwardRefExoticComponent<
      PropsWithoutRef<SVGProps<SVGSVGElement>> & {
        title?: string;
        titleId?: string;
      } & RefAttributes<SVGSVGElement>
    >
  | ((props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => JSX.Element);

export type LanguagesKeys =
  | 'bn'
  | 'de'
  | 'en'
  | 'es'
  | 'fr'
  | 'hi'
  | 'it'
  | 'ja'
  | 'jv'
  | 'ko'
  | 'mr'
  | 'ms'
  | 'pl'
  | 'pt'
  | 'ro'
  | 'ru'
  | 'ta'
  | 'tr'
  | 'uk'
  | 'zh';
export type DictUsageType = 'complement' | 'replacement';
export type IgnoreWordsType = string[];
export type ResultType = {
  id: string;
  language: LanguagesKeys;
  time: string;
  images: { filename: string; words: string[]; image: string | null }[];
  custom_dict_used: { filename: string; usage_type: DictUsageType } | null;
};
export type HistoryType = { [key: ResultType['id']]: ResultType };
export type DictToUseType = { dict: File | null; usageType: DictUsageType } | null;
export type ContextType = {
  currentPage: string;
  ignoreWords: IgnoreWordsType | undefined;
  setIgnoreWords: Dispatch<SetStateAction<IgnoreWordsType | undefined>>;
  history: HistoryType | undefined;
  setHistory: Dispatch<SetStateAction<HistoryType | undefined>>;
  useGoogleCloudVision: boolean | undefined;
  setUseGoogleCloudVision: Dispatch<SetStateAction<boolean | undefined>>;
  customDicts: File[] | undefined;
  setCustomDicts: Dispatch<SetStateAction<File[] | undefined>>;
  dictToUse: DictToUseType | undefined;
  setDictToUse: Dispatch<SetStateAction<DictToUseType | undefined>>;
};
export type OptionType = { label: string; value: string | number };
