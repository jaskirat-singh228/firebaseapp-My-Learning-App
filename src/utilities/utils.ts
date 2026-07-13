import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import dayjs from 'dayjs';
import { Alert, AlertButton, AlertOptions } from 'react-native';
import { MessageType, showMessage } from 'react-native-flash-message';
import { APP_DATE_FORMAT, APP_DATE_TIME_FORMAT } from './constants';

/**
 * Function to display an alert dialog with a message and an optional title.
 * The alert provides important information or feedback to the user.
 * @param message (string) The message to be displayed in the alert.
 * @param title (string) [Optional] The title of the alert. Defaults to "CWC" if not provided.
 * @returns {void}.
 *
 * Example Usage:
 * showAlert("Are you sure you want to delete this item?");
 * showAlert("An error occurred while processing your request", "Error");
 */
export const showAlert = (
	message: string,
	title?: string,
	alertButtons?: AlertButton[],
	options?: AlertOptions,
): void => {
	return Alert.alert(title ?? 'CWC', message, alertButtons, options);
};

/**
 * Displays a toast notification using react-native-flash-message.
 *
 * @param {string} message - The message text to display in the toast.
 * @param {MessageType} type - The type of message (e.g., 'success', 'danger', 'info', 'warning').
 * @param {boolean} [autoHide=true] - Whether the toast should auto-hide after a short duration. If `false`, it will persist for a longer duration.
 *
 * @returns {void}
 *
 * @example
 * // Auto-hide toast after 3 seconds
 * showToast('Order placed successfully!', 'success');
 *
 * @example
 * // Persistent toast until manually dismissed
 * showToast('No internet connection', 'danger', false);
 */
export const showToast = (message: string, type: MessageType, autoHide?: boolean): void => {
	return showMessage({
		message: message,
		type: type,
		duration: autoHide === false ? 100000 : 3000,
		autoHide: autoHide ?? true,
		animated: true,
	});
};

/**
 * Function to check if the entered email address is valid or not.
 * Rule for email validation: Must follow the standard email format (e.g., "user@example.com").
 * - The email should contain:
 *   - No spaces or invalid characters before the "@" symbol.
 *   - A valid domain structure after the "@" symbol, including at least one period (".").
 * @param email (string) accepts the string value of the email address.
 * @returns {boolean} value based on email validation.
 */
export const validateEmail = (email: string): boolean => {
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailPattern.test(email);
};

/**
 * Function to check if enetered password is valid or not.
 * Rule for password validation: Minimum eight characters, at least one uppercase letter,
 * one lowercase letter, one number and one special character.
 * @param value (string) accepts string value of the password
 * @returns {boolean} value based on password validation
 */
