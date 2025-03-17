import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native-web';
import { Link } from 'expo-router';
import NonConformityForm from '../components/form_users';
import Toast from 'react-native-toast-message';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Header from '../components/header';

export default function Index() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <View style={styles.container}>
            <Header/>
            <NonConformityForm />
            <Link
                href="/view_tickets"
                style={styles.link}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <FontAwesome name={isHovered ? "eye-slash" : "eye"} size={30} color="green" />
            </Link>
            <Toast />
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
        marginTop: 20,
    },
});