import React from 'react'
import {Slot} from 'expo-router'
import { View, Text} from "react-native";
import { ScrollView } from 'react-native-web';

export default function Layout(){
    return(
        <ScrollView>
            <Slot/>
        </ScrollView>
    )
}