import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import errores from "./errores";

export const login = async (email: string, password: string) => {

    const url = `${process.env.EXPO_PUBLIC_API_URL}auth/login`;

    try {

        const resultado = await axios.post(url, {
            email,
            password,
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        })
        return resultado.data

    } catch (error: unknown) {
        return errores(error);
    }

}

export const profile = async () => {

    const url = `${process.env.EXPO_PUBLIC_API_URL}auth/profile`;

    const token = await SecureStore.getItemAsync('session')

    try {

        const resultado = await axios.get(url, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        })
        return resultado.data

    } catch (error: unknown) {
        return errores(error);
    }

}

export const crearcuenta = async (nombre: string, email: string, password: string) => {

    const url = `${process.env.EXPO_PUBLIC_API_URL}auth/createin`;

    try {

        const resultado = await axios.post(url, {
            nombre,
            email,
            password,
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        })
        return resultado.data

    } catch (error: unknown) {
        return errores(error);
    }

}

export const activarcuenta = async (email: string, codigo: number) => {

    const url = `${process.env.EXPO_PUBLIC_API_URL}auth/verificar`;

    try {

        const resultado = await axios.post(url, {
            email,
            codigo,
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        })
        return resultado.data

    } catch (error: unknown) {
        return errores(error);
    }

}

export const activaReenviar = async (email: string) => {

    const url = `${process.env.EXPO_PUBLIC_API_URL}auth/reenviaractivacion`;

    try {

        const resultado = await axios.post(url, {
            email,
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        })
        return resultado.data

    } catch (error: unknown) {
        return errores(error);
    }

}

export const recuperarPass = async (email: string) => {

    const url = `${process.env.EXPO_PUBLIC_API_URL}auth/recuperarpass`;

    try {

        const resultado = await axios.post(url, {
            email,
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        })
        return resultado.data

    } catch (error: unknown) {
        return errores(error);
    }

}

export const cambiarPass = async (email: string, codigo: number, password: string) => {

    const url = `${process.env.EXPO_PUBLIC_API_URL}auth/cambiarpass`;

    try {

        const resultado = await axios.post(url, {
            email,
            codigo,
            password,
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        })
        return resultado.data

    } catch (error: unknown) {
        return errores(error);
    }

}
