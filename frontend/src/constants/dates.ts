import { add, startOfToday, getMonth, getYear } from 'date-fns';

export const INITIAL_APP_YEAR = 2023;
export const TODAY = startOfToday();
export const CURRENT_MONTH = new Date(getYear(TODAY), getMonth(TODAY));
export const CURRENT_YEAR = getYear(TODAY);
export const NEXT_MONTH = add(TODAY, { months: 1 });
export const WEEK_DAYS = [
	{ name: 'Domingo', initial: 'D', weekendOrHoliday: true },
	{ name: 'Segunda', initial: 'S', weekendOrHoliday: false },
	{ name: 'Terça', initial: 'T', weekendOrHoliday: false },
	{ name: 'Quarta', initial: 'Q', weekendOrHoliday: false },
	{ name: 'Quinta', initial: 'Q', weekendOrHoliday: false },
	{ name: 'Sexta', initial: 'S', weekendOrHoliday: false },
	{ name: 'Sábado', initial: 'S', weekendOrHoliday: true },
];
export const MONTHS = [
	'Janeiro',
	'Fevereiro',
	'Março',
	'Abril',
	'Maio',
	'Junho',
	'Julho',
	'Agosto',
	'Setembro',
	'Outubro',
	'Novembro',
	'Dezembro',
];
