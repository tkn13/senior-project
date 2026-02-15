import { createContext, useState, useEffect } from 'react';
import React from 'react';

import type { AuthContextType } from '../model/AuthContextModel';

export const AuthContext = createContext<AuthContextType>({
    user: null,
    login: undefined,
    logout: undefined,
    isLoading: false
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {

    const [user, setUser] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        //check local storage for user data and set user state if found
        //delay to simulate loading time
        setTimeout(() => {
            const storedUser = localStorage.getItem("user");
            console.log("AuthProvider: checking local storage, found user:", storedUser);
            if(storedUser){
                setUser(storedUser);
            }
            setIsLoading(false);
        }, 3000);

    }, []);
    console.log("AuthProvider rendered, user:", user, "isLoading:", isLoading);

    async function login(username: string, password: string) {
        
        setIsLoading(true);
        // Simulate an API call to validate credentials by delaying for 1 second
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            if(password === "password"){
                setUser(username);
                localStorage.setItem("user", username);
            } else {
                throw new Error("Invalid credentials");
            }
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }

    }

    async function logout() {
        setUser(null);
        localStorage.removeItem("user");
    }

    return (
        <AuthContext.Provider value={{user, login, logout, isLoading}}>
            {children}
        </AuthContext.Provider>
    );

};