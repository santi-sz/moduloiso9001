import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Modal, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const PanelControl = () => {
  const { ticketId } = useLocalSearchParams();
  const router = useRouter();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('definicion');
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    problema: '',
    sugerencia: '',
    seccion: '',
    usuario: '',
    fecha: '',
    definicionProblema: '',
    causas: [''],
    causaRaiz: '',
    solucionPropuesta: '',
    gravedad: 'media',
    costoOportunidad: '',
  });
  
  const [asistentes, setAsistentes] = useState(['']);
  const [recursos, setRecursos] = useState({
    humanos: { unidad: '', cantidad: '', precio: '', total: '', proveedor1: '', proveedor2: '' },
    contratistas: { unidad: '', cantidad: '', precio: '', total: '', proveedor1: '', proveedor2: '' },
    materiales: { unidad: '', cantidad: '', precio: '', total: '', proveedor1: '', proveedor2: '' },
    maquinarias: { unidad: '', cantidad: '', precio: '', total: '', proveedor1: '', proveedor2: '' },
    inversion: { unidad: '', cantidad: '', precio: '', total: '', proveedor1: '', proveedor2: '' },
    otros: { unidad: '', cantidad: '', precio: '', total: '', proveedor1: '', proveedor2: '' },
  });

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://127.0.0.1:5001/get-ticket/${ticketId}`);
        const data = await response.json();
        setTicket(data);
        
        // Pre-llenar algunos campos basados en el ticket
        setFormData(prev => ({
          ...prev,
          problema: data.description || '',
          seccion: data.section || '',
          usuario: data.user_name || '',
          fecha: formatDate(data.date) || '',
        }));
      } catch (error) {
        console.error('Error fetching ticket details:', error);
        Alert.alert('Error', 'No se pudo cargar la información del ticket');
      } finally {
        setLoading(false);
      }
    };

    if (ticketId) fetchTicketDetails();
  }, [ticketId]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleChange = (name, value) => setFormData({ ...formData, [name]: value });

  const handleAsistenteChange = (index, value) => {
    const updated = [...asistentes];
    updated[index] = value;
    if (index === asistentes.length - 1 && value !== '') updated.push('');
    setAsistentes(updated);
  };

  const removeAsistente = (index) => {
    if (asistentes.length > 1) {
      const updated = [...asistentes];
      updated.splice(index, 1);
      setAsistentes(updated);
    }
  };

  const handleCausaChange = (index, value) => {
    const updated = [...formData.causas];
    updated[index] = value;
    if (index === updated.length - 1 && value !== '') updated.push('');
    setFormData({ ...formData, causas: updated });
  };

  const removeCausa = (index) => {
    if (formData.causas.length > 1) {
      const updated = [...formData.causas];
      updated.splice(index, 1);
      setFormData({ ...formData, causas: updated });
    }
  };

  const handleRecursoChange = (tipo, campo, valor) => {
    setRecursos(prev => ({
      ...prev,
      [tipo]: { ...prev[tipo], [campo]: valor },
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitted(true);
      
      // Validación básica
      if (!formData.definicionProblema || !formData.causaRaiz || !formData.solucionPropuesta) {
        Alert.alert('Error', 'Por favor complete los campos obligatorios');
        return;
      }
      
      const payload = {
        ticket_id: ticketId,
        problem: formData.problema,
        suggestion: formData.sugerencia,
        section: formData.seccion,
        user: formData.usuario,
        date_ticket: ticket?.date,
        assistants: asistentes.filter(a => a.trim()).join(','),
        definition: formData.definicionProblema,
        cause1: formData.causas[0] || '',
        cause2: formData.causas[1] || '',
        cause3: formData.causas[2] || '',
        cause4: formData.causas[3] || '',
        cause5: formData.causas[4] || '',
        cause6: formData.causas[5] || '',
        cause_origin: formData.causaRaiz,
        proposed_solution: formData.solucionPropuesta,
        gravedad: formData.gravedad,
        costo_oportunidad: formData.costoOportunidad,
      };
      
      const response = await fetch('http://127.0.0.1:5001/cause-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (response.ok) {
        const result = await response.json();
        Alert.alert(
          'Éxito', 
          'Análisis de causa guardado correctamente',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        const error = await response.json();
        Alert.alert('Error', error.error || 'Error al guardar el análisis');
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      Alert.alert('Error', 'Ocurrió un error al procesar la solicitud');
    } finally {
      setSubmitted(false);
    }
  };

  const renderSectionButton = (section, title, icon) => (
    <TouchableOpacity 
      style={[styles.sectionButton, activeSection === section && styles.activeSectionButton]}
      onPress={() => setActiveSection(section)}
    >
      <FontAwesome5 
        name={icon} 
        size={18} 
        color={activeSection === section ? '#FFFFFF' : '#1C7D4A'} 
      />
      <Text style={[styles.sectionButtonText, activeSection === section && styles.activeSectionButtonText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando información del ticket...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Modal visible={true} transparent={false} animationType="fade">
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Análisis de Causa</Text>
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSubmit}
            disabled={submitted}
          >
            <Text style={styles.saveButtonText}>
              {submitted ? 'Guardando...' : 'Guardar'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.ticketInfoContainer}>
          <View style={styles.ticketInfoRow}>
            <View style={styles.ticketInfoItem}>
              <Text style={styles.ticketInfoLabel}>ID Ticket:</Text>
              <Text style={styles.ticketInfoValue}>{ticket?.id || 'N/A'}</Text>
            </View>
            <View style={styles.ticketInfoItem}>
              <Text style={styles.ticketInfoLabel}>Fecha:</Text>
              <Text style={styles.ticketInfoValue}>{formatDate(ticket?.date) || 'N/A'}</Text>
            </View>
            <View style={styles.ticketInfoItem}>
              <Text style={styles.ticketInfoLabel}>Sección:</Text>
              <Text style={styles.ticketInfoValue}>{ticket?.section || 'N/A'}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.navigationContainer}>
          {renderSectionButton('definicion', 'Definición', 'file-alt')}
          {renderSectionButton('causas', 'Análisis de Causas', 'sitemap')}
          {renderSectionButton('solucion', 'Solución', 'lightbulb')}
          {renderSectionButton('recursos', 'Recursos', 'tools')}
        </View>
        
        <ScrollView style={styles.contentContainer}>
          {activeSection === 'definicion' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Definición del Problema</Text>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Problema Detectado</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Describa el problema detectado"
                  value={formData.problema}
                  onChangeText={(val) => handleChange('problema', val)}
                  multiline
                  numberOfLines={3}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Sugerencia</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Ingrese una sugerencia"
                  value={formData.sugerencia}
                  onChangeText={(val) => handleChange('sugerencia', val)}
                  multiline
                  numberOfLines={3}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Asistentes <Text style={styles.requiredField}>*</Text></Text>
                {asistentes.map((asistente, index) => (
                  <View key={index} style={styles.inputWithButton}>
                    <TextInput
                      style={styles.input}
                      placeholder={`Nombre del asistente ${index + 1}`}
                      value={asistente}
                      onChangeText={(val) => handleAsistenteChange(index, val)}
                    />
                    {index > 0 && (
                      <TouchableOpacity 
                        style={styles.removeButton}
                        onPress={() => removeAsistente(index)}
                      >
                        <MaterialIcons name="remove-circle" size={24} color="#D32F2F" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Definición del Problema <Text style={styles.requiredField}>*</Text></Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Defina claramente el problema"
                  value={formData.definicionProblema}
                  onChangeText={(val) => handleChange('definicionProblema', val)}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>
          )}
          
          {activeSection === 'causas' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Análisis de Causas</Text>
              
              <Text style={styles.subSectionTitle}>Identificación de Causas</Text>
              {formData.causas.map((causa, index) => (
                <View key={index} style={styles.inputWithButton}>
                  <TextInput
                    style={styles.input}
                    placeholder={`Causa ${index + 1}`}
                    value={causa}
                    onChangeText={(val) => handleCausaChange(index, val)}
                  />
                  {index > 0 && (
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => removeCausa(index)}
                    >
                      <MaterialIcons name="remove-circle" size={24} color="#D32F2F" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Causa Raíz <Text style={styles.requiredField}>*</Text></Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Identifique la causa raíz del problema"
                  value={formData.causaRaiz}
                  onChangeText={(val) => handleChange('causaRaiz', val)}
                  multiline
                  numberOfLines={3}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Gravedad del Problema</Text>
                <View style={styles.radioGroup}>
                  {['baja', 'media', 'alta', 'crítica'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.radioButton,
                        formData.gravedad === option && styles.radioButtonSelected,
                        option === 'alta' && styles.radioButtonHigh,
                        option === 'crítica' && styles.radioButtonCritical,
                      ]}
                      onPress={() => handleChange('gravedad', option)}
                    >
                      <Text 
                        style={[
                          styles.radioButtonText,
                          formData.gravedad === option && styles.radioButtonTextSelected
                        ]}
                      >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Costo de Oportunidad</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Costo de oportunidad estimado"
                  value={formData.costoOportunidad}
                  onChangeText={(val) => handleChange('costoOportunidad', val)}
                  keyboardType="numeric"
                />
              </View>
            </View>
          )}
          
          {activeSection === 'solucion' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Solución Propuesta</Text>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Propuesta de Solución <Text style={styles.requiredField}>*</Text></Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Describa detalladamente la solución propuesta"
                  value={formData.solucionPropuesta}
                  onChangeText={(val) => handleChange('solucionPropuesta', val)}
                  multiline
                  numberOfLines={6}
                />
              </View>
              
              <TouchableOpacity style={styles.fileUploadButton}>
                <FontAwesome5 name="file-upload" size={20} color="#FFFFFF" />
                <Text style={styles.fileUploadText}>Adjuntar Documentos</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {activeSection === 'recursos' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recursos Requeridos</Text>
              
              {Object.keys(recursos).map((tipo) => (
                <View key={tipo} style={styles.recursoContainer}>
                  <Text style={styles.recursoTitle}>
                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </Text>
                  
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.recursoTable}>
                      <View style={styles.recursoHeader}>
                        <Text style={styles.recursoHeaderCell}>Unidad</Text>
                        <Text style={styles.recursoHeaderCell}>Cantidad</Text>
                        <Text style={styles.recursoHeaderCell}>Precio Unit.</Text>
                        <Text style={styles.recursoHeaderCell}>Total</Text>
                        <Text style={styles.recursoHeaderCell}>Proveedor 1</Text>
                        <Text style={styles.recursoHeaderCell}>Proveedor 2</Text>
                      </View>
                      
                      <View style={styles.recursoRow}>
                        {['unidad', 'cantidad', 'precio', 'total', 'proveedor1', 'proveedor2'].map((campo) => (
                          <TextInput
                            key={campo}
                            style={styles.recursoCell}
                            value={recursos[tipo][campo]}
                            onChangeText={(val) => handleRecursoChange(tipo, campo, val)}
                            placeholder={campo === 'cantidad' || campo === 'precio' ? '0' : ''}
                            keyboardType={campo === 'cantidad' || campo === 'precio' || campo === 'total' ? 'numeric' : 'default'}
                          />
                        ))}
                      </View>
                    </View>
                  </ScrollView>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
        
        <View style={styles.footerContainer}>
          <View style={styles.footerButtonsContainer}>
            <TouchableOpacity 
              style={[styles.footerButton, styles.cancelButton]} 
              onPress={() => router.back()}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.footerButton, styles.submitButton]} 
              onPress={handleSubmit}
              disabled={submitted}
            >
              <Text style={styles.submitButtonText}>
                {submitted ? 'Guardando...' : 'Guardar Análisis'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    fontSize: 16,
    color: '#444',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1C7D4A',
    paddingVertical: 16,
    paddingHorizontal: 10,
    elevation: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#135E37',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  ticketInfoContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  ticketInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  ticketInfoItem: {
    marginBottom: 8,
    minWidth: '30%',
  },
  ticketInfoLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 2,
  },
  ticketInfoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  navigationContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: '#F0F0F0',
  },
  activeSectionButton: {
    backgroundColor: '#1C7D4A',
  },
  sectionButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333333',
  },
  activeSectionButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  section: {
    backgroundColor: '#FFFFFF',
    margin: 10,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C7D4A',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 8,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginTop: 12,
    marginBottom: 8,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 6,
    fontWeight: '500',
  },
  requiredField: {
    color: '#D32F2F',
  },
  input: {
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333333',
    flex: 1,
  },
  textArea: {
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333333',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  radioButton: {
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
    marginBottom: 8,
  },
  radioButtonSelected: {
    backgroundColor: '#1C7D4A',
    borderColor: '#1C7D4A',
  },
  radioButtonHigh: {
    borderColor: '#FF9800',
  },
  radioButtonCritical: {
    borderColor: '#D32F2F',
  },
  radioButtonText: {
    color: '#333333',
    fontSize: 14,
  },
  radioButtonTextSelected: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  fileUploadButton: {
    backgroundColor: '#1C7D4A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    marginTop: 16,
  },
  fileUploadText: {
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 8,
  },
  recursoContainer: {
    marginBottom: 24,
  },
  recursoTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 8,
  },
  recursoTable: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  recursoHeader: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
  },
  recursoHeaderCell: {
    width: 120,
    padding: 12,
    fontWeight: '500',
    color: '#333333',
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  recursoRow: {
    flexDirection: 'row',
  },
  recursoCell: {
    width: 120,
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
  },
  footerContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  footerButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    minWidth: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cancelButtonText: {
    color: '#333333',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#1C7D4A',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default PanelControl;