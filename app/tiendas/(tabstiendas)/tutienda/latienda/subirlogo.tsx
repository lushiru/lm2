import { eliminarLogo, iduserencontrar, subirLogo } from '@/api/producto';

import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { router, useGlobalSearchParams, useIsFocused } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, Image, StyleSheet, Text, ToastAndroid, View } from 'react-native';

export default function SubirLogo() {

    const { logo } = useGlobalSearchParams();
    const [image, setImage] = useState<string | null>(null);
    const [base64, setBase64] = useState<string | null>(null);

    const [rutaimagen, setRutaimagen] = useState<string | null>(null);

    const isFocused = useIsFocused();

    useEffect(() => {
        setImage(null);
        setBase64(null);
        buscariduser();
    }, [isFocused]);

    const buscariduser = async () => {
        const iduser = await iduserencontrar();
        setRutaimagen(`${process.env.EXPO_PUBLIC_PAGINA}uploads/${iduser}/`);
    }

    const pickAndCropImage = async () => {
        // 1. Pedir permisos y abrir la galería
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.status !== 'granted') {
            Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true, // Habilita la edición básica
            aspect: [1, 1], // Forzamos un formato cuadrado (ajusta si lo prefieres)
            quality: 1,
        });

        if (!result.canceled) {
            const selectedUri = result.assets[0].uri;

            // 2. Recortar la imagen con ImageManipulator
            try {
                const manipResult = await ImageManipulator.manipulateAsync(
                    selectedUri,
                    [
                        { resize: { width: 300 } },
                        { crop: { originX: 0, originY: 0, width: 300, height: 300 } }], // Reemplaza por las medidas que necesites
                    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
                );
                setImage(manipResult.uri);

                const base64String = await FileSystem.readAsStringAsync(manipResult.uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });

                // 3. Retorna la cadena completa lista para enviarse en un JSON (ej. API/backend)
                setBase64(`data:image/jpeg;base64,${base64String}`);


            } catch (error) {
                console.error('Error al recortar la imagen', error);
            }
        }
    };

    const uploadLogo = async () => {
        if (!base64) {
            Alert.alert('Error', 'Primero debes seleccionar y recortar una imagen.');
            return;
        }

        const resultado = await subirLogo(base64);

        if (resultado.status !== "error") {
            ToastAndroid.show("Exito = " + resultado.message, ToastAndroid.LONG);
            router.replace("./opciones");
        } else {
            ToastAndroid.show("Error = " + resultado.message, ToastAndroid.LONG);
            router.replace("./opciones");
        }


    };

    const EliminarLogo = async () => {

        return Alert.alert(
            "Are your sure?",
            "Estas seguro de eliminar el Logo?",
            [
                // The "Yes" button
                {
                    text: "Si",
                    onPress: async () => {
                        try {
                            const resultado = await eliminarLogo();

                            if (resultado.status !== "error") {
                                ToastAndroid.show("Exito = " + resultado.message, ToastAndroid.LONG);
                                router.replace("./opciones");
                            } else {
                                ToastAndroid.show("Error = " + resultado.message, ToastAndroid.LONG);
                                router.replace("./opciones");
                            }

                        } catch (error) {
                            console.log(error);
                        }
                    },
                },
                // The "No" button
                // Does nothing but dismiss the dialog when tapped
                {
                    text: "No",
                },
            ]
        );
    };

    if (!logo) {
        return <Text>Loading logo...</Text>;
    }

    return (
        logo == "sinlogo.jpeg" ? (
            <View style={styles.container}>
                <Text>Imagen</Text>
                {image && <Image source={{ uri: image }} style={styles.image} />}
                <Button title="Seleccionar y Recortar Imagen" onPress={pickAndCropImage} />
                {image && <Button title="Subir Logo" onPress={uploadLogo} color="green" />}
                <View style={{ height: 10 }} />
                <Button title="Volver" onPress={() => router.replace("./opciones")} />
            </View>
        ) : (
            <View style={styles.container}>
                {rutaimagen && <Image source={{ uri: rutaimagen + logo }} style={styles.image} />}
                <Button title="Eliminar Logo" onPress={EliminarLogo} color="red" />
                <View style={{ height: 10 }} />
                <Button title="Volver" onPress={() => router.replace("./opciones")} />
            </View>
        )
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 300,
        height: 300,
        marginBottom: 20,
        borderRadius: 10,
    },
});
