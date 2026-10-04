import { encontrarunatienda } from "@/api/tienda";
import { router, useGlobalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, Text, ToastAndroid, View } from "react-native";

interface Tienda {
    id: number;
    idUser: number;
    nombretienda: string;
    telefono: string;
    correo: string;
    direccion: string;
    logo: string;
    activado: number;
}

export default function Inicio() {

    const { idtienda } = useGlobalSearchParams<{ idtienda: string }>();

    useEffect(() => {
        if (idtienda) {
            encontrarTienda(Number(idtienda));
        }
    }, [idtienda]);


    const encontrarTienda = async (id: number) => {
        const response = await encontrarunatienda(id);
        if (response.status !== "error") {
            ToastAndroid.show("Tienda encontrada exitosamente", ToastAndroid.LONG);
            linkatienda({
                id: response.id,
                idUser: response.idUser,
                nombretienda: response.nombretienda,
                telefono: response.telefono,
                correo: response.correo,
                direccion: response.direccion,
                logo: response.logo,
                activado: response.activado,
            });
        } else {
            ToastAndroid.show("Error = " + response.message, ToastAndroid.LONG);
        }
    }

    const linkatienda = (item: Tienda) => {

        if (!item.activado) {
            ToastAndroid.show("La tienda no esta activada", ToastAndroid.LONG);
            router.replace("/tiendas/(tabstiendas)/buscar");
        } else {
            router.replace({
                pathname: "/tiendas/(tabstiendas)/unatienda",
                params: {
                    id: item.id,
                    iduser: item.idUser,
                    nombretienda: item.nombretienda,
                    telefono: item.telefono,
                    correo: item.correo,
                    direccion: item.direccion,
                    logo: item.logo,
                    activado: item.activado,
                }
            });
        }
    }

    return (
        <View style={styles.container}>
            <Image
                source={require('../../../assets/logoplm.jpeg')}
                style={styles.imagen}
            />
            <View style={styles.separator} />
            <Text style={styles.text}>TuTiendaVerLM</Text>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,                  // Ocupa todo el espacio de la pantalla
        justifyContent: 'center', // Centra la imagen verticalmente
        alignItems: 'center',     // Centra la imagen horizontalmente
        backgroundColor: '#fff',  // Opcional: fondo blanco
    },
    imagen: {
        width: 300,
        height: 300,
        padding: 10,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop: 10,
        fontStyle: 'italic',
    },
    separator: {
        marginVertical: 10,
        height: 1,
        width: '80%',
    },
});