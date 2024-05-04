import {
	passwordRegexDecimal,
	passwordRegexEspecialChar,
	passwordRegexLowerLetter,
	passwordRegexUpperLetter,
} from '../constants/regex';

/**
 * Returns the error message
 */
export function checkPasswordCreation(password: string): string {
	if (!password) return '';

	if (password.length < 8) return 'A senha deve conter pelo menos 8 caracteres';
	else if (!passwordRegexLowerLetter.test(password)) return 'A senha deve deve conter pelo menos 1 letra minúscula';
	else if (!passwordRegexUpperLetter.test(password)) return 'A senha deve deve conter pelo menos 1 letra maiúscula';
	else if (!passwordRegexDecimal.test(password)) return 'A senha deve deve conter pelo menos 1 número';
	else if (!passwordRegexEspecialChar.test(password)) return 'A senha deve deve conter pelo menos 1 caractere especial';

	return '';
}
