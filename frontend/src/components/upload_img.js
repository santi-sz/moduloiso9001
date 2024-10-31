import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import * as ImagePicker from 'expo-image-picker';

export default function UploadImg() {
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const pickImages = async () => {
        setIsLoading(true);
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: 15,
        });
        setIsLoading(false);
        console.log(result);
        if (!result.cancelled) {
            setImages(result.uris ? [result.uri] : result.selected);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                {isLoading ? (
                    <View>
                        <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Cargando...</Text>
                        <ActivityIndicator size="large" color="#2E8B57" />
                    </View>
                ) : (
                    <View>
                        <TouchableOpacity style={styles.button} onPress={pickImages}>
                            <Text style={styles.buttonText}>Subir Imagen</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <View style={styles.imageContainer}>
                    {images.map((item, index) => (
                        <Image 
                            key={index}
                            source={{uri: item}}
                            style={{width: 100, height: 100}} 
                        />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
    scrollViewContainer: {
        flexGrow: 1,
        alignItems: 'center',
        paddingVertical: 5,
    },
    button: {
        height: 45,
        backgroundColor: '#2E8B57',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
        width: '100%', // Ajusta el ancho del botón
        marginBottom: 20, // Añade un margen inferior para separar los botones
    },
    buttonText: {
        padding: 10,
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 10,
    },
});