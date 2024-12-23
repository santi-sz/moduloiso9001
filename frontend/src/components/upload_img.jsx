import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View, ActivityIndicator, Image, Pressable } from "react-native";
import * as ImagePicker from 'expo-image-picker';

export default function UploadImg({ onImagesSelect }) {
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const pickImages = async () => {
        setIsLoading(true);
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true, // Permitir la selección de múltiples imágenes
        });
        setIsLoading(false);
        console.log(result);
        if (!result.canceled) {
            const selectedImages = result.assets ? result.assets.map(asset => asset.uri) : [result.uri];
            setImages(selectedImages);
            onImagesSelect(selectedImages); // Llamar a la función de devolución de llamada con las imágenes seleccionadas
        }
    };

    const removeImage = (uri) => {
        const updatedImages = images.filter(image => image !== uri);
        setImages(updatedImages);
        onImagesSelect(updatedImages); // Llamar a la función de devolución de llamada con las imágenes actualizadas
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}
                        keyboardShouldPersistTaps="handled"
            >
                {isLoading ? (
                    <View>
                        <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Cargando...</Text>
                        <ActivityIndicator size="large" color="#2E8B57" />
                    </View>
                ) : (
                    <View>
                        <Pressable style={styles.button} onPress={pickImages}>
                            <Text style={styles.buttonText}>Subir Imágenes</Text>
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
        elevation: 5, // Reemplaza boxShadow por esto en Android
        width: '100%',
        marginBottom: 1,
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
        maxHeight: 200, // Limita la altura máxima para evitar desbordamiento
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