import { router } from "expo-router";
import * as SecureStore from 'expo-secure-store';

export default async function errores(error: any) {

    if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        //console.log('Datos del error:', error.response.data);
        //console.log('Código de estado:', error.response.status);

        switch (error.response.status) {
            case 401:
                await SecureStore.deleteItemAsync('session');
                router.replace('/tiendas/(tabstiendas)/tutienda/login');
                return { message: "Inicie session otra vez...", status: "error" }

            case 403:
                await SecureStore.deleteItemAsync('session');
                router.replace('/tiendas/(tabstiendas)/tutienda/login');
                return { message: "Tu cuenta esta desactivada...", status: "error" }

            case 429:
                await SecureStore.deleteItemAsync('session');
                router.replace('/tiendas/buscar');
                return { message: "Demasiadas peticiones, espere un momento", status: "error" }
            default:
                return { message: error.response.data.message, status: "error" }

        }

    } else {
        // Error en la configuración de la solicitud o problemas de red
        return { message: error.message, status: "error" }
    }
}