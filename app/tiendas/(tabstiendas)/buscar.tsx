
import { buscarTienda } from "@/api/tienda";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useFormik } from "formik";
import { useState } from "react";
import { Button, Pressable, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";

export function initialValues() {
    return {
        nombretienda: "",
    };
}

export function validationSchema() {
    return Yup.object({
        nombretienda: Yup.string().min(2, "Nombre de la tienda debe tener al menos 2 caracteres").required("Nombre de la tienda es requerido"),
    });
}

interface BuscarData {
    nombretienda: string;
}

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

export default function Buscar() {

    const [tienda, setTienda] = useState<Tienda[]>([]);
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: initialValues(),
        validationSchema: validationSchema(),
        validateOnChange: false,
        onSubmit: async (formValue: BuscarData) => {
            try {
                const { nombretienda } = formValue;
                const response = await buscarTienda(nombretienda);
                if (response.status !== "error") {
                    setLoading(true)
                    setTienda(response);
                    ToastAndroid.show("Tienda encontrada exitosamente", ToastAndroid.LONG);
                } else {
                    setLoading(false)
                    ToastAndroid.show("Error = " + response.message, ToastAndroid.LONG);
                }
            } catch (error) {
                ToastAndroid.show("Error = " + error, ToastAndroid.LONG);
            }
        },
    });


    const linkatienda = (item: Tienda) => {
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
            }
        });
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.title}>Encuentra tu tienda</Text>
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre de la tienda"
                        value={formik.values.nombretienda}
                        onChangeText={(text) => formik.setFieldValue("nombretienda", text)}
                        keyboardType="default"
                    />
                </View>
                {formik.touched.nombretienda && formik.errors.nombretienda ? (
                    <Text>{formik.errors.nombretienda}</Text>
                ) : null}
                <TouchableOpacity style={styles.buttonBuscar} activeOpacity={0.8} onPress={() => formik.handleSubmit()} disabled={formik.isSubmitting}>
                    <Text style={styles.buttonText}>Buscar Tienda</Text>
                </TouchableOpacity>
                <View style={{ height: 30 }} />
                {!loading ? (
                    <Text>Busca tu tienda... </Text>
                ) : (
                    tienda.map((item, index) => (
                        <View key={index}>
                            <Pressable
                                onPress={() => { linkatienda(item) }}
                            >
                                <Text style={styles.link}>{item.nombretienda}</Text>
                            </Pressable>
                            <View style={{ height: 20 }} />
                        </View>
                    ))
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#F8F9FA',
    },
    title: {
        fontSize: 20,
        textAlign: "center",
        fontWeight: 'bold',
        marginBottom: 20,
        paddingTop: 40,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        paddingHorizontal: 14,
        height: 50,
        marginBottom: 14,
        // Sombra sutil para iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        // Sombra sutil para Android
        elevation: 2,
    },
    searchIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333333',
    },
    link: {
        fontSize: 20,
        color: "blue",
        textDecorationLine: "underline",
    },
    buttonBuscar: {
        backgroundColor: '#E64A19', // Tu color naranja con un tono ligeramente más vivo
        borderRadius: 12,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600', // Tipografía semi-bold se ve mejor que mayúsculas fijas
    },
});