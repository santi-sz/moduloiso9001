// App.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import NonConformityForm from './components/form_users'; // Asegúrate de que la ruta sea correcta

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Formulario de No conformidad</Text>
        <View style={styles.underline} />
        <NonConformityForm/> 
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingTop: 120,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  title:{
    fontSize: 24,
    fontWeight: 'bold',
  },
  underline:{
    borderBottomColor: '#2E8B57',
    borderBottomWidth: 2,
    width: '95%',
  }
});