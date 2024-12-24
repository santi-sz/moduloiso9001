import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ViewTickets from './components/view_tickets';
import Toast from 'react-native-toast-message';
import Header from './components/view_tickets_header';

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Header />
        <ViewTickets />
        <Toast />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});