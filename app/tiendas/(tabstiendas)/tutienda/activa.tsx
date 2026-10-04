import { activarcuenta } from "@/api/auth";
import { router } from "expo-router";
import { useFormik } from "formik";
import { Button, StyleSheet, Text, TextInput, ToastAndroid, View } from "react-native";
import * as Yup from "yup";

export function initialValues() {
    return {
        email: "",
        codigo: 0,
    };
}

export function validationSchame() {
    return Yup.object({
        email: Yup.string().email("email es invalido").required("email es requerido"),
        codigo: Yup.number().required("codigo es requerido"),
    });
}

interface LoginData {
    email: string;
    codigo: number;
}

export default function Activa() {

    const formik = useFormik({
        initialValues: initialValues(),
        validationSchema: validationSchame(),
        validateOnChange: false,
        onSubmit: async (formValue: LoginData) => {
            try {
                const { email, codigo } = formValue;
                const response = await activarcuenta(email, codigo);
                if (response.status !== "error") {
                    ToastAndroid.show("Cuenta activada exitosamente", ToastAndroid.LONG);
                } else {
                    ToastAndroid.show("Error = " + response.message, ToastAndroid.LONG);
                }
            } catch (error) {
                ToastAndroid.show("Error = " + error, ToastAndroid.LONG);
            }
        },
    });


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Activa</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={formik.values.email}
                onChangeText={(text) => formik.setFieldValue("email", text)}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            {formik.touched.email && formik.errors.email ? (
                <Text>{formik.errors.email}</Text>
            ) : null}
            <TextInput
                style={styles.input}
                placeholder="Codigo"
                value={formik.values.codigo.toString()}
                onChangeText={(text) => formik.setFieldValue("codigo", text)}
                keyboardType="numeric"
                autoCapitalize="none"
            />
            {formik.touched.codigo && formik.errors.codigo ? (
                <Text>{formik.errors.codigo}</Text>
            ) : null}
            <Button title="Activar" disabled={formik.isSubmitting} onPress={() => formik.handleSubmit()} color="#e74b1cff" />
            <View style={{ height: 10 }} />
            <Button title="Reenviar codigo" onPress={() => router.push('./activareenviar')} />
            <View style={{ height: 10 }} />
            <Button title="Volver" onPress={() => router.push('./login')} />
        </View>
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
});