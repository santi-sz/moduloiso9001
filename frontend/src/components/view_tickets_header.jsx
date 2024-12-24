import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/LUN-sin-fondo-transformed.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>La Unión del Norte</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#1C7D4A',
    padding: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: '%100',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 40, 
    height: 40,
    resizeMode: 'contain',
    marginRight: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default Header;