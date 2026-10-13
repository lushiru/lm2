import { Button, StyleSheet, Text, View } from "react-native";
import { useSession } from "../../../../../ctx";

export default function Salir() {
    const { signOut } = useSession();
    return (
        <View
            style={styles.container}
        >
            <Button title="Sign Out" onPress={signOut} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    }
});