import { NotificationData } from './notification_handler';

let initialNotificationData: NotificationData | null = null;

export const setNotificationData = (data: NotificationData | null) => {
	initialNotificationData = data;
};

export const getNotificationData = (): NotificationData | null => {
	const data = initialNotificationData;
	initialNotificationData = null; // clear it after use
	return data;
};
