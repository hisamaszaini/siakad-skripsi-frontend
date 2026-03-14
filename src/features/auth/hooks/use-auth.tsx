"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { logoutAction } from "../services/auth.service";

interface User {
    id: string;
    nama: string;
    nim?: string;
    nik?: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => void;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        function checkAuth() {
            try {
                const cookies = document.cookie.split('; ');
                const tokenCookie = cookies.find(row => row.startsWith('auth_token='));
                const token = tokenCookie ? tokenCookie.split('=')[1] : null;

                if (token) {
                    const userData = localStorage.getItem("user_data");
                    if (userData) {
                        setUser(JSON.parse(userData));
                    }
                }
            } catch (error) {
                console.error(error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        checkAuth();
    }, []);

    const logout = async () => {
        await logoutAction();
        localStorage.removeItem("user_data");
        setUser(null);
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
