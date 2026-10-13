import { iduserencontrar } from "@/api/producto";
//import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { useEffect, useRef, useState } from "react";
import { Alert, Button, ScrollView, StyleSheet, Text, View } from "react-native";
import QRCode from 'react-native-qrcode-svg';
import ViewShot, { captureRef } from 'react-native-view-shot';

export default function Generarqr() {

    const [idtienda, setIdtienda] = useState(0);

    const viewRef = useRef<View>(null);
    const viewRef2 = useRef<View>(null);

    useEffect(() => {
        buscarid();
    }, []);

    const buscarid = async () => {
        const id = await iduserencontrar();
        setIdtienda(Number(id));
    }



    const compartirQRConTexto = async (): Promise<void> => {
        try {
            const disponible = await Sharing.isAvailableAsync();
            if (!disponible) {
                Alert.alert("Error", "Compartir no disponible");
                return;
            }

            // Validamos que el View esté cargado en pantalla
            if (!viewRef.current) {
                Alert.alert("Error", "La vista no está lista");
                return;
            }

            // Capturamos el componente pasando directamente la referencia del View
            const uriImagen: string = await captureRef(viewRef, {
                format: 'png',
                quality: 1.0,
            });

            await Sharing.shareAsync(uriImagen, {
                dialogTitle: "Compartir mi sitio",
                mimeType: "image/png",
                UTI: "public.png",
            });

        } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudo compartir.");
        }
    };

    const compartirQRConTexto2 = async (): Promise<void> => {
        try {
            const disponible = await Sharing.isAvailableAsync();
            if (!disponible) {
                Alert.alert("Error", "Compartir no disponible");
                return;
            }

            // Validamos que el View esté cargado en pantalla
            if (!viewRef2.current) {
                Alert.alert("Error", "La vista no está lista");
                return;
            }

            // Capturamos el componente pasando directamente la referencia del View
            const uriImagen: string = await captureRef(viewRef2, {
                format: 'png',
                quality: 1.0,
            });

            await Sharing.shareAsync(uriImagen, {
                dialogTitle: "Compartir mi sitio",
                mimeType: "image/png",
                UTI: "public2.png",
            });

        } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudo compartir.");
        }
    };

    return (

        idtienda !== 0 &&

        <ScrollView >

            <View
                ref={viewRef}
                collapsable={false}
                style={styles.shareContainer}
            >
                <Text style={styles.textoQr}>Es el qr a la app</Text>
                <QRCode
                    value={`tutiendaverllmm://tiendas/inicio?idtienda=${idtienda}`}
                    size={220}
                    backgroundColor="white"
                    color="#1A1A1A"
                />
                <Text style={styles.subTextoQr}>Escanea para visitarnos</Text>
            </View>
            <Button title="Compartir Imagen QR 1" onPress={compartirQRConTexto} />
            <View style={styles.separator} />
            <View
                ref={viewRef2}
                collapsable={false}
                style={styles.shareContainer}
            >
                <Text style={styles.textoQr}>Es el qr a tu tienda</Text>
                <QRCode
                    value={`tutiendaverllmm://tiendas/inicio?idtienda=${idtienda}`}
                    size={220}
                    backgroundColor="white"
                    color="#1A1A1A"
                />
                <Text style={styles.subTextoQr}>Escanea para visitarnos</Text>
            </View>
            <Button title="Compartir Imagen QR 2" onPress={compartirQRConTexto2} />
        </ScrollView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    shareContainer: {
        padding: 24,
        backgroundColor: 'white',
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
        marginBottom: 35,
    },
    textoQr: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 20,
        textAlign: 'center',
    },
    subTextoQr: {
        fontSize: 15,
        color: '#666',
        marginTop: 10,
        textAlign: 'center',
    },
    subTextoQr2: {
        fontSize: 18,
        marginTop: 10,
        textAlign: 'center',
    },
});