// App.js
import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import NonConformityForm from './components/form_users'; // Asegúrate de que la ruta sea correcta

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Formulario de No conformidad</Text>
      <NonConformityForm/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 10,
  },
});
