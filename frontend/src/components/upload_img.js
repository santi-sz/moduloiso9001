import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View, ActivityIndicator, Image, Pressable } from "react-native";
import * as ImagePicker from 'expo-image-picker';

export default function UploadImg() {
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const pickImages = async () => {
        setIsLoading(true);
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaType,
            allowsMultipleSelection: true,
            selectionLimit: 15,
        });
        setIsLoading(false);
        console.log(result);
        if (!result.canceled) {
            setImages(result.assets ? result.assets.map(img => img.uri) : [result.uri]);
        }
    };

    const removeImage = (uri) => {
        setImages(images.filter(image => image !== uri));
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
                        <Pressable style={styles.button} onPress={pickImages}>
                            <Text style={styles.buttonText}>Subir Imagen</Text>
                        </Pressable>
                    </View>
                )}
                <View style={styles.imageContainer}>
                    {images.map((item, index) => (
                        <View key={index} style={styles.imageWrapper}>
                            <Image 
                                source={{ uri: item }}
                                style={styles.image} 
                                onError={(e) => console.log(e.nativeEvent.error)}
                            />
                            <Pressable style={styles.removeButton} onPress={() => removeImage(item)}>
                                <Text style={styles.removeButtonText}>X</Text>
                            </Pressable>
                        </View>
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
        boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.2)',
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
    imageWrapper: {
        position: 'relative',
        margin: 5,
    },
    image: {
        width: 100,
        height: 100,
        borderWidth: 1,
        borderColor: 'black', // Añade un borde para verificar si el contenedor de la imagen está presente
    },
    removeButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'green',
        borderRadius: 100,
        padding: 5,
    },
    removeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});