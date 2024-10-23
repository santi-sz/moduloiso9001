// App.js
import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import NonConformityForm from './components/form_users'; // Asegúrate de que la ruta sea correcta

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Formulario de No conformidad</Text>
      <NonConformityForm/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 200,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title:{
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  }
});
