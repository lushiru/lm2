// app/sign-in.tsx
import { router } from 'expo-router';
import { useFormik } from 'formik';
//import React from 'react';
import { Checkbox } from 'expo-checkbox';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, ToastAndroid, View } from 'react-native';
import * as Yup from 'yup';
import { login } from '../../../../api/auth';
import { useSession } from '../../../../ctx'; // We will create this context later

export function initialValues() {
    return {
        email: "",
        password: "",
    };
}

export function validationSchame() {
    return Yup.object({
        email: Yup.string().email("email es invalido").required("email es requerido"),
        password: Yup.string().required("password es requerido"),
    });
}

interface LoginData {
    email: string;
    password: string;
}

export default function Login() {

    const { signIn } = useSession();
    const [isChecked, setChecked] = useState(false);

    useEffect(() => {
        const checkRememberMe = async () => {
            const user = await SecureStore.getItemAsync('user');
            if (user) {
                const { email, password } = JSON.parse(user);
                formik.setFieldValue('email', email);
                formik.setFieldValue('password', password);
                setChecked(true);
            }
        };
        checkRememberMe();
    }, []);

    const formik = useFormik({
        initialValues: initialValues(),
        validationSchema: validationSchame(),
        validateOnChange: false,
        onSubmit: async (formValue: LoginData) => {
            try {
                const { email, password } = formValue;
                const response = await login(email, password);
                if (response.access_token && response.iduser) {
                    if (isChecked) {
                        await SecureStore.setItemAsync('user', JSON.stringify({ email, password }));
                    } else {
                        await SecureStore.deleteItemAsync('user');
                    }
                    signIn(response.access_token, response.iduser);
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
            <Text style={styles.title}>Iniciar Sesión</Text>
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
                placeholder="Password"
                value={formik.values.password}
                onChangeText={(text) => formik.setFieldValue("password", text)}
                autoCapitalize="none"
                secureTextEntry
            />
            {formik.touched.password && formik.errors.password ? (
                <Text>{formik.errors.password}</Text>
            ) : null}
            <View style={styles.checkboxContainer}>
                <Checkbox
                    style={styles.checkbox}
                    value={isChecked}
                    onValueChange={setChecked}
                    color={isChecked ? '#4630EB' : undefined}
                />
                <Text>Guardar usuario y password</Text>
            </View>
            <Button title="Iniciar sesion" disabled={formik.isSubmitting} onPress={() => formik.handleSubmit()} color="#e74b1cff" />
            <View style={{ height: 10 }} />
            <Button title="Registrarse" onPress={() => router.replace('/tiendas/(tabstiendas)/tutienda/register')} />
            <View style={{ height: 10 }} />
            <Button title="Recuperar contraseña" onPress={() => router.replace('/tiendas/(tabstiendas)/tutienda/recuperar')} />

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
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkbox: {
        marginRight: 8,
    },
});
