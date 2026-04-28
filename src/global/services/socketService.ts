import Echo from 'laravel-echo';
import Pusher from 'pusher-js/react-native';
import { BACKEND_API_URL } from '@env';

// @ts-ignore
global.Pusher = Pusher.Pusher || Pusher;

const host = BACKEND_API_URL.split('/api')[0].replace('https://', '').replace('http://', '');

let echoInstance: Echo<any> | null = null;

export function initializeEcho(token?: string | null): Echo<any> {
    if (echoInstance) {
        echoInstance.disconnect();
    }

    echoInstance = new Echo({
        broadcaster: 'reverb',
        key: 'local',
        wsHost: host,
        wsPort: 443,
        wssPort: 443,
        forceTLS: true,
        enabledTransports: ['ws', 'wss'],
        authEndpoint: `${BACKEND_API_URL.split('/api')[0]}/broadcasting/auth`,
        auth: {
            headers: {
                Authorization: token ? `Bearer ${token}` : '',
                Accept: 'application/json',
            },
        },
    });

    return echoInstance;
}

export function getEcho(): Echo<any> | null {
    return echoInstance;
}
