// App.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import NonConformityForm from './components/form_users'; // Asegúrate de que la ruta sea correcta

export default function App() {
  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.title}>Formulario de No conformidad</Text>
      <NonConformityForm/>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  title:{
    fontSize: 24,
    fontWeight: 'bold',
  }
});
