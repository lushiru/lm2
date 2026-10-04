//import { Drawer } from "expo-router/drawer";
import { Drawer } from 'expo-router/drawer';
/*import Crear from "./crear";
import Editar from "./editar";
import Generarqr from "./generarqr";
import Home from "./home";
import Imagen from "./imagen";
import Imagenes from "./imagenes";
import Opciones from "./opciones";
import Productos from "./producto";
import Salir from "./salir";
import Subirlogo from "./subirlogo";*/



export default function AppTiendaLayout() {

    return (

        <Drawer
            screenOptions={{
                headerShown: true, // Muestra la barra superior con el botón hamburguesa
                drawerType: 'slide',
            }}
        >
            <Drawer.Screen
                name="home" // This is the name of the page and must match the url from root
                options={{
                    drawerLabel: 'Inicio',
                    title: 'Inicio',
                }}
            /*listeners={({
                drawerItemPress: (e: any) => {
                    e.preventDefault();
                    check();
                    router.replace('./home');
                }
            })}*/
            />
            <Drawer.Screen
                name="producto" // This is the name of the page and must match the url from root
                options={{
                    drawerLabel: 'Productos',
                    title: 'Productos',
                }}
            /*listeners={{
                drawerItemPress: (e: any) => {
                    e.preventDefault();
                    check();
                    router.replace('./productos/producto');
                }
            }}*/
            />

            <Drawer.Screen
                name="opciones" // This is the name of the page and must match the url from root
                options={{
                    drawerLabel: 'Opciones',
                    title: 'Opciones',
                }}
            /*listeners={{
                drawerItemPress: (e: any) => {
                    e.preventDefault();
                    check();
                    router.replace('./opciones');
                }
            }}*/
            />
            <Drawer.Screen
                name="generarqr" // This is the name of the page and must match the url from root
                options={{
                    drawerLabel: 'ver qr',
                    title: 'ver qr',
                }}
            /*listeners={{
                drawerItemPress: (e: any) => {
                    e.preventDefault();
                    check();
                    router.replace('./opciones');
                }
            }}*/
            />
            <Drawer.Screen
                name="salir" // This is the name of the page and must match the url from root
                options={{
                    drawerLabel: 'Salir',
                    title: 'Salir',
                }}
            /*listeners={{
                drawerItemPress: (e: any) => {
                    e.preventDefault();
                    check();
                    router.replace('./salir');
                }
            }}*/
            />
            <Drawer.Screen
                name="subirlogo"
                options={{ drawerItemStyle: { display: 'none' } }}
            />
            <Drawer.Screen
                name="crear"
                options={{ drawerItemStyle: { display: 'none' } }}
            />
            <Drawer.Screen
                name="imagen"
                options={{ drawerItemStyle: { display: 'none' } }}
            />
            <Drawer.Screen
                name="editar"
                options={{ drawerItemStyle: { display: 'none' } }}
            />
            <Drawer.Screen
                name="imagenes"
                options={{ drawerItemStyle: { display: 'none' } }}
            />
        </Drawer>

    );
}