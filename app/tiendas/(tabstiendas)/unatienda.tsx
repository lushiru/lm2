import { agregarafavoritos, eliminarafavoritos, esFavoritoes, listaproductostienda, reportar } from "@/api/tienda";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, ToastAndroid, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Dialog from 'react-native-dialog';
import PagerView from 'react-native-pager-view';
import { Image } from 'expo-image';
//import mobileAds, { BannerAd, BannerAdSize, TestIds, AdapterStatus } from 'react-native-google-mobile-ads'

interface ProductosData {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    cantidad: number;
    imagen1: string;
    imagen2: string;
    imagen3: string;
    isAd?: false;
}

interface ItemAnuncio {
    id: string;
    isAd: true;   // Flag para identificar que SÍ es un anuncio
}

type ItemLista = ProductosData | ItemAnuncio;

export default function Unatienda() {
    const { id, iduser, nombretienda, telefono, correo, direccion, logo } = useLocalSearchParams();
    const [data, setData] = useState<ProductosData[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true); // Estado para saber si hay más datos
    const { width } = useWindowDimensions();
    const [visible, setVisible] = useState(false);
    const [inputText, setInputText] = useState('');
    const [idproducto, setIdproducto] = useState(0);
    const [idusuario, setIdusuario] = useState(0);
    const [nombreproducto, setNombreproducto] = useState('');
    const [currentpage, setCurrentpage] = useState(0);
    // Responsive column calculation
    const itemWidth = 350; // Minimum width of an item
    const numColumns = Math.floor(width / itemWidth);

    const isFocused = useIsFocused();

    const [esFavorito, setEsFavorito] = useState(false);
    const [dataActual, setDataActual] = useState<number>(1);
    //const [admobReady, setAdmobReady] = useState<boolean>(false);

    // Alterna el estado de favorito

    /*useEffect(() => {
        // Inicializa el SDK de Google Mobile Ads
        mobileAds()
            .initialize()
            .then((adapterStatuses: AdapterStatus[]) => {
                console.log('¡AdMob inicializado correctamente!', adapterStatuses);
                // Aquí ya puedes cargar tus banners o anuncios intersticiales
                setAdmobReady(true);
            })
            .catch((error) => {
                console.error('Error al inicializar AdMob:', error);
            });
    }, []);*/
    // Forward to your main tab or authentication screen


    useEffect(() => {
        if (nombretienda && iduser && logo && isFocused) {
            versiesfavorito()
            //setData([]);
            setPage(1);
        }
    }, [isFocused]);

    useEffect(() => {
        setData([]);
        buscarData(Number(iduser), page);
    }, [page, iduser]);

    const handleReset = () => {
        //setData([]);
        setPage(1);
        //buscarData();
    };

    const versiesfavorito = async () => {
        const esFavoritook = await esFavoritoes(Number(iduser));
        setEsFavorito(esFavoritook);
    }

    const buscarData = async (idusuario: number, pagina: number) => {
        // Simulación de petición a tu API
        setLoading(true);
        if (idusuario) {
            const response = await listaproductostienda(idusuario, `page=${pagina}`);
            if (response.status == "error") {
                ToastAndroid.show(response.message, ToastAndroid.LONG);
            } else {
                if (typeof (response?.data) === "object") {

                    setData(response.data);
                    setDataActual(dataActual + 1);
                }
            }
        }
    };

    const alternarFavorito = async () => {
        if (esFavorito) {
            const response = await eliminarafavoritos(Number(iduser));
            setEsFavorito(false);
            ToastAndroid.show("Tienda eliminada de favoritos", ToastAndroid.LONG);
        } else {
            const response = await agregarafavoritos(Number(id), Number(iduser), String(nombretienda), String(logo), String(telefono), String(correo), String(direccion));
            setEsFavorito(true);
            ToastAndroid.show("Tienda agregada a favoritos", ToastAndroid.LONG);
        }
    };

    const reportarImagen = async () => {
        const response = await reportar(idproducto, Number(idusuario), String(inputText));
        if (response.status == "error") {
            ToastAndroid.show(response.message, ToastAndroid.LONG);
        } else {
            ToastAndroid.show(response.message, ToastAndroid.LONG);
        }
        setVisible(false);
        setInputText("");
        setIdusuario(0);
        setIdproducto(0);
        setNombreproducto("");
    };

    const setearReport = (idproducto: number, idusuario: number, nombreproducto: string) => {
        setIdproducto(idproducto);
        setIdusuario(idusuario);
        setNombreproducto(nombreproducto);
        setVisible(true);
    }

    const datosConAnuncios = useMemo(() => {
        const listaModificada: ItemLista[] = [];

        data.forEach((producto, index) => {
            listaModificada.push(producto);

            // Cada 3 productos (índice 2, 5, 8...), insertamos un objeto tipo anuncio
            if ((index + 1) % 1 === 0) {
                listaModificada.push({
                    id: `ad-${index}`,
                    isAd: true,
                });
            }
        });
        setLoading(false);
        return listaModificada;
    }, [dataActual]);

    const handleCancel = () => {
        setVisible(false);
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        )

    }

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={styles.contenedor}>
                    {nombretienda ? (
                        <View style={styles.headerContainer}>
                            <Image
                                source={{ uri: `${process.env.EXPO_PUBLIC_PAGINA}uploads/${iduser}/${logo}` }}
                                style={styles.logo}
                                //resizeMode="contain"
                                //contentFit="cover"
                                cachePolicy="disk"
                            />
                            <Text style={styles.title}>{nombretienda}</Text>
                            <Pressable
                                onPress={alternarFavorito}
                            >
                                <Ionicons
                                    name={esFavorito ? "heart" : "heart-outline"}
                                    size={24}
                                    color={esFavorito ? "#ff3b30" : "#000000"}
                                />
                            </Pressable>
                        </View>)
                        : (
                            <Text>No hay tienda</Text>
                        )}
                    <Dialog.Container visible={visible}>
                        <Dialog.Title>¿Por qué quieres reportar esta imagen?</Dialog.Title>
                        <Dialog.Description>
                            Ingresa el motivo por el cual quieres reportar esta imagen : {nombreproducto}.
                        </Dialog.Description>

                        {/* Aquí está el campo para escribir */}
                        <Dialog.Input
                            onChangeText={(text) => setInputText(text)}
                            placeholder="Escribe aquí..."
                        />

                        {/* Botones de acción */}
                        <Dialog.Button label="Cancelar" onPress={handleCancel} />
                        <Dialog.Button label="Aceptar" onPress={() => reportarImagen()} />
                    </Dialog.Container>

                    {
                        datosConAnuncios ? (
                            <>
                                {datosConAnuncios.map((item, index) => {
                                    if (item.isAd === true) {
                                        return (
                                            <View key={`ad-${iduser}-${page}-${index}`} style={styles.bannerContainer}>
                                                <Text>ANUNCIO DE MAX {iduser}</Text>
                                            </View>
                                        );
                                    }
                                    return (
                                        <View key={`producto-${item.id}`} style={styles.tarjeta}>
                                            <Text style={styles.item}>{item.nombre}</Text>
                                            <PagerView key={`slider-${item.id}`} style={styles.containerSlider} initialPage={0}>
                                                {item.imagen1 ?
                                                    <View style={styles.pageSlider} key={`img1-${item.imagen1}`}>
                                                        <Image
                                                            source={{ uri: `${process.env.EXPO_PUBLIC_PAGINA}uploads/${iduser}/${item.imagen1}` }}
                                                            style={styles.imagen}
                                                            cachePolicy="disk"
                                                            contentFit="contain"
                                                        />
                                                        <Text>1➡️</Text>
                                                    </View>
                                                    : <View style={styles.pageSlider} />}
                                                {item.imagen2 ?
                                                    <View style={styles.pageSlider} key={`img2-${item.imagen2}`}>
                                                        <Image
                                                            source={{ uri: `${process.env.EXPO_PUBLIC_PAGINA}uploads/${iduser}/${item.imagen2}` }}
                                                            style={styles.imagen}
                                                            cachePolicy="disk"
                                                            contentFit="contain"
                                                        />
                                                        <Text>2</Text>
                                                    </View>
                                                    : <View style={styles.pageSlider} />}
                                                {item.imagen3 ?
                                                    <View style={styles.pageSlider} key={`img3-${item.imagen3}`}>
                                                        <Image
                                                            source={{ uri: `${process.env.EXPO_PUBLIC_PAGINA}uploads/${iduser}/${item.imagen3}` }}
                                                            style={styles.imagen}
                                                            contentFit="contain"
                                                            cachePolicy="disk"
                                                        />
                                                        <Text>3</Text>
                                                    </View>
                                                    : <View style={styles.pageSlider} />}
                                            </PagerView>
                                            <View>
                                                <Pressable
                                                    onPress={() => setearReport(item.id, Number(iduser), item.nombre)}
                                                >
                                                    <Text style={styles.reportarImagen}>Reportar Imagen</Text>
                                                </Pressable  >
                                            </View>
                                            <View style={styles.contenido}>
                                                <View style={styles.contenedorLinea}>
                                                    <Text style={styles.texto}>Descripción: {item.descripcion}</Text>
                                                </View>

                                                <View style={styles.contenedorLinea}>
                                                    <Text style={styles.texto}>Precio: {item.precio}</Text>
                                                </View>

                                                <View style={styles.contenedorLinea}>
                                                    <Text style={styles.texto}>Cantidad: {item.cantidad}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    );
                                })}
                                <View style={styles.viewpagination}>
                                    <View style={styles.pagination}><Pressable onPress={() => setPage(1)}><Text style={styles.btnpag}>1</Text></Pressable></View>
                                    <View style={styles.pagination}><Pressable onPress={() => setPage(2)}><Text style={styles.btnpag}>2</Text></Pressable></View>
                                    <View style={styles.pagination}><Pressable onPress={() => setPage(3)}><Text style={styles.btnpag}>3</Text></Pressable></View>
                                </View>
                            </>
                        ) : (<Text>No se encontro la tienda</Text>)}

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    containerFlat: { flex: 1 },
    contenedor: { flex: 1, padding: 20, },
    title: {
        fontSize: 20,
        textAlign: "center",
        fontWeight: 'bold',
    },
    logo: {
        width: 40,  // Ajusta el ancho de tu logo
        height: 40,  // Ajusta el alto de tu logo
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'center',
        gap: 10,
        paddingTop: 30,
        paddingBottom: 50
    },
    headerContainer2: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'center',
        gap: 0,
        paddingTop: 0,
    },
    loader: {
        paddingVertical: 20,
        borderColor: '#CED0CE',
    },
    item: {
        padding: 20,
        fontSize: 18,
    },
    imagen: {
        width: 300,
        height: 300,
    },
    container: {
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        padding: 20,
    },
    contenedor2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50
    },
    boton: {
        padding: 10,
        height: 40,
        borderRadius: 10,
    },
    tarjeta: {
        //flex: 1,                  // <- Esto hace que se adapte al ancho de la columna de forma dinámica
        margin: 8,                // Espacio entre tarjetas
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3, // Sombra para Android
        overflow: 'hidden',
        height: 600,
    },
    contenido: {
        padding: 20,
    },
    texto: {
        fontSize: 16,
        color: '#666',
        lineHeight: 20,
    },
    contenedorLinea: {
        borderBottomWidth: 1,         // Grosor de la línea
        borderBottomColor: 'black',  // Color de la línea
        paddingBottom: 5,            // Espacio entre el texto y la línea
        alignSelf: 'flex-start',
        width: "100%",    // Ajusta el ancho al tamaño del texto
    },
    reportarImagen: {
        fontSize: 16,
        color: '#666',
        lineHeight: 20,
        textAlign: "right",
        paddingRight: 10,
    },
    containerSlider: {
        height: 320,
    },
    pageSlider: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    bannerContainer: {
        backgroundColor: '#fff',
        marginVertical: 10,
        marginHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 1,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        height: 100,
    },
    adLabel: {
        fontSize: 10,
        color: '#999',
        fontWeight: 'bold',
        marginBottom: 6,
        letterSpacing: 1,
    },
    viewpagination: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    pagination: {
        width: 40,
        height: 40,
        borderRadius: 8, // ✨ Bordes suavizados modernos
        backgroundColor: '#FFFFFF', // Fondo limpio para los botones inactivos
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0', // Borde sutil y claro en lugar de negro rígido
        // Sombra ligera para dar volumen táctil
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        marginLeft: 10,
        marginRight: 10,
    },

    btnpag: {
        fontSize: 15,
        fontWeight: '500',
        color: '#555555',
    },
});
