import { Text, View,  StyleSheet } from 'react-native';
import MapView from 'react-native-maps';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Map of...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
});
