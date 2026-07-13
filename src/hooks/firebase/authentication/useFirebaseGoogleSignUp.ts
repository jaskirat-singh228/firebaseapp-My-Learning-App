import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { FirebaseError } from 'firebase/app';
import React from 'react';
import { useDispatch } from 'react-redux';
import { userLogin } from 'store/slices/login_slice';
import {
	TValidateLoginDetailData,
	TValidateLoginDetailResponse,
} from 'types/api_response_data_models';
import { showToast } from 'utilities/utils';

export const useFirebaseGoogleSignIn = (isConnected: boolean | null) => {
	const [isGoogleSignInLoading, setIsGoogleSignInLoading] = React.useState<boolean>(false);
	const dispatch = useDispatch();

	const signInWithGoogle = async () => {
		if (isGoogleSignInLoading) return;
		setIsGoogleSignInLoading(true);
		try {
			if (isConnected) {
				// Login with Google
				await GoogleSignin.hasPlayServices();
				const { data, type } = await GoogleSignin.signIn();
				const idToken = data?.idToken ?? null;

				// Create a Firebase credential with the token
				const googleCredential = auth.GoogleAuthProvider.credential(idToken);
				// Sign-in the user with the credential
				setIsGoogleSignInLoading(true);
				const userCredential = await auth().signInWithCredential(googleCredential);
				const token = (await userCredential.user.getIdToken()) ?? '';
				const userId = userCredential.user.uid;

				await firestore().collection('Users').doc(userId).set({
					userId: userId,
					email: userCredential.user.email,
					password: '',
					token: token,
					providerId: userCredential.additionalUserInfo?.providerId,
					createdAt: firestore.FieldValue.serverTimestamp(),
				});

				const responseData: TValidateLoginDetailData = {
					userId: userCredential.user.uid,
					userEmail: userCredential.user.email ?? '',
					token: token,
					providerId: userCredential.user.providerId,
				};

				const response: TValidateLoginDetailResponse = {
					success: true,
					message: 'Login successful!',
					responseData,
				};
				if (type === 'success') {
					dispatch(userLogin(response));
					showToast(response.message, 'success');
				} else return;
			} else {
				return showToast(
					'No internet available! Please check your internet connection.',
					'danger',
				);
			}
		} catch (error) {
			if (error instanceof FirebaseError) {
				if (error.code === 'auth/internal-error') return;
				else {
					console.error('Unknown error:', error);
				}
			} else {
				console.error('Unknown error:', error);
			}
		} finally {
			setIsGoogleSignInLoading(false);
		}
	};
	return { isGoogleSignInLoading, signInWithGoogle };
};
