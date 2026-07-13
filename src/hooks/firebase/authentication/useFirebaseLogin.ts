import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { TFormData } from 'screens/authentication/login';
import { userLogin } from 'store/slices/login_slice';
import {
	TValidateLoginDetailData,
	TValidateLoginDetailResponse,
} from 'types/api_response_data_models';
import { showToast } from 'utilities/utils';

export const useFirebaseLogin = (isConnected: boolean | null) => {
	const [isLoginLoading, setIsLoginLoading] = React.useState<boolean>(false);
	const dispatch = useDispatch();

	const firebaseLogin: SubmitHandler<TFormData> = async (values) => {
		setIsLoginLoading(true);
		try {
			if (isConnected) {
				try {
					const res = await auth().signInWithEmailAndPassword(
						values.email,
						values.password,
					);
					const token = (await res.user?.getIdToken()) ?? '';
					const providerId = res.additionalUserInfo?.providerId ?? '';

					const data: TValidateLoginDetailData = {
						userId: res.user.uid,
						userEmail: values.email,
						userPassword: values.password,
						token: token,
						providerId: providerId,
					};

					const response: TValidateLoginDetailResponse = {
						success: true,
						message: 'Login successfully!',
						responseData: data,
					};
					if (isConnected) {
						dispatch(userLogin(response));
						showToast(response.message, 'success');
					} else
						return showToast(
							'No internet available! Please check your internet connection.',
							'danger',
						);

					const isUserPresent = await firestore()
						.collection('Users')
						.where('email', '==', values?.email ?? '')
						.get();
					const isPassword = isUserPresent.docs[0].data().password;
					if (isPassword === '') showToast('Login with google.', 'danger');
				} catch (error) {
					console.error(error);
				}
			}
		} catch (error: any) {
			if (error.code === 'auth/invalid-email') {
				showToast('The email address is badly formatted!', 'danger');
			} else if (error.code === 'auth/invalid-credential') {
				showToast('Invalid credentials!', 'danger');
			} else if (error.code === 'auth/too-many-requests') {
				showToast(
					'We have blocked all requests from this device due to unusual activity. Try again later.',
					'danger',
				);
			}
		} finally {
			setIsLoginLoading(false);
		}
	};

	return { isLoginLoading, firebaseLogin };
};
