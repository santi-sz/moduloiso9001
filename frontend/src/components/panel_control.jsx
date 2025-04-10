import React, { useState } from 'react';
import { View, Text, TextInput, Modal, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const CustomButton = ({ onPress, title, style }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const PanelControl = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    campo2: '',
    campo3: '',
    // Agrega más campos según sea necesario
  });
  const [asistentes, setAsistentes] = useState(['']);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAsistenteChange = (index, value) => {
    const newAsistentes = [...asistentes];
    newAsistentes[index] = value;
    setAsistentes(newAsistentes);

    // Agregar un nuevo campo si el usuario comienza a escribir en el último campo
    if (index === asistentes.length - 1 && value !== '') {
      setAsistentes([...asistentes, '']);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <Modal
            visible={true}
            transparent={true}
            animationType="slide"
          >
            <View style={styles.modalView}>
              <Text>Asistentes:</Text>
              <ScrollView style={{ width: '100%' }}>
                {asistentes.map((asistente, index) => (
                  <TextInput
                    key={index}
                    style={[
                      styles.input,
                      index === asistentes.length - 1 && !asistente ? styles.placeholderInput : null,
                    ]}
                    value={asistente}
                    onChangeText={(value) => handleAsistenteChange(index, value)}
                    placeholder={`Asistente ${index + 1}`}
                    placeholderTextColor={index === asistentes.length - 1 && !asistente ? '#d3d3d3' : '#000'}
                  />
                ))}
              </ScrollView>
              <View style={styles.singleButtonContainer}>
                <CustomButton title="Siguiente" onPress={handleNext} style={styles.nextButton} />
              </View>
            </View>
          </Modal>
        );
      case 1:
        return (
          <Modal
            visible={true}
            transparent={true}
            animationType="slide"
          >
            <View style={styles.modalView}>
              <Text>Campo 2:</Text>
              <TextInput
                style={styles.input}
                value={formData.campo2}
                onChangeText={(value) => handleChange('campo2', value)}
              />
              <View style={styles.buttonContainer}>
                <CustomButton title="Anterior" onPress={handlePrevious} style={styles.previousButton} />
                <CustomButton title="Siguiente" onPress={handleNext} style={styles.nextButton} />
              </View>
            </View>
          </Modal>
        );
      case 2:
        return (
          <Modal
            visible={true}
            transparent={true}
            animationType="slide"
          >
            <View style={styles.modalView}>
              <Text>Campo 3:</Text>
              <TextInput
                style={styles.input}
                value={formData.campo3}
                onChangeText={(value) => handleChange('campo3', value)}
              />
              <View style={styles.buttonContainer}>
                <CustomButton title="Anterior" onPress={handlePrevious} style={styles.previousButton} />
                <CustomButton title="Siguiente" onPress={handleNext} style={styles.nextButton} />
              </View>
            </View>
          </Modal>
        );
      // Agrega más casos según sea necesario
      default:
        return (
          <View style={styles.modalView}>
            <Text>Formulario completado</Text>
          </View>
        );
    }
  };
  
  return <View style={styles.container}>{renderStep()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '50%', // Ajusta el ancho del modal
    alignSelf: 'center', // Centra el modal horizontalmente
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    width: '80%',
    paddingHorizontal: 10,
    alignSelf: 'center',
  },
  placeholderInput: {
    color: '#d3d3d3', 
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  singleButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  buttonWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  previousButton: {
    backgroundColor: '#1C7D4A', // Color rojo para el botón "Anterior"
  },
  nextButton: {
    backgroundColor: '#1C7D4A', // Color verde para el botón "Siguiente"
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PanelControl;