"use client";

import axios from 'axios';
import { sessionManager } from './session-manager';
import { logoutAction } from '@/features/auth/services/auth.service';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000/v1',
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    // Prevent API calls if session is expired or logging out
    if (sessionManager.shouldPreventAPICall()) {
        return Promise.reject(new Error('Session expired'));
    }

    if (typeof window !== 'undefined') {
        const cookies = document.cookie.split('; ');
        const tokenCookie = cookies.find(row => row.startsWith('auth_token='));
        const token = tokenCookie ? tokenCookie.split('=')[1] : null;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined' && !sessionManager.isCurrentlyLoggingOut) {
                sessionManager.startLogout();

                try {
                    // This clears both HttpOnly and regular cookies
                    await logoutAction();
                } catch (e) {
                    console.error("Failed to clear session on 401", e);
                }

                localStorage.removeItem("user_data");
                window.location.href = '/login/mahasiswa';

                // Return a pending promise to prevent further component updates during redirect
                return new Promise(() => { });
            }
        }
        return Promise.reject(error);
    }
);

export default api;
