import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import PanelControl from '../components/panel_control';


export default function Panel() {
    
    return (
        <View style={styles.container}>
            <View>
                <PanelControl/>
            </View>
            <Link
                href="/"
                style={styles.link}
            >
                <FontAwesome name="exclamation-triangle" size={30} color="green" />
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    link: {
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});