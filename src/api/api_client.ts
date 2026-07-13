import axios, { AxiosError, AxiosHeaders, AxiosInstance, CreateAxiosDefaults } from 'axios';
import { store } from 'store';
import { userLogout } from 'store/slices/login_slice';
import { TRefreshTokenRequest } from 'types/api_request_data_models';
import { AsyncStorageKeys, ReadDataFromAsyncStorage } from 'utilities/async_storage_utils';
import {
	getFormattedIntercepterRequestLog,
	getFormattedIntercepterResponseLog,
	showAlert,
} from 'utilities/utils';
import { REFRESH_TOKEN } from './end_points';

const axiosConfig: CreateAxiosDefaults = {
	timeout: 60000,
	headers: {
		accept: 'application/json',
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
	},
};

let refreshApiCalled = false;

export const refreshAccessTokenFn = async () => {
	try {
		if (!refreshApiCalled) {
			refreshApiCalled = true;
			const refreshToken = await ReadDataFromAsyncStorage(AsyncStorageKeys.REFRESH_TOKEN);
			const request: TRefreshTokenRequest = {
				refreshToken: refreshToken ?? '',
			};

			// const response = await axiosInstance(BASE_URL).post(REFRESH_TOKEN, request);
			// await SaveDataToAsyncStorage(
			// 	AsyncStorageKeys.REFRESH_TOKEN,
			// 	response?.data?.refreshTokenData?.refreshToken ?? '',
			// );
			// await SaveDataToAsyncStorage(
			// 	AsyncStorageKeys.USER_TOKEN,
			// 	response?.data?.refreshTokenData?.token ?? '',
			// );
		}
	} catch (error) {
		refreshApiCalled = false;
	}
};

export const axiosInstance = (baseURL: string) => {
	const instance = axios.create({ baseURL, ...axiosConfig });
	// Apply common interceptors
	applyApiInterceptors(instance);
	return instance;
};

// common method for interceptors for different base URLs.
const applyApiInterceptors = (instance: AxiosInstance) => {
	instance.interceptors.response.use(
		(response) => {
			getFormattedIntercepterResponseLog(response);
			return response;
		},
		async (error) => {
			if (error instanceof AxiosError) {
				console.info(
					'API_ERROR_RESPONSE ===> ',
					JSON.stringify(error?.response?.data ?? ''),
				);
				console.info(
					'API_ERRORS ===> ',
					JSON.stringify(error?.response?.data?.errors ?? ''),
				);
			}
			const originalRequest = error.config;
			const errorCode = error.response.status;
			if (
				errorCode === 401 &&
				!originalRequest._retry
				// &&
				// (originalRequest?.url ?? '') !== REFRESH_TOKEN
			) {
				originalRequest._retry = true;
				await refreshAccessTokenFn();
				return axiosInstance(originalRequest);
			}
			if (
				[401, 404].includes(errorCode)
				// && (originalRequest?.url ?? '') === REFRESH_TOKEN
			) {
				// make user logout in case refresh token api provides error.
				store.dispatch(userLogout());
				showAlert('Session Expired! Please login again.', 'error');
			}
			return Promise.reject(error);
		},
	);

	instance.interceptors.request.use(async (config) => {
		const accessToken = await ReadDataFromAsyncStorage(AsyncStorageKeys.USER_TOKEN);
		if (
			[
				REFRESH_TOKEN,
				// , SEND_OTP, VERIFY_OTP_AND_LOGIN
			].includes(config.url || '')
		) {
			// in case of refresh token or otp related apis do not send token in header
			const axiosHeaders = new AxiosHeaders();
			config.headers = axiosHeaders;
		} else {
			if (!config.headers) {
				const axiosHeaders = new AxiosHeaders();
				config.headers = axiosHeaders;
			}
			if (accessToken) {
				config.headers.Authorization = `Bearer ${accessToken}`;
			}
		}
		getFormattedIntercepterRequestLog(config);
		return config;
	});
};
