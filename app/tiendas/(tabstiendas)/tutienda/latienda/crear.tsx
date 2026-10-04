import { router, useIsFocused } from "expo-router";
import { useFormik } from "formik";
import { useEffect } from "react";
import { Button, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, ToastAndroid, View } from "react-native";
import * as Yup from "yup";
import { crear } from "../../../../../api/producto";

export function initialValues() {
    return {
        nombre: "",
        descripcion: "",
        precio: 0,
        cantidad: 0
    };
}

export function validationSchame() {
    return Yup.object({
        nombre: Yup.string().required("nombre es requerido"),
        descripcion: Yup.string().required("descripcion es requerido"),
        precio: Yup.number().required("precio es requerido").min(1, "precio debe ser mayor a 0"),
        cantidad: Yup.number().required("cantidad es requerido").min(1, "cantidad debe ser mayor a 0"),
    });
}

interface productoData {
    nombre: string;
    descripcion: string;
    precio: number;
    cantidad: number;
}

export default function Crear() {

    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            formik.resetForm();
        }
    }, [isFocused]);

    const formik = useFormik({
        initialValues: initialValues(),
        validationSchema: validationSchame(),
        validateOnChange: false,
        onSubmit: async (formValue: productoData) => {
            try {
                const { nombre, descripcion, precio, cantidad } = formValue;
                const response = await crear(nombre, descripcion, precio, cantidad);
                if (response.status == "error") {
                    ToastAndroid.show("Error = " + response.message, ToastAndroid.LONG);
                } else {
                    ToastAndroid.show("Producto creado exitosamente", ToastAndroid.LONG);
                    router.back();
                }
            } catch (error) {
                ToastAndroid.show("Error = " + error, ToastAndroid.LONG);
            }
        },
    });

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <Text style={styles.title}>Crear Producto</Text>
            <Text>Nombre</Text>
            <TextInput
                placeholder="Nombre"
                value={formik.values.nombre}
                onChangeText={(text) => formik.setFieldValue("nombre", text)}
                style={styles.input}
            />
            {formik.touched.nombre && formik.errors.nombre ? (
                <Text>{formik.errors.nombre}</Text>
            ) : null}
            <Text>Descripcion</Text>
            <TextInput
                placeholder="Descripcion"
                value={formik.values.descripcion}
                onChangeText={(text) => formik.setFieldValue("descripcion", text)}
                style={styles.input2}
            />
            {formik.touched.descripcion && formik.errors.descripcion ? (
                <Text>{formik.errors.descripcion}</Text>
            ) : null}
            <Text>Precio</Text>
            <TextInput
                placeholder="Precio"
                value={formik.values.precio.toString()}
                onChangeText={(text) => formik.setFieldValue("precio", text)}
                style={styles.input}
                keyboardType="numeric"
            />
            {formik.touched.precio && formik.errors.precio ? (
                <Text>{formik.errors.precio}</Text>
            ) : null}
            <Text>Cantidad</Text>
            <TextInput
                placeholder="Cantidad"
                value={formik.values.cantidad.toString()}
                onChangeText={(text) => formik.setFieldValue("cantidad", text)}
                style={styles.input}
                keyboardType="numeric"
            />
            {formik.touched.cantidad && formik.errors.cantidad ? (
                <Text>{formik.errors.cantidad}</Text>
            ) : null}
            <Button title="Crear" onPress={() => formik.handleSubmit()} disabled={formik.isSubmitting} />
            <View style={{ height: 10 }} />
            <Button title="Cancelar" onPress={() => router.back()} />
        </KeyboardAvoidingView>
    );
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
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    input2: {
        height: 100,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});