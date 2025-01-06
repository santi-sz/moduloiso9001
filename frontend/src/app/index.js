import { View } from 'react-native-web'
import { Link } from 'expo-router';
import NonConformityForm from '../components/form_users'

export default function Index(){
    return (
        <View>
            <Link href="/view_tickets">
                Ver Tickets
            </Link>
            <NonConformityForm/>
        </View>
    );
}