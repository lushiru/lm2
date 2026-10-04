import { recuperarPass } from "@/api/auth";
import { router } from "expo-router";
import { useFormik } from "formik";
import { Button, StyleSheet, Text, TextInput, ToastAndroid, View } from "react-native";
import * as Yup from "yup";

export function initialValues() {
    return {
        email: "",
    };
}

export function validationSchame() {
    return Yup.object({
        email: Yup.string().email("email es invalido").required("email es requerido"),
    });
}

interface LoginData {
    email: string;
}


export default function Recuperar() {

    const formik = useFormik({
        initialValues: initialValues(),
        validationSchema: validationSchame(),
        validateOnChange: false,
        onSubmit: async (formValue: LoginData) => {
            try {
                const { email } = formValue;
                const response = await recuperarPass(email);
                if (response.status !== "error") {
                    ToastAndroid.show("se ha enviado un Email con el codigo", ToastAndroid.LONG);
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
            <Text style={styles.title}>Recuperar contraseña</Text>
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
            <Button title="Recuperar contraseña" disabled={formik.isSubmitting} onPress={() => formik.handleSubmit()} color="#e74b1cff" />
            <View style={{ height: 10 }} />
            <Button title="ir a Cambiar contraseña" onPress={() => router.push("./cambiar")} />
            <View style={{ height: 10 }} />
            <Button title="Volver" onPress={() => router.push("./login")} />
            <View style={{ height: 10 }} />
            <Text>Al recuperar contraseña se enviara un codigo al correo electronico, deberar ir a cambiar contraseña e ingresar el codigo y la nueva contraseña</Text>
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