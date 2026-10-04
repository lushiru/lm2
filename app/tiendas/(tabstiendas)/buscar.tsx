
import { buscarTienda } from "@/api/tienda";
import { router } from "expo-router";
import { useFormik } from "formik";
import { useState } from "react";
import { Button, Pressable, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, View } from "react-native";
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

                <TextInput
                    style={styles.input}
                    placeholder="Nombre de la tienda"
                    value={formik.values.nombretienda}
                    onChangeText={(text) => formik.setFieldValue("nombretienda", text)}
                    keyboardType="default"
                />
                {formik.touched.nombretienda && formik.errors.nombretienda ? (
                    <Text>{formik.errors.nombretienda}</Text>
                ) : null}
                <Button title="Buscar tienda" disabled={formik.isSubmitting} onPress={() => formik.handleSubmit()} color="#e74b1cff" />
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
                            <View style={{ height: 10 }} />
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
    },
    title: {
        fontSize: 20,
        textAlign: "center",
        fontWeight: 'bold',
        marginBottom: 20,
        paddingTop: 40,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    link: {
        fontSize: 18,
        color: "blue",
        textDecorationLine: "underline",
    },
});