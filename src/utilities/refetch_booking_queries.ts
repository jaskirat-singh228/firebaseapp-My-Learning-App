import { QueryClient } from '@tanstack/react-query';

export const refetchBookingQueries = (queryClient: QueryClient) => {
	queryClient.invalidateQueries({ queryKey: ['bookedServices'] });
	queryClient.invalidateQueries({ queryKey: ['bookedSurveyList'] });
	queryClient.invalidateQueries({ queryKey: ['bookingDetail'] });
	queryClient.invalidateQueries({ queryKey: ['notifications'] });
	queryClient.invalidateQueries({ queryKey: ['bookingStatus'] });
	queryClient.invalidateQueries({ queryKey: ['staffToAssign'] });
	queryClient.invalidateQueries({ queryKey: ['totalAdvanceAmount'] });
};
