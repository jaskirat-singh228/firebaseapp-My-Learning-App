import { TApiSuccessResponse } from 'types/api_response_data_models';
import { axiosInstance } from './api_client';
import { BASE_URL } from './base_url';
import { SAVE_USER_FCM_TOKEN } from './end_points';

const axiosApiInstance = axiosInstance(BASE_URL);

export const saveUserFCMToken = async (FCMToken: string) => {
	const response = await axiosApiInstance.post<TApiSuccessResponse>(SAVE_USER_FCM_TOKEN, {
		FCMToken,
	});
	return response.data;
};
