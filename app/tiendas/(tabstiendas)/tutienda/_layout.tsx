import { Stack } from "expo-router";
import { SessionProvider } from "../../../../ctx";


export default function TuTiendaLayout() {

    return (

        <SessionProvider>
            <Stack>
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="register" options={{ headerShown: false }} />
                <Stack.Screen name="recuperar" options={{ headerShown: false }} />
                <Stack.Screen name="activa" options={{ headerShown: false }} />
                <Stack.Screen name="activareenviar" options={{ headerShown: false }} />
                <Stack.Screen name="latienda" options={{ headerShown: false }} />
            </Stack>
        </SessionProvider>
    );
}