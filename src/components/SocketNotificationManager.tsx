import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { initializeEcho } from '@/global/services/socketService';
import { rtkBaseApi } from '@/api/fetchers/rtkBaseApi';

export function SocketNotificationManager(): React.ReactNode {
    const dispatch = useDispatch();
    const token = useSelector((state: RootState) => state.auth.token);
    const userId = useSelector((state: RootState) => state.auth.user?.id);

    useEffect(() => {
        if (!token || !userId) return;

        const echo = initializeEcho(token);

        console.log(`Socket initialized for user ${userId}`);
        
        const channel = echo.private(`App.Models.User.${userId}`);

        channel.subscribed(() => {
            console.log(`Subscribed to App.Models.User.${userId}`);
        });

        channel.error((error: any) => {
            console.error('Socket subscription error:', error);
        });

        channel.notification((notification: any) => {
            console.log('New notification received via socket ping:', notification);
            // Invalidate tags to trigger the REST API refresh
            dispatch(rtkBaseApi.util.invalidateTags(['Notifications']));
        });

        return () => {
            echo.disconnect();
        };
    }, [token, userId, dispatch]);

    return null;
}
