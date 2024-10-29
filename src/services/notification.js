const URL = '/api/v1/notifications/';

const NotificationService = {
    createNotification: async (axiosPrivate, userId, message = {}, extra_data = {}) => {
        console.log(extra_data);
        try {
            const response = await axiosPrivate.post(URL, {
                user: userId,
                notification: {
                    message: message,
                    extra_data: {
                        customer: extra_data,
                    }
                },
                
            });
            return response.data;
        } catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        }
    },
};

export default NotificationService;
