import { activacion, buscaropciones, guardaropciones } from "@/api/producto";

import { router, useIsFocused } from "expo-router";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Button, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, ToastAndroid, View } from "react-native";
import * as Yup from "yup";

export function initialValues() {
    return {
        rut: "",
        nombretienda: "",
        telefono: "",
        correo: "",
        direccion: "",
    };
}

export function validationSchame() {
    return Yup.object({
        rut: Yup.string().required("RUT es requerido"),
        nombretienda: Yup.string().required("nombre es requerido"),
        telefono: Yup.string().required("telefono es requerido"),
        correo: Yup.string().required("correo es requerido"),
        direccion: Yup.string().required("direccion es requerido"),
    });
}

interface productoData {
    rut: string;
    nombretienda: string;
    telefono: string;
    correo: string;
    direccion: string;
}

export default function Opciones() {

    const [listo, setListo] = useState(false);
    const [encontrado, setEncontrado] = useState(false);
    const [logo, setLogo] = useState<string>("");
    const [activado, setActivado] = useState(0);

    const isFocused = useIsFocused();

    const encontrar = async () => {

        const response = await buscaropciones();
        if (response.status == "error") {
            formik.setFieldValue("rut", "");
            formik.setFieldValue("nombretienda", "");
            formik.setFieldValue("telefono", "");
            formik.setFieldValue("correo", "");
            formik.setFieldValue("direccion", "");
            ToastAndroid.show("Sin datos", ToastAndroid.LONG);
            setListo(true);
        } else {
            formik.setFieldValue("rut", response.rut);
            formik.setFieldValue("nombretienda", response.nombretienda);
            formik.setFieldValue("telefono", response.telefono);
            formik.setFieldValue("correo", response.correo);
            formik.setFieldValue("direccion", response.direccion);
            setActivado(response.activado);
            setLogo(response.logo);
            setListo(true);
            setEncontrado(true);
        }

    }

    useEffect(() => {
        setEncontrado(false);
        setListo(false);
        encontrar();
    }, [isFocused]);

    const formik = useFormik({
        initialValues: initialValues(),
        validationSchema: validationSchame(),
        validateOnChange: false,
        onSubmit: async (formValue: productoData) => {
            try {
                const { rut, nombretienda, telefono, correo, direccion } = formValue;
                const response = await guardaropciones(rut, nombretienda, telefono, correo, direccion);
                if (response.status == "error") {
                    ToastAndroid.show("Error = " + response.message, ToastAndroid.LONG);
                    router.back();
                } else {
                    ToastAndroid.show("Opciones guardadas exitosamente", ToastAndroid.LONG);
                    router.back();
                }
            } catch (error) {
                ToastAndroid.show("Error = " + error, ToastAndroid.LONG);
            }
        },
    });

    const handleactivacion = async () => {
        try {
            const response = await activacion();
            if (response.status == "error") {
                ToastAndroid.show("Error = " + response.message, ToastAndroid.LONG);
                router.back();
            } else {
                ToastAndroid.show(response.message, ToastAndroid.LONG);
                router.back();
            }
        } catch (error) {
            ToastAndroid.show("Error = " + error, ToastAndroid.LONG);
        }
    }
    return (

        listo &&

        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <Text style={styles.title}>Opciones</Text>
            <Text>RUT o RUT empresa</Text>
            <TextInput
                placeholder="12.345.678-9"
                value={formik.values.rut}
                onChangeText={(text) => formik.setFieldValue("rut", text)}
                style={styles.input}
            />
            {formik.touched.rut && formik.errors.rut ? (
                <Text>{formik.errors.rut}</Text>
            ) : null}
            <Text>Nombre Tienda</Text>
            <TextInput
                placeholder="Nombre Tienda"
                value={formik.values.nombretienda}
                onChangeText={(text) => formik.setFieldValue("nombretienda", text)}
                style={styles.input}
            />
            {formik.touched.nombretienda && formik.errors.nombretienda ? (
                <Text>{formik.errors.nombretienda}</Text>
            ) : null}
            <Text>Telefono</Text>
            <TextInput
                placeholder="Telefono"
                value={formik.values.telefono}
                onChangeText={(text) => formik.setFieldValue("telefono", text)}
                style={styles.input}
            />
            {formik.touched.telefono && formik.errors.telefono ? (
                <Text>{formik.errors.telefono}</Text>
            ) : null}
            <Text>Correo</Text>
            <TextInput
                placeholder="Correo"
                value={formik.values.correo}
                onChangeText={(text) => formik.setFieldValue("correo", text)}
                style={styles.input}
            />
            {formik.touched.correo && formik.errors.correo ? (
                <Text>{formik.errors.correo}</Text>
            ) : null}
            <Text>Direccion</Text>
            <TextInput
                placeholder="Direccion"
                value={formik.values.direccion}
                onChangeText={(text) => formik.setFieldValue("direccion", text)}
                style={styles.input}
            />
            {formik.touched.direccion && formik.errors.direccion ? (
                <Text>{formik.errors.direccion}</Text>
            ) : null}
            <Button title="Guardar Opciones" onPress={() => formik.handleSubmit()} disabled={formik.isSubmitting} />
            <View style={{ height: 10 }} />
            {encontrado && <Button title="Subir logo" onPress={() => router.replace({
                pathname: "./subirlogo",
                params: { logo: logo || "sinlogo.jpeg" }
            })} />}
            <View style={{ height: 10 }} />
            <Button title={activado == 1 ? "Desactivar" : "Activar"} onPress={handleactivacion} />
            <View style={{ height: 10 }} />
            <Button title="Cancelar" onPress={() => router.back()} />
        </KeyboardAvoidingView >

    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
});