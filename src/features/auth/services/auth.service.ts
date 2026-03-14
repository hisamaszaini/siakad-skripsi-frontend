'use server';

import { cookies } from 'next/headers';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1';

interface LoginResponse {
    error: boolean;
    message: string;
    data: {
        user: {
            id: string;
            nama: string;
            role: string;
        };
        token: string;
    };
}

export async function loginAction(params: { role: string; userId: string; password: string }) {
    try {
        const { role, userId, password } = params;

        let endpoint = `${API_URL}/auth/login`;
        const payload: Record<string, string> = { password };

        if (role === 'STUDENT') {
            endpoint = `${API_URL}/auth/login/mhs`;
            payload.nim = userId;
        } else if (role === 'LECTURER') {
            endpoint = `${API_URL}/auth/login/dosen`;
            payload.nik = userId;
        } else {
            endpoint = `${API_URL}/auth/login/akademik`;
            payload.nik = userId;
        }

        const response = await axios.post<LoginResponse>(endpoint, payload, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000
        });

        const { token, user } = response.data.data;

        const cookieStore = await cookies();

        cookieStore.set({
            name: 'auth_token',
            value: token,
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24,
            path: '/',
        });

        cookieStore.set({
            name: 'session_token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24,
            path: '/',
        });

        cookieStore.set({
            name: 'user_data',
            value: JSON.stringify(user),
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24,
            path: '/',
        });

        return { success: true, user };
    } catch (error) {
        const err = error as { response?: { data?: { message?: string } }; message: string };
        console.error('Login action error:', err.response?.data || err.message);
        return {
            success: false,
            error: err.response?.data?.message || 'Login gagal. Terjadi kesalahan server.'
        };
    }
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');
    cookieStore.delete('session_token');
    cookieStore.delete('user_data');
}
