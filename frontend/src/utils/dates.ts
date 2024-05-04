import { ptBR } from 'date-fns/locale';
import {
	add,
	eachDayOfInterval,
	eachMonthOfInterval,
	startOfMonth,
	endOfMonth,
	format,
	isFuture,
	isEqual,
	isBefore,
	addDays,
} from 'date-fns';
import { capitalizeString } from './';
import { dateRegex } from '../constants/regex';
import { MONTHS, TODAY } from '../constants/dates';
import type { IntRange } from '../@types';

export function formatDate(d: Date | string, separator = ' de ', literalMonth = true, withTime = true): string {
	if (typeof d === 'string') d = new Date(d);

	const date = `${d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()}${separator}${
		literalMonth ? MONTHS[d.getMonth()] : d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1
	}${separator}${d.getFullYear()}`;
	const hours = d.getHours() < 10 ? `0${d.getHours()}` : d.getHours();
	const minutes = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes();
	const seconds = d.getSeconds() < 10 ? `0${d.getSeconds()}` : d.getSeconds();
	const time = `${hours}:${minutes}:${seconds}`;

	return date + (withTime ? ` às ${time}` : '');
}

export function previousMonth(firstDayCurrentMonth: Date): Date {
	return add(firstDayCurrentMonth, { months: -1 });
}

export function nextMonth(firstDayCurrentMonth: Date): Date {
	return add(firstDayCurrentMonth, { months: 1 });
}

export function getDays(
	startDate: Date = startOfMonth(TODAY),
	endDate: Date = endOfMonth(TODAY),
	checkFuture = true
): Date[] {
	if (!(isBefore(startDate, endDate) || isEqual(startDate, endDate)))
		throw new Error('"startDate" must be an earlier or equal date than "endDate"');

	return eachDayOfInterval({
		start: checkFuture ? (isFuture(startDate) ? TODAY : startDate) : startDate,
		end: checkFuture ? (isFuture(endDate) ? TODAY : endDate) : endDate,
	});
}

export function getMonthsBetweenInterval(
	startDate: Date | { year: number; month: IntRange<1, 13>; day: IntRange<1, 32> } = new Date(2018, 0, 1),
	endDate: Date | { year: number; month: IntRange<1, 13>; day: IntRange<1, 32> } = TODAY
): Date[] {
	return eachMonthOfInterval({
		start: startDate instanceof Date ? startDate : new Date(startDate.year, startDate.month - 1, startDate.day),
		end: endDate instanceof Date ? endDate : new Date(endDate.year, endDate.month - 1, endDate.day),
	});
}

export function formatMonthYear(d: Date, capitalize = true): string {
	let newStr: string = format(d, 'MMMM yyyy', { locale: ptBR });

	if (capitalize) newStr = capitalizeString(newStr);

	return newStr;
}

export const calculateAge = (birthDate: string | Date): number | null => {
	try {
		let day, month, year, birthDateObj;
		if (typeof birthDate === 'string') {
			const match = birthDate.match(dateRegex);

			if (!match) throw new Error('Invalid date format. Use DD/MM/AAAA.');

			day = parseInt(match[1], 10);
			month = parseInt(match[2], 10) - 1;
			year = parseInt(match[3], 10);

			birthDateObj = new Date(year, month, day);
		} else {
			day = birthDate.getDate();
			month = birthDate.getMonth() + 1;
			year = birthDate.getFullYear();
			birthDateObj = birthDate;
		}

		const birthDateThisYear = new Date(TODAY.getFullYear(), month, day);
		const ageThisYear = TODAY.getFullYear() - birthDateObj.getFullYear();

		if (TODAY < birthDateThisYear) return ageThisYear - 1;

		return ageThisYear;
	} catch (error) {
		return null;
	}
};

export const getCurrentDateFormatted = (): string => {
	const currentDate = new Date();
	const day = currentDate.getDate().toString().padStart(2, '0');
	const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
	const year = currentDate.getFullYear().toString();

	return `${day}/${month}/${year}`;
};

export const generateDateArray = (currentDate: Date, numberOfItems: number): [string, string][] => {
	const dateArray: [string, string][] = [];

	for (let i = 0; i < numberOfItems; i++) {
		const transmissionLimit = format(addDays(currentDate, i * 5), 'dd/MM/yyyy');
		const validity = format(addDays(currentDate, i * 5 + 15), 'dd/MM/yyyy');
		dateArray.push([transmissionLimit, validity]);
	}

	return dateArray;
};

export const formattedDate = (date: string): string => {
	const [year, month, day] = date.split(/[-T]/);
	if (year === undefined || month === undefined || day === undefined) return date;

	const formattedDate = `${day}/${month}/${year}`;

	return formattedDate;
};

export const timeLeft = (futureDate: Date | string, now: Date | string = new Date()): string => {
	if (typeof futureDate === 'string') futureDate = new Date(futureDate);
	if (typeof now === 'string') now = new Date(now);
	const timeleft = futureDate.getTime() - now.getTime();

	const msPerSecond = 1000;
	const msPerMinute = msPerSecond * 60;
	const msPerHour = msPerMinute * 60;
	const msPerDay = msPerHour * 24;

	// calculate remaining time
	const days = Math.floor(timeleft / msPerDay);
	const hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / msPerHour);
	const minutes = Math.floor((timeleft % (1000 * 60 * 60)) / msPerMinute);
	const seconds = Math.floor((timeleft % (1000 * 60)) / msPerSecond);

	let returnString = '';
	if (days) returnString += days.toString() + ' ' + (days === 1 ? 'dia' : 'dias');
	if (hours)
		returnString +=
			(returnString === '' ? '' : !minutes ? ' e ' : ', ') +
			(hours.toString() + ' ' + (hours === 1 ? 'hora' : 'horas'));
	if (minutes)
		returnString +=
			(returnString === '' ? '' : !seconds ? ' e ' : ', ') +
			(minutes.toString() + ' ' + (minutes === 1 ? 'minuto' : 'minutos'));
	if (seconds)
		returnString +=
			(returnString === '' ? '' : ' e ') + (seconds.toString() + ' ' + (seconds === 1 ? 'segundo' : 'segundos'));

	return returnString;
};
