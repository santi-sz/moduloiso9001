import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Modal, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const CustomButton = ({ onPress, title, style }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const PanelControl = () => {
  const { ticketId } = useLocalSearchParams();
  const [ticket, setTicket] = useState(null);

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    problema: '',
    sugerencia: '',
    seccion: '',
    usuario: '',
    fecha: '',
    fotografias: '',
    archivos: '',
    definicionProblema: '',
    causas: [''],
    causaRaiz: '',
    solucionPropuesta: '',
  });
  const [asistentes, setAsistentes] = useState(['']);
  const [recursos, setRecursos] = useState({
    humanos: {},
    contratistas: {},
    materiales: {},
    maquinarias: {},
    inversion: {},
    otros: {},
  });

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5001/get-ticket/${ticketId}`);
        const data = await response.json();
        setTicket(data);
      } catch (error) {
        console.error('Error fetching ticket details:', error);
      }
    };

    if (ticketId) fetchTicketDetails();
  }, [ticketId]);

  const handleChange = (name, value) => setFormData({ ...formData, [name]: value });

  const handleAsistenteChange = (index, value) => {
    const updated = [...asistentes];
    updated[index] = value;
    if (index === asistentes.length - 1 && value !== '') updated.push('');
    setAsistentes(updated);
  };

  const handleCausaChange = (index, value) => {
    const updated = [...formData.causas];
    updated[index] = value;
    if (index === updated.length - 1 && value !== '') updated.push('');
    setFormData({ ...formData, causas: updated });
  };

  const handleRecursoChange = (tipo, campo, valor) => {
    setRecursos(prev => ({
      ...prev,
      [tipo]: { ...prev[tipo], [campo]: valor },
    }));
  };

  const renderRecursoRow = (tipo) => (
    <View style={styles.row} key={tipo}>
      <Text style={styles.cell}>{tipo}</Text>
      {['unidad', 'cantidad', 'precio', 'total', 'proveedor1', 'proveedor2'].map((campo, i) => (
        <TextInput
          key={i}
          style={styles.cellInput}
          value={recursos[tipo][campo] || ''}
          onChangeText={(val) => handleRecursoChange(tipo, campo, val)}
          placeholder={campo}
        />
      ))}
    </View>
  );

  const renderBubble = (title, content) => (
    <View style={styles.bubble}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {content}
    </View>
  );

  return (
    <View style={styles.container}>
      <Modal visible={true} transparent={true} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalView}>
          <Text>ID: {ticket?.id}</Text>
          <Text>Fecha: {ticket?.fecha}</Text>

          {renderBubble('Asistentes', asistentes.map((asistente, index) => (
            <TextInput
              key={index}
              style={styles.input}
              placeholder={`Asistente ${index + 1}`}
              value={asistente}
              onChangeText={(val) => handleAsistenteChange(index, val)}
            />
          )))}

          {renderBubble('Definición del problema', (
            <TextInput
              style={styles.input}
              placeholder="Definición del problema"
              value={formData.definicionProblema}
              onChangeText={(val) => handleChange('definicionProblema', val)}
            />
          ))}

          {renderBubble('Causas', formData.causas.map((causa, index) => (
            <TextInput
              key={index}
              style={styles.input}
              placeholder={`Causa ${index + 1}`}
              value={causa}
              onChangeText={(val) => handleCausaChange(index, val)}
            />
          )))}

          {renderBubble('Causa Raíz', (
            <TextInput
              style={styles.input}
              placeholder="Causa Raíz"
              value={formData.causaRaiz}
              onChangeText={(val) => handleChange('causaRaiz', val)}
            />
          ))}

          {renderBubble('Solución Propuesta', (
            <TextInput
              style={styles.input}
              placeholder="Solución Propuesta"
              value={formData.solucionPropuesta}
              onChangeText={(val) => handleChange('solucionPropuesta', val)}
            />
          ))}

          {renderBubble('Recursos Requeridos', (
            <>
              {['humanos', 'contratistas', 'materiales', 'maquinarias', 'inversion', 'otros'].map(renderRecursoRow)}
            </>
          ))}
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#B2DCBF',},
  modalView: { marginLeft: 100, backgroundColor: '#B2DCBF', borderRadius: 20, padding: 35, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, width: '90%' },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 },
  sectionTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 5 },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: 5 },
  cell: { width: '15%', padding: 5, fontWeight: 'bold' },
  cellInput: { width: '13%', borderColor: 'gray', borderWidth: 1, padding: 5, marginHorizontal: 2 },
  bubble: { backgroundColor: '#f0f0f0', borderRadius: 15, padding: 15, marginVertical: 10 },
  button: { backgroundColor: '#1C7D4A', padding: 10, borderRadius: 5, alignItems: 'center', justifyContent: 'center', margin: 10 },
  buttonText: { color: 'white', fontWeight: 'bold' },
});

export default PanelControl;
