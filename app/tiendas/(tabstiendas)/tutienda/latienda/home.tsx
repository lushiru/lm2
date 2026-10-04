import { StyleSheet, Text, View } from "react-native";

export default function Home() {
    return (
        <View
            style={styles.container}
        >
            <Text>app de home.</Text>
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