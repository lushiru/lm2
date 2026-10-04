import { eliminarImagen, iduserencontrar, subirImagen } from '@/api/producto';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { router, useGlobalSearchParams, useIsFocused } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, Image, StyleSheet, Text, ToastAndroid, View } from 'react-native';

export default function Imagen() {

    const { id, imagen1, imagen2, imagen3, numero } = useGlobalSearchParams<{
        id: string,
        imagen1: string,
        imagen2: string,
        imagen3: string,
        numero: string,
    }>();

    const [rutaimagen, setRutaimagen] = useState<string | null>(null);

    const [image, setImage] = useState<string | null>(null);
    const [base64, setBase64] = useState<string | null>(null);

    const [nombreimagen, setNombreimagen] = useState<string>("");
    const [numeroimagen, setNumeroimagen] = useState<number>(0);

    useEffect(() => {
        if (id && imagen1 && imagen2 && imagen3 && numero) {
            setImage(null);
            setBase64(null);
            setNombreimagen("");
            setNumeroimagen(0);
            buscariduser();
        }
    }, [id, imagen1, imagen2, imagen3, numero]);

    const buscariduser = async () => {
        const iduser = await iduserencontrar();
        if (Number(numero) == 1) { setNombreimagen(String(imagen1)); setNumeroimagen(1); }
        else if (Number(numero) == 2) { setNombreimagen(String(imagen2)); setNumeroimagen(2); }
        else if (Number(numero) == 3) { setNombreimagen(String(imagen3)); setNumeroimagen(3); }
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
                    [{ resize: { width: 300 } }, { crop: { originX: 0, originY: 0, width: 300, height: 300 } }], // Reemplaza por las medidas que necesites
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

    const uploadImage = async () => {
        if (!base64) {
            Alert.alert('Error', 'Primero debes seleccionar y recortar una imagen.');
            return;
        }

        const resultado = await subirImagen(Number(id), base64, numeroimagen);

        if (resultado.status !== "error") {
            ToastAndroid.show("Exito = " + resultado.message, ToastAndroid.LONG);
            router.back();
        } else {
            ToastAndroid.show("Error = " + resultado.message, ToastAndroid.LONG);
            router.back();
        }


    };

    const EliminarImagen = async () => {

        return Alert.alert(
            "Are your sure?",
            "Estas seguro de eliminar la imagen?",
            [
                // The "Yes" button
                {
                    text: "Si",
                    onPress: async () => {
                        try {
                            const resultado = await eliminarImagen(Number(id), numeroimagen);

                            if (resultado.status !== "error") {
                                ToastAndroid.show("Exito = " + resultado.message, ToastAndroid.LONG);
                                router.back();
                            } else {
                                ToastAndroid.show("Error = " + resultado.message, ToastAndroid.LONG);
                                router.back();
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

    return (
        nombreimagen == "sinfoto.jpeg" ? (
            <View style={styles.container}>
                <Text>Imagen</Text>
                {image && <Image source={{ uri: image }} style={styles.image} />}
                <Button title="Seleccionar y Recortar Imagen" onPress={pickAndCropImage} />
                {image && <Button title="Subir Imagen" onPress={uploadImage} color="green" />}
            </View>
        ) : (
            <View style={styles.container}>
                {rutaimagen && <Image source={{ uri: rutaimagen + nombreimagen }} style={styles.image} />}
                <Button title="Eliminar imagen" onPress={EliminarImagen} color="red" />
                <View style={{ height: 10 }} />
                <Button title="Cancelar" onPress={() => router.back()} />
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
