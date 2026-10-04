import { verFavoritos, eliminarafavoritos } from "@/api/tienda";
import { Ionicons } from "@expo/vector-icons";
import { router, useIsFocused } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, ToastAndroid, View } from "react-native";
import { Image } from 'expo-image';


interface TiendaFavorita {
    idtienda: number;
    iduser: number;
    nombretienda: string;
    telefono: string;
    correo: string;
    direccion: string;
    logo: string;
}

export default function Favoritas() {

    const [favoritos, setFavoritos] = useState<TiendaFavorita[]>([]);

    const isFocused = useIsFocused();

    const verfavoritos = async () => {
        const favor: TiendaFavorita[] = await verFavoritos();
        if (favor) {
            setFavoritos(favor);
        }
    }

    useEffect(() => {
        if (isFocused) {
            verfavoritos();
        }
    }, [isFocused]);

    const alternarFavorito = async (iduser: number) => {

        const response = await eliminarafavoritos(Number(iduser));
        ToastAndroid.show("Tienda eliminada de favoritos", ToastAndroid.LONG);
        verfavoritos();

    };


    return (
        <ScrollView>
            <Text style={styles.title}>Tiendas favoritas</Text>
            {favoritos && favoritos.map((item, index) => (
                <View key={index} style={styles.container}>
                    <Pressable

                        onPress={() => {
                            router.replace({
                                pathname: "/tiendas/(tabstiendas)/unatienda",
                                params: {
                                    id: item.idtienda,
                                    iduser: item.iduser,
                                    nombretienda: item.nombretienda,
                                    telefono: item.telefono,
                                    correo: item.correo,
                                    direccion: item.direccion,
                                    logo: item.logo,
                                },
                            });
                        }}
                    >
                        <Text style={styles.itemnombre}>{item.nombretienda}</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => alternarFavorito(item.iduser)}
                    >
                        <Ionicons
                            name="heart"
                            size={24}
                            color="#ff3b30"
                        />
                    </Pressable>
                    <Image
                        source={{ uri: `${process.env.EXPO_PUBLIC_PAGINA}uploads/${item.iduser}/${item.logo}` }}
                        style={styles.imagen}
                        cachePolicy="disk"
                    />
                    <Text style={styles.item2}>telefono: {item.telefono}</Text>
                    <Text style={styles.item2}>correo: {item.correo}</Text>
                    <Text style={styles.item2}>direccion: {item.direccion}</Text>

                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop: 40,
    },
    container2: {
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        padding: 20,
    },
    item: {
        padding: 20,
        fontSize: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemnombre: {
        padding: 20,
        fontSize: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        fontWeight: 'bold',
    },
    item2: {
        padding: 10,
        fontSize: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    imagen: {
        width: 120,
        height: 120,
        padding: 10,
    },
    boton: {
        padding: 10,
    },
});