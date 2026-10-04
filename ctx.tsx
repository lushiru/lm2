// ctx.tsx (in the root directory, outside 'app')
import { router, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    signIn: (token: string, iduser: number) => void;
    signOut: () => void;
    session: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    signIn: () => null,
    signOut: () => null,
    session: false,
    isLoading: false,
});

export function useSession() {
    const value = useContext(AuthContext);
    if (!value) {
        throw new Error('useSession must be wrapped in a SessionProvider');
    }
    return value;
}

export function SessionProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const segments = useSegments();

    useEffect(() => {
        checkSession();
    }, [segments]);



    const checkSession = async () => {


        const sessiontoken = await SecureStore.getItemAsync('session')
        if (sessiontoken) {

            //setSession(true);
            setIsLoading(false);
            //console.log(segments.indexOf('tutienda'))
            const inAuthGroup = segments.indexOf('tutienda') === 2;
            if (inAuthGroup) {
                const inLatiendaGroup = segments.indexOf('latienda') === 3;
                if (!inLatiendaGroup) {
                    router.replace('/tiendas/(tabstiendas)/tutienda/latienda/home');
                }
            }
        }

    }


    return (
        <AuthContext.Provider
            value={{
                signIn: async (token: string, iduser: number) => {
                    // Add actual sign-in logic here (API call to backend)
                    // On success, set the session and store it securely
                    setIsLoading(false);
                    const dummySession = token;
                    await SecureStore.setItemAsync('session', dummySession);
                    await SecureStore.setItemAsync('iduser', iduser.toString());
                    checkSession();
                    //router.replace('/tiendas/(tabstiendas)/tutienda/latienda/home');

                },
                signOut: async () => {
                    setIsLoading(false);
                    await SecureStore.deleteItemAsync('session');
                    router.replace('/tiendas/(tabstiendas)/tutienda/login');
                },
                session,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
