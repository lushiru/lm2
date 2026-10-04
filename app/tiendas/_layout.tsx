import { Stack } from "expo-router";

export const unstable_settings = {
    initialRouteName: "(tabstiendas)", // anchor
};

export default function NoProtectedLayout() {

    return (
        <Stack>
            <Stack.Screen
                name="(tabstiendas)"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
}