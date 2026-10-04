import { router, useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";


export default function Imagenes() {

    const { id, nombreimagen1, nombreimagen2, nombreimagen3 } = useGlobalSearchParams();

    const [nombre1, setNombre1] = useState("sinfoto.jpeg");
    const [nombre2, setNombre2] = useState("sinfoto.jpeg");
    const [nombre3, setNombre3] = useState("sinfoto.jpeg");

    useEffect(() => {
        if (nombreimagen1 && nombreimagen2 && nombreimagen3) {

            setNombre1(String(nombreimagen1));
            setNombre2(String(nombreimagen2));
            setNombre3(String(nombreimagen3));
        }
    }, [nombreimagen1, nombreimagen2, nombreimagen3]);


    return (
        <View style={styles.container}>
            <Text>Imagenes del producto</Text>
            <View style={{ height: 10 }} />
            <Button title="subir imagen 1" onPress={() => router.replace({
                pathname: "./imagen",
                params: { id: id, imagen1: nombre1, imagen2: nombre2, imagen3: nombre3, numero: 1 }
            })} />
            <View style={{ height: 10 }} />
            <Button title="subir imagen 2" onPress={() => router.replace({
                pathname: "./imagen",
                params: { id: id, imagen1: nombre1, imagen2: nombre2, imagen3: nombre3, numero: 2 }
            })} />
            <View style={{ height: 10 }} />
            <Button title="subir imagen 3" onPress={() => router.replace({
                pathname: "./imagen",
                params: { id: id, imagen1: nombre1, imagen2: nombre2, imagen3: nombre3, numero: 3 }
            })} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});