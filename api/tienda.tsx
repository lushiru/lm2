import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import errores from "./errores";

interface TiendaFavorita {
    idtienda: number;
    iduser: number;
    nombretienda: string;
    telefono: string;
    correo: string;
    direccion: string;
    logo: string;
}

export async function buscarTienda(nombretienda: string) {
    const url = `${process.env.EXPO_PUBLIC_API_URL}tienda`;

    try {

        const resultado = await axios.get(url,
            {
                params: {
                    nombretienda
                },
                headers: {
                    "Content-Type": "application/json",
                    //"Authorization": `Bearer ${token}`,
                }
            }
        );
        return resultado.data

    } catch (error: unknown) {
        return errores(error);
    }
}

export async function encontrarunatienda(id: number) {
    const url = `${process.env.EXPO_PUBLIC_API_URL}tienda/${id}`;
    try {
        const resultado = await axios.get(url,
            {
                headers: {
                    "Content-Type": "application/json",
                }
            }
        );
        return resultado.data
    } catch (error: unknown) {
        return errores(error);
    }
}


export async function listaproductostienda(iduser: number, query: string) {
    const url = `${process.env.EXPO_PUBLIC_API_URL}tienda/productos?${query}`;

    try {

        const resultado = await axios.get(url,
            {
                params: {
                    idUser: iduser
                },
                headers: {
                    "Content-Type": "application/json",
                }
            }
        );
        return resultado.data

    } catch (error: unknown) {
        return errores(error);
    }
}

export async function agregarafavoritos(idtienda: number, iduser: number, nombretienda: string, logo: string, telefono: string, correo: string, direccion: string) {
    const favoritos = await SecureStore.getItemAsync('favoritos')



    const item = {
        idtienda: idtienda,
        iduser: iduser,
        nombretienda: nombretienda,
        logo: logo,
        telefono: telefono,
        correo: correo,
        direccion: direccion,
    }
    const favoritosArray: TiendaFavorita[] = favoritos ? JSON.parse(favoritos) : [];

    // Opcional: Validar si la tienda ya existe para evitar duplicados
    const yaExiste = favoritosArray.some(fav => fav.iduser === iduser);
    if (yaExiste) {
        return true;
    }
    favoritosArray.push(item);
    await SecureStore.setItemAsync('favoritos', JSON.stringify(favoritosArray));
    return true;

}


export async function eliminarafavoritos(iduser: number) {
    const favoritos = await SecureStore.getItemAsync('favoritos')

    if (!favoritos) {
        return true;
    }

    // 2. Parsear el string a un array de objetos
    const favoritosArray: TiendaFavorita[] = JSON.parse(favoritos);

    // 3. Filtrar el array para EXCLUIR la tienda con el ID recibido
    const arrayActualizado = favoritosArray.filter(tienda => tienda.iduser !== iduser);

    // 4. Guardar el nuevo array filtrado en SecureStore
    await SecureStore.setItemAsync('favoritos', JSON.stringify(arrayActualizado));
    return true;

}


export async function verFavoritos() {
    const favoritos = await SecureStore.getItemAsync('favoritos')
    if (favoritos) {
        const array: TiendaFavorita[] = JSON.parse(favoritos);
        return array;
    }
    return [];
}

export async function eliminarsession() {
    await SecureStore.deleteItemAsync('favoritos');
}

export async function esFavoritoes(iduser: number) {
    const favoritos = await SecureStore.getItemAsync('favoritos')
    if (favoritos) {
        const array: TiendaFavorita[] = JSON.parse(favoritos);
        return array.some(tienda => tienda.iduser === iduser);

    }
    return false;
}

export async function reportar(idproducto: number, idusuario: number, motivo: string) {
    const url = `${process.env.EXPO_PUBLIC_API_URL}tienda/reportar`;
    try {
        const resultado = await axios.post(url,
            {
                idproducto,
                idusuario,
                motivo,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                }
            }
        );
        return resultado.data
    } catch (error: unknown) {
        return errores(error);
    }
}