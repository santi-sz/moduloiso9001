import React, { useState, useEffect  } from 'react';
import { View, Text, StyleSheet, Pressable, Button} from 'react-native';
import { Link } from 'expo-router';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ViewTickets from '../components/ViewTickets';
import Header from '../components/header';
import { useRouter } from 'expo-router';


export default function TicketList() {
    const [isHovered, setIsHovered] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [graveTickets, setGraveTickets] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchTickets = async () => {
          try {
            const response = await fetch('http://127.0.0.1:5001/get-tickets');
            const data = await response.json();
            setTickets(data);
            console.log(data);

          } catch (error) {
            console.error('Error fetching tickets:', error);
          }
        };
    
        fetchTickets();
        const interval = setInterval(fetchTickets, 5000);
    
        return () => clearInterval(interval);
      }, []);


    return (
        <View style={styles.container}>
            <Header/>
            <View>
            <ViewTickets/>
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