
import { router, useIsFocused } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useState } from "react";
import { Alert, Button, Pressable, ScrollView, StyleSheet, Text, ToastAndroid, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { eliminarProducto, listarProductos } from "../../../../../api/producto";


interface ProductosData {
    id: number;
    nombre: string;
    precio: number;
    cantidad: number;
    imagen1: string;
    imagen2: string;
    imagen3: string;
}
interface LinksData {
    first_page_url?: string;
    prev_page_url?: string;
    current_page?: string;
    next_page_url?: string;
    last_page_url?: string;
}

export default function Producto() {

    const [productos, setProductos] = useState<ProductosData[]>([]);

    const [paginaver, setPaginaver] = useState(`page=1`);
    const [currentPage, setCurrentPage] = useState(1);
    const [links, setLinks] = useState<LinksData>();

    const isFocused = useIsFocused();

    useEffect(() => {
        ver(paginaver);
    }, [paginaver, isFocused]);

    useEffect(() => {
        const unlockScreenOerientation = async () => {
            await ScreenOrientation.unlockAsync()
        }
        unlockScreenOerientation()
    }, [])

    async function ver(ir: string) {


        if (ir.includes("?")) {
            const palabras: string[] = ir.split("?");
            ir = palabras[1];
        }

        const prod = await listarProductos(ir);

        if (prod.status == "error") {
            ToastAndroid.show(prod.message, ToastAndroid.LONG);
        } else {

            if (typeof (prod?.data) === "object") {

                setProductos(prod?.data);
                setCurrentPage(prod?.current_page);
                setLinks({
                    first_page_url: prod?.first_page_url,
                    prev_page_url: prod?.prev_page_url,
                    current_page: prod?.current_page,
                    next_page_url: prod?.next_page_url,
                    last_page_url: prod?.last_page_url,
                });
            }
        }
    }

    const eliminar = async (id: number) => {


        return Alert.alert(
            "Are your sure?",
            "Estas seguro de eliminar este producto?",
            [
                // The "Yes" button
                {
                    text: "Si",
                    onPress: async () => {

                        const prod = await eliminarProducto(id);
                        if (prod.status == "error") {
                            ToastAndroid.show(prod.message, ToastAndroid.LONG);
                        } else {
                            ver(paginaver);
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


    }



    return (
        <View>
            <SafeAreaView>
                <Text>Productos</Text>
                <Button title="Crear" onPress={() => router.push("./crear")} />
                <View style={{ height: 10 }} />
                <View style={styles.tableContainer}>
                    <ScrollView horizontal={true}>
                        <View>
                            <View style={styles.headerRow}>
                                <Text style={styles.headerCell1}>id</Text>
                                <Text style={styles.headerCell2}>nombre</Text>
                                <Text style={styles.headerCell3}>precio</Text>
                                <Text style={styles.headerCell4}>cantidad</Text>
                                <Text style={styles.headerCell5}>Editar</Text>
                                <Text style={styles.headerCell6}>Imagen</Text>
                                <Text style={styles.headerCell7}>Eliminar</Text>
                            </View>
                            {productos && productos.map((producto, index) => (
                                <View style={styles.dataRow} key={index}>
                                    <Text style={styles.dataCell1}>{producto.id}</Text>
                                    <Text style={styles.dataCell2}>{producto.nombre}</Text>
                                    <Text style={styles.dataCell3}>{producto.precio}</Text>
                                    <Text style={styles.dataCell4}>{producto.cantidad}</Text>
                                    <View style={styles.dataCell5}><Pressable style={styles.btn} onPress={() => router.replace({ pathname: "./editar", params: { id: producto.id.toString() != "" ? producto.id : "0" } })} ><Text>Editar</Text></Pressable></View>
                                    <View style={styles.dataCell6}><Pressable style={styles.btn} onPress={() => router.replace({
                                        pathname: "./imagenes",
                                        params: {
                                            id: producto.id.toString() != "" ? producto.id : "0",
                                            nombreimagen1: producto.imagen1 != "" ? producto.imagen1 : "sinfoto.jpeg",
                                            nombreimagen2: producto.imagen2 != "" ? producto.imagen2 : "sinfoto.jpeg",
                                            nombreimagen3: producto.imagen3 != "" ? producto.imagen3 : "sinfoto.jpeg",
                                        }
                                    })} ><Text>Imagen</Text></Pressable></View>
                                    <View style={styles.dataCell7}><Pressable style={styles.btn} onPress={() => eliminar(producto.id)} ><Text>Eliminar</Text></Pressable></View>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </View>
                <View style={{ height: 10 }} />
                <View style={styles.viewpagination}>
                    {links ?
                        <>
                            {links?.first_page_url ? <View style={styles.pagination}><Pressable onPress={() => setPaginaver(`${links.first_page_url}`)} ><Text style={styles.btnpag}>{`<<`}</Text></Pressable></View> : <View style={styles.pagination}><Text style={styles.btnpag}>{`<<`}</Text></View>}
                            {links?.prev_page_url ? <View style={styles.pagination}><Pressable onPress={() => setPaginaver(`${links.prev_page_url}`)} ><Text style={styles.btnpag}>{`<`}</Text></Pressable></View> : <View style={styles.pagination}><Text style={styles.btnpag}>{`<`}</Text></View>}
                            <View style={styles.pagination}><Text style={styles.btnpag}>{currentPage}</Text></View>
                            {links?.next_page_url ? <View style={styles.pagination}><Pressable onPress={() => setPaginaver(`${links.next_page_url}`)} ><Text style={styles.btnpag}>{`>`}</Text></Pressable></View> : <View style={styles.pagination}><Text style={styles.btnpag}>{`>`}</Text></View>}
                            {links?.last_page_url ? <View style={styles.pagination}><Pressable onPress={() => setPaginaver(`${links.last_page_url}`)} ><Text style={styles.btnpag}>{`>>`}</Text></Pressable></View> : <View style={styles.pagination}><Text style={styles.btnpag}>{`>>`}</Text></View>}
                        </> : <Text>...</Text>}
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({

    viewpagination: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    pagination: {
        width: 30,
        borderWidth: 1,
        borderColor: '#1a1818ff',
        paddingLeft: 5,
        paddingRight: 5,
        fontWeight: "bold",
    },

    btnpag: {
        width: 25,
        height: 25,
        backgroundColor: "#c0d392ff",
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        textAlign: "center",
        margin: 2,
    },

    btn: {
        width: 80,
        height: 25,
        backgroundColor: "#76ddf1ff",
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        margin: 2,
    },
    tableContainer: {
        flexDirection: 'row',
        // add a height or flex basis to the container for ScrollView to work
    },
    headerRow: {
        flexDirection: 'row',
    },
    dataRow: {
        flexDirection: 'row',
    },
    headerCell1: {
        width: 30,
        borderWidth: 1,
        borderColor: '#1a1818ff',
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: "#76ddf1ff",
        fontWeight: "bold",
        // cell styling
    },
    headerCell2: {
        width: 250,
        borderWidth: 1,
        borderColor: '#1a1818ff',
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: "#76ddf1ff",
        fontWeight: "bold",
        // cell styling
    },
    headerCell3: {
        width: 250,
        borderWidth: 1,
        borderColor: '#1a1818ff',
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: "#76ddf1ff",
        fontWeight: "bold",
        // cell styling
    },
    headerCell4: {
        width: 100,
        borderWidth: 1,
        borderColor: '#1a1818ff',
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: "#76ddf1ff",
        fontWeight: "bold",
        // cell styling
    },
    headerCell5: {
        width: 100,
        borderWidth: 1,
        borderColor: '#1a1818ff',
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: "#76ddf1ff",
        fontWeight: "bold",
        // cell styling
    },
    headerCell6: {
        width: 100,
        borderWidth: 1,
        borderColor: '#1a1818ff',
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: "#76ddf1ff",
        fontWeight: "bold",
        // cell styling
    },
    headerCell7: {
        width: 100,
        borderWidth: 1,
        borderColor: '#1a1818ff',
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: "#76ddf1ff",
        fontWeight: "bold",
        // cell styling
    },
    dataCell1: {
        width: 30,
        borderWidth: 1,
        borderColor: '#1a1818ff',
        paddingLeft: 5,
        paddingRight: 5,
        textAlign: "center",
        // cell styling
    },
    dataCell2: {
        width: 250,
        borderWidth: 1,
        borderColor: '#1a1818ff',
        paddingLeft: 5,
        paddingRight: 5,
        // cell styling
    },
    dataCell3: {
        width: 250,
        borderWidth: 1,
        borderColor: '#1a1818ff',
        paddingLeft: 5,
        paddingRight: 5,
        // cell styling
    },
    dataCell4: {
        width: 100,
        borderWidth: 1,
        borderColor: '#1a1818ff',
        paddingLeft: 5,
        paddingRight: 5,
        // cell styling
    },
    dataCell5: {
        width: 100,
        borderWidth: 1,
        borderColor: '#1a1818ff',
        paddingLeft: 5,
        paddingRight: 5,
        // cell styling
    },
    dataCell6: {
        width: 100,
        borderWidth: 1,
        borderColor: '#1a1818ff',
        paddingLeft: 5,
        paddingRight: 5,
        // cell styling
    },
    dataCell7: {
        width: 100,
        borderWidth: 1,
        borderColor: '#1a1818ff',
        paddingLeft: 5,
        paddingRight: 5,
        // cell styling
    },
});