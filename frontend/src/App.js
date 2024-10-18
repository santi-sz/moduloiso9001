import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Formulario from './components/form_users';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.h2}>Ticket de No conformidad</Text>
      </View>
      <View style={styles.formContainer}>
        <Formulario />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    justifyContent: 'flex-start', // Alinea el contenido al inicio de la pantalla
    alignItems: 'center', // Centra el contenido horizontalmente
    padding: 16,
  },
  h2: {
    paddingTop: 50,
    fontSize: 24,
    fontWeight: 'bold', // Añade negrita para que se vea como un encabezado
    textAlign: 'center', // Centra el texto
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center', // Centra el contenido verticalmente
    alignItems: 'center', // Centra el contenido horizontalmente
    padding: 16,
  },
});