export const validatePassword = (value: string): boolean => {
	const regularExpression = /^(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
	return regularExpression.test(value);
};

/**
 * Function to check if enetered mobile number is valid or not.
 * Rule for mobile number validation: Must be of length 10,
 * @param value (string) accepts string value of the mobile number
 * @returns {boolean} value based on mobile number validation
 */
export const validateMobileNumber = (value: string): boolean => {
	const isOnlyNumbers = /^[0-9]+$/.test(value);
	return value.trim().length === 10 && isOnlyNumbers;
};

/**
 * Handles API errors by displaying a toast notification.
 * @param {AxiosError} error - The Axios error object from the failed API request.
 * @returns {void}
 */
export const onApiError = (error: AxiosError): void => {
	showToast(error?.message ?? 'Server Error!', 'danger');
};

/**
 * Formats the Axios request configuration object into a readable log format.
 * @param {AxiosRequestConfig} config - The Axios request configuration object.
 * @returns {void}
 */
export const getFormattedIntercepterRequestLog = (config: AxiosRequestConfig): void => {
	const formattedConfig = {
		baseURL: config?.baseURL ?? '',
		apiURL: config?.url ?? '',
		headers: config?.headers ?? null,
		data: config?.data ?? null,
		parameters: config?.params ?? null,
		requestType: config?.method ?? '',
	};
	console.log(
		'\x1b[34m',
		'\n****************************** API_REQUEST ******************************\n',
		JSON.stringify(formattedConfig, null, 2),
		'\n*************************************************************************\n',
	);
};

/**
 * Formats the Axios response object into a readable log format.
 * @param {AxiosResponse} response - The Axios response object.
 * @returns {void}
 */
export const getFormattedIntercepterResponseLog = (response: AxiosResponse): void => {
	const formattedConfig = {
		baseURL: response?.config?.baseURL ?? '',
		apiURL: response?.config?.url ?? '',
		data: response?.data ?? null,
		parameters: response?.config?.params ?? null,
		headers: null,
		requestType: response?.config?.method ?? '',
	};
	console.log(
		'\x1b[33m',
		'\n****************************** API_RESPONSE ******************************\n',
		JSON.stringify(formattedConfig, null, 2),
		'\n*************************************************************************\n',
	);
};

/**
 * Formats a number with comma separators for thousands.
 * @param {string | number} value - The number value to format (can be string or number).
 * @returns {string} - The formatted number string with comma separators.
 *
 * @example
 * formatAmount('15000') // returns '15,000'
 * formatAmount(15000) // returns '15,000'
 * formatAmount('15500') // returns '15,500'
 */
export const formatAmount = (value: string | number): string => {
	const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
	return numValue.toLocaleString('en-IN', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
};

/**
 * Converts a date string from "DD MMM YYYY" format to ISO 8601 format.
 * @param {string} dateString - The date string in "DD MMM YYYY" format (e.g., "14 Feb 2026").
 * @returns {string} - The ISO 8601 formatted date string (e.g., "2026-02-14T00:00:00.000Z"), or empty string if invalid.
 */

/**
 * Formats a date object or string into a standardized "DD MMM YYYY" format.
 * @param {string | Date | number | dayjs.Dayjs} date - The date to format.
 * @returns {string} - The formatted date string (e.g., "27 Dec 2025").
 */
export const formatDate = (
	date: string | Date | number | dayjs.Dayjs,
	includeTime: boolean = false,
): string => {
	if (!date) return '';
	const d = dayjs(date);
	return d.isValid() ? d.format(includeTime ? APP_DATE_TIME_FORMAT : APP_DATE_FORMAT) : '';
};

/**
 * Formats a date object or string into the ISO 8601 format required by APIs.
 * @param {string | Date | number | dayjs.Dayjs} date - The date to format.
 * @returns {string} - The ISO 8601 formatted date string (e.g., "2026-02-19T07:18:21.728Z").
 */
export const formatDateForApi = (date: string | Date | number | dayjs.Dayjs): string => {
	if (!date) return '';
	const d = dayjs(date);
	return d.isValid() ? d.toISOString() : '';
};

export const validateGSTIN = (gstin: string): boolean => {
	if (!gstin) return false;
	if (gstin === 'URP') return true;

	const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

	if (!GSTIN_REGEX.test(gstin)) {
		return false;
	}

	// Checksum validation
	const gstinChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const factor = [1, 2];
	let sum = 0;

	for (let i = 0; i < 14; i++) {
		const codePoint = gstinChars.indexOf(gstin[i]);
		const digit = codePoint * factor[i % 2];

		const quotient = Math.floor(digit / 36);
		const remainder = digit % 36;

		sum += quotient + remainder;
	}

	const checkCodePoint = (36 - (sum % 36)) % 36;
	const expectedCheckChar = gstinChars[checkCodePoint];

	return expectedCheckChar === gstin[14];
};

/**
 * Safely parses a JSON string, returning null if it's invalid or empty.
 * @param {string | null | undefined} str - The string to parse.
 * @returns {any} - The parsed JSON object, or null.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const tryParseJSON = (str: string | null | undefined): any => {
	if (!str) return null;
	try {
		return JSON.parse(str);
	} catch {
		return null;
	}
};
