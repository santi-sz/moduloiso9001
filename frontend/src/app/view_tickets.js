import { View, Text } from "react-native-web";
import { Link } from "expo-router";
import ViewTickets from "../components/ViewTickets";

export default function TicketList(){
    return(
        <View>
            <Link href="/">Volver atras</Link>
            <Text>Lista de Tickets</Text>
            <View>
                <ViewTickets/>
            </View>
        </View>
    )
}