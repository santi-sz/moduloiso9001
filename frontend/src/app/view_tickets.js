import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ViewTickets from '../components/ViewTickets';
import Header from '../components/header';

export default function TicketList() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <View style={styles.container}>
            <Header/>
            <View>
                <ViewTickets />
            </View>
            <Link
                href="/"
                style={styles.link}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <FontAwesome name="plus" size={30} color="green" />
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