'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { auth } from './Firebase';
import { setPersistence, browserSessionPersistence } from 'firebase/auth';

interface User {
    username: string;
    profilePicture: string;
    photoURL: string;
    uid: string;
    email?: string | null;
    displayName?: string | null;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Set session persistence for the current tab
        setPersistence(auth, browserSessionPersistence)
            .then(() => {
                // Once persistence is set, add the auth state listener
                const unsubscribe = auth.onAuthStateChanged((user) => {
                    if (user) {
                        setUser(user as unknown as User);
                    } else {
                        setUser(null);
                    }
                    setLoading(false);
                });
                return unsubscribe;
            })
            .catch((error) => {
                console.error("Failed to set persistence:", error);
                setLoading(false);
            });
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
