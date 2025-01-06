import React from 'react'
import {Slot} from 'expo-router'
import { View, Text} from "react-native";

export default function Layout(){
    return(
        <View>
            <Slot/>
        </View>
    )
}