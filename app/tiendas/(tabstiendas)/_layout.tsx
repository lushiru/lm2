import { Ionicons } from '@expo/vector-icons';
import { Tabs } from "expo-router";


export default function AppTiendasLayout() {

  return (
    <Tabs>
      <Tabs.Screen name="inicio" options={{ href: null, headerShown: false, tabBarIcon: () => (<Ionicons name="home" size={24} color="#000" />) }} />
      <Tabs.Screen name="buscar" options={{ headerShown: false, tabBarIcon: () => (<Ionicons name="search" size={24} color="#000" />) }} />
      <Tabs.Screen name="unatienda" options={{ headerShown: false, tabBarIcon: () => (<Ionicons name="home" size={24} color="#000" />) }} />
      <Tabs.Screen name="favoritas" options={{ headerShown: false, tabBarIcon: () => (<Ionicons name="heart" size={24} color="#000" />) }} />
      <Tabs.Screen name="tutienda" options={{ headerShown: false, tabBarIcon: () => (<Ionicons name="storefront" size={24} color="#000" />) }} />
    </Tabs >
  );
}
