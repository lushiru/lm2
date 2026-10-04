import { activaReenviar } from "@/api/auth";
import { router } from "expo-router";
import { useFormik } from "formik";
import { Button, StyleSheet, Text, TextInput, ToastAndroid, View } from "react-native";
import * as Yup from 'yup';

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

export default function ActivaReenviar() {

    const formik = useFormik({
        initialValues: initialValues(),
        validationSchema: validationSchame(),
        validateOnChange: false,
        onSubmit: async (formValue: LoginData) => {
            try {
                const { email } = formValue;
                const response = await activaReenviar(email);
                if (response.status !== "error") {
                    ToastAndroid.show("Codigo reenviado exitosamente", ToastAndroid.LONG);
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
            <Text style={styles.title}>ActivaReenviar</Text>
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
            <Button title="Reenviar codigo" disabled={formik.isSubmitting} onPress={() => formik.handleSubmit()} color="#e74b1cff" />
            <View style={{ height: 10 }} />
            <Button title="Volver" onPress={() => router.back()} />
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