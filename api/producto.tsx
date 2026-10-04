import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import errores from "./errores";

export async function iduserencontrar() {
    const iduser = await SecureStore.getItemAsync('iduser')
    return iduser
}


export async function crear(nombre: string, descripcion: string, precio: number, cantidad: number) {
    const url = `${process.env.EXPO_PUBLIC_API_URL}producto`;

    const token = await SecureStore.getItemAsync('session')

    try {

        const resultado = await axios.post(url, {
            nombre,
            descripcion,
            precio,
            cantidad,
        }, {
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

export async function listarProductos(query: string) {

    const url = `${process.env.EXPO_PUBLIC_API_URL}producto?${query}`;

    const token = await SecureStore.getItemAsync('session')

    try {

        const resultado = await axios.get(url, {
            headers: {
                //"Content-Type": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        })
        return resultado.data

    } catch (error: unknown) {
        return errores(error);
    }
}

export async function eliminarProducto(id: number) {
    const url = `${process.env.EXPO_PUBLIC_API_URL}producto/${id}`;

    const token = await SecureStore.getItemAsync('session')

    try {

        const resultado = await axios.delete(url, {
            headers: {
                //"Content-Type": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        })
        return resultado.data

    } catch (error: unknown) {
        return errores(error);
    }
}

export async function unproducto(id: number) {
    const url = `${process.env.EXPO_PUBLIC_API_URL}producto/${id}`;

    const token = await SecureStore.getItemAsync('session')

    try {

        const resultado = await axios.get(url, {
            headers: {
                //"Content-Type": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        })
        return resultado.data

    } catch (error: unknown) {
        return errores(error);
    }
}

export async function editarproducto(id: number, nombre: string, descripcion: string, precio: number, cantidad: number) {
    const url = `${process.env.EXPO_PUBLIC_API_URL}producto/${id}`;

    const token = await SecureStore.getItemAsync('session')

    try {

        const resultado = await axios.patch(url, {
            nombre,
            descripcion,
            precio,
            cantidad,
        }, {
            headers: {
                //"Content-Type": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        })
        return resultado.data

    } catch (error: unknown) {
        return errores(error);
    }
}

export async function subirImagen(id: number, imagen: string, numeroimagen: number) {

    let url = "";
    let laimegen = {};
    if (numeroimagen == 1) {
        laimegen = { imagen1: imagen };
        url = `${process.env.EXPO_PUBLIC_API_URL}producto/imagen1/${id}`;
    } else if (numeroimagen == 2) {
        laimegen = { imagen2: imagen };
        url = `${process.env.EXPO_PUBLIC_API_URL}producto/imagen2/${id}`;
    } else if (numeroimagen == 3) {
        laimegen = { imagen3: imagen };
        url = `${process.env.EXPO_PUBLIC_API_URL}producto/imagen3/${id}`;
    } else {
        return { status: "error", message: "Numero de imagen no valido" };
    }

    const token = await SecureStore.getItemAsync('session')

    try {

        const resultado = await axios.patch(url, laimegen, {
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

export async function eliminarImagen(id: number, numeroimagen: number) {
    let url = "";

    if (numeroimagen == 1) {
        url = `${process.env.EXPO_PUBLIC_API_URL}producto/imagen1/${id}`;
    } else if (numeroimagen == 2) {
        url = `${process.env.EXPO_PUBLIC_API_URL}producto/imagen2/${id}`;
    } else if (numeroimagen == 3) {
        url = `${process.env.EXPO_PUBLIC_API_URL}producto/imagen3/${id}`;
    } else {
        return { status: "error", message: "Numero de imagen no valido" };
    }

    const token = await SecureStore.getItemAsync('session')

    try {

        const resultado = await axios.delete(url, {
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

export async function guardaropciones(rut: string, nombretienda: string, telefono: string, correo: string, direccion: string) {
    const url = `${process.env.EXPO_PUBLIC_API_URL}opciones`;

    const token = await SecureStore.getItemAsync('session')

    try {

        const resultado = await axios.post(url, {
            rut,
            nombretienda,
            telefono,
            correo,
            direccion,
        }, {
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


export async function buscaropciones() {
    const url = `${process.env.EXPO_PUBLIC_API_URL}opciones`;

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

export async function obtenerLogo() {
    const url = `${process.env.EXPO_PUBLIC_API_URL}opciones/logo`;

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

export async function subirLogo(logo: string) {
    const url = `${process.env.EXPO_PUBLIC_API_URL}opciones/logo`;

    const token = await SecureStore.getItemAsync('session')

    try {

        const resultado = await axios.patch(url, {
            logo,
        }, {
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

export async function eliminarLogo() {
    const url = `${process.env.EXPO_PUBLIC_API_URL}opciones/logo`;

    const token = await SecureStore.getItemAsync('session')

    try {

        const resultado = await axios.delete(url, {
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

export async function activacion() {
    const url = `${process.env.EXPO_PUBLIC_API_URL}opciones/activado`;

    const token = await SecureStore.getItemAsync('session')

    try {

        const resultado = await axios.patch(url, {
            activado: true,
        }, {
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






