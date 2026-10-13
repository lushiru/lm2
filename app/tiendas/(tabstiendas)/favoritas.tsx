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
        <ScrollView contentContainerStyle={styles.containerScroll}>
            <Text style={styles.title}>Tiendas favoritas</Text>
            {favoritos && favoritos.map((item, index) => (
                <View key={index} style={styles.container}>
                    <View style={styles.headerRow}>
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
                    </View>
                    <View style={styles.card}>
                        <Image
                            source={{ uri: `${process.env.EXPO_PUBLIC_PAGINA}uploads/${item.iduser}/${item.logo}` }}
                            style={styles.image}
                            cachePolicy="disk"
                        />
                        <View style={styles.infoContainer}>
                            <Text style={styles.item2}>telefono: {item.telefono}</Text>
                            <Text style={styles.item2}>correo: {item.correo}</Text>
                            <Text style={styles.item2}>direccion: {item.direccion}</Text>
                        </View>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    containerScroll: {
        padding: 10,
        backgroundColor: "#F8F9FA",
        paddingBottom: 40,
    },
    container: {
        flex: 1,
        // Aprovecha el color gris claro de fondo que configuramos globalmente en el paso anterior
        paddingHorizontal: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        flexDirection: 'row', // Foto a la izquierda, textos a la derecha
        padding: 12,
        marginBottom: 16,
        position: 'relative',
        // Sombras nativas para dar profundidad limpia
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#F0F0F0',
    },
    infoContainer: {
        flex: 1, // Obliga al contenedor a ocupar el espacio restante sin empujar el diseño
        marginLeft: 14,
        justifyContent: 'center',
        paddingRight: 24, // Deja espacio libre para que el texto no choque con el corazón
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
    headerRow: {
        flexDirection: 'row',       // ✨ Alinea nombre y corazón en la misma línea
        justifyContent: 'space-between', // ✨ Envía el nombre a la izquierda y el corazón a la derecha
        alignItems: 'center',       // Centra verticalmente ambos elementos
        marginBottom: 14,           // Separa esta fila del contenido de abajo
    },
});