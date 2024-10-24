const URL = '/api/v1/notifications/';

const NotificationService = {
    createNotification: async (axiosPrivate, userId, message = {}) => {
        try {
            const response = await axiosPrivate.post(URL, {
                user: userId,
                notification: {
                    message: message,
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
