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
  const [presupuestoTotal, setPresupuestoTotal] = useState(0);
  const [planAccion, setPlanAccion] = useState([{ accion: '', responsable: '' }]);
  const [sectionProgress, setSectionProgress] = useState({
    definicion: false,
    causas: false,
    solucion: false,
    recursos: false
  });
  const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    const completedSections = Object.values(sectionProgress).filter(v => v).length;
    const totalSections = Object.keys(sectionProgress).length;
    setProgressPercentage((completedSections / totalSections) * 100);
  }, [sectionProgress]);

  const updateSectionProgress = (section, isComplete) => {
    setSectionProgress(prev => ({
      ...prev,
      [section]: isComplete
    }));
  };

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
    impacto: [],
    dueño: '',
  });
  
  const [asistentes, setAsistentes] = useState(['']);
  const [recursos, setRecursos] = useState({
    humanos: [{ unidad: '', cantidad: '', precio: '', total: '', proveedor1: '', proveedor2: '', descripcion: '' }],
    contratistas: [{ unidad: '', cantidad: '', precio: '', total: '', proveedor1: '', proveedor2: '', descripcion: '' }],
    materiales: [{ unidad: '', cantidad: '', precio: '', total: '', proveedor1: '', proveedor2: '', descripcion: '' }],
    maquinarias: [{ unidad: '', cantidad: '', precio: '', total: '', proveedor1: '', proveedor2: '', descripcion: '' }],
    inversion: [{ unidad: '', cantidad: '', precio: '', total: '', proveedor1: '', proveedor2: '', descripcion: '' }],
    otros: [{ unidad: '', cantidad: '', precio: '', total: '', proveedor1: '', proveedor2: '', descripcion: '' }],
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
          fecha: formatDate(data.date) || ticket.date || '',
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

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    
    // Update section progress based on required fields being filled
    if (name === 'definicionProblema' && value.trim() !== '') {
      updateSectionProgress('definicion', true);
    } else if (name === 'definicionProblema' && value.trim() === '') {
      updateSectionProgress('definicion', false);
    } else if (name === 'causaRaiz' && value.trim() !== '') {
      updateSectionProgress('causas', true);
    } else if (name === 'causaRaiz' && value.trim() === '') {
      updateSectionProgress('causas', false);
    } else if (name === 'solucionPropuesta' && value.trim() !== '') {
      updateSectionProgress('solucion', true);
    } else if (name === 'solucionPropuesta' && value.trim() === '') {
      updateSectionProgress('solucion', false);
    }
  };

  const checkResourcesProgress = () => {
    let hasCompleteResource = false;
    
    Object.keys(recursos).forEach(tipo => {
      recursos[tipo].forEach(recurso => {
        if (recurso.unidad && recurso.cantidad && recurso.precio) {
          hasCompleteResource = true;
        }
      });
    });
    
    updateSectionProgress('recursos', hasCompleteResource);
  };

  const handleAsistenteChange = (index, value) => {
    const updated = [...asistentes];
    updated[index] = value;
    if (index === asistentes.length - 1 && value !== '') updated.push('');
    setAsistentes(updated);
  };

  const calcularPresupuestoTotal = () => {
    let total = 0;
    
    Object.keys(recursos).forEach(tipo => {
      recursos[tipo].forEach(recurso => {
        if (recurso.total && !isNaN(parseFloat(recurso.total))) {
          total += parseFloat(recurso.total);
        }
      });
    });
    
    setPresupuestoTotal(total);
    return total;
  };


  const removeAsistente = (index) => {
    if (asistentes.length > 1) {
      const updated = [...asistentes];
      updated.splice(index, 1);
      setAsistentes(updated);
    }
  };

  const handlePlanAccionChange = (index, field, value) => {
    const updatedPlan = [...planAccion];
    updatedPlan[index] = { ...updatedPlan[index], [field]: value };
    
    // Si es el último elemento y se está escribiendo, agregamos una nueva línea
    if (index === updatedPlan.length - 1 && (value !== '' && field === 'accion')) {
      updatedPlan.push({ accion: '', responsable: '' });
    }
    
    setPlanAccion(updatedPlan);
  };

  const removePlanAccion = (index) => {
    if (planAccion.length > 1) {
      const updatedPlan = [...planAccion];
      updatedPlan.splice(index, 1);
      setPlanAccion(updatedPlan);
    }
  };

  const handleImpactoChange = (option) => {
    setFormData(prev => {
      const currentImpacto = [...prev.impacto];
      if (currentImpacto.includes(option)) {
        return { ...prev, impacto: currentImpacto.filter(item => item !== option) };
      } else {
        return { ...prev, impacto: [...currentImpacto, option] };
      }
    });
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

  const handleRecursoChange = (tipo, index, campo, valor) => {
    const recursosActualizados = { ...recursos };
    recursosActualizados[tipo][index][campo] = valor;
    
    // Si se cambió cantidad o precio, calculamos el total automáticamente
    if (campo === 'cantidad' || campo === 'precio') {
      const cantidad = recursosActualizados[tipo][index].cantidad;
      const precio = recursosActualizados[tipo][index].precio;
      
      if (cantidad && precio && !isNaN(parseFloat(cantidad)) && !isNaN(parseFloat(precio))) {
        recursosActualizados[tipo][index].total = (parseFloat(cantidad) * parseFloat(precio)).toFixed(2);
      }
    }
    
    setRecursos(recursosActualizados);
    calcularPresupuestoTotal();
    checkResourcesProgress(); // Check resources progress after changes
  };

  const ProgressBar = ({ percentage }) => (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${percentage}%` }]} />
    </View>
  );

  const eliminarLineaRecurso = (tipo, index) => {
    if (recursos[tipo].length > 1) {
      const recursosActualizados = { ...recursos };
      recursosActualizados[tipo].splice(index, 1);
      setRecursos(recursosActualizados);
      calcularPresupuestoTotal();
    }
  };

  const agregarNuevaLineaRecurso = (tipo) => {
    const recursosActualizados = { ...recursos };
    recursosActualizados[tipo].push({ 
      unidad: '', cantidad: '', precio: '', total: '', proveedor1: '', proveedor2: '', descripcion: '' 
    });
    setRecursos(recursosActualizados);
  };

  const handleSubmit = async () => {
    try {
      setSubmitted(true);
      
      // Validación básica
      if (!formData.definicionProblema || !formData.causaRaiz || !formData.solucionPropuesta) {
        Alert.alert('Error', 'Por favor complete los campos obligatorios');
        return;
      }
      
      const planAccionData = planAccion
      .filter(item => item.accion.trim())
      .map(item => ({
        accion: item.accion,
        responsable: item.responsable
      }));

      const recursosData = {};
      let presupuestoCalculado = 0;
      
      Object.keys(recursos).forEach(tipo => {
        recursosData[tipo] = recursos[tipo]
          .filter(r => r.unidad || r.cantidad || r.precio || r.descripcion)
          .map(r => ({
            unidad: r.unidad,
            cantidad: r.cantidad,
            precio: r.precio,
            total: r.total,
            proveedor1: r.proveedor1,
            proveedor2: r.proveedor2,
            descripcion: r.descripcion
          }));
        
        recursos[tipo].forEach(r => {
          if (r.total && !isNaN(parseFloat(r.total))) {
            presupuestoCalculado += parseFloat(r.total);
          }
        });
      });

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
          
          <View style={styles.sectionProgressContainer}>
            <Text style={styles.sectionProgressLabel}>Progreso:</Text>
            <View style={{ flex: 1 }}>
              <ProgressBar percentage={progressPercentage} />
            </View>
            <Text style={styles.sectionProgressPercentage}>{Math.round(progressPercentage)}%</Text>
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
                <Text style={styles.label}>Dueño del ticket No Conforme</Text>
                <TextInput
                      style={styles.input}
                      placeholder="Nombre"
                      value={formData.dueño}
                      onChangeText={(val) => handleChange('dueño', val)}
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
                <Text style={styles.label}>Impacto</Text>
                <View style={styles.checkboxGroup}>
                  {['Comercial', 'Económico/Financiero', 'Productivo', 'Logística'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={styles.checkboxItem}
                      onPress={() => handleImpactoChange(option)}
                    >
                      <View style={[
                        styles.checkbox,
                        formData.impacto.includes(option) && styles.checkboxSelected
                      ]}>
                        {formData.impacto.includes(option) && (
                          <MaterialIcons name="check" size={16} color="#FFFFFF" />
                        )}
                      </View>
                      <Text style={styles.checkboxText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

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
              
              <View style={styles.subsection}>
              <Text style={styles.subSectionTitle}>Plan de acción</Text>
  
                {planAccion.map((item, index) => (
                <View key={index} style={styles.planAccionRow}>
                  <View style={styles.planAccionInputs}>
                    <TextInput
                      style={[styles.input, styles.planAccionInput]}
                      placeholder="Acción"
                      value={item.accion}
                      onChangeText={(val) => handlePlanAccionChange(index, 'accion', val)}
                    />
                    <TextInput
                      style={[styles.input, styles.planAccionInput]}
                      placeholder="Responsable"
                      value={item.responsable}
                      onChangeText={(val) => handlePlanAccionChange(index, 'responsable', val)}
                    />
                  </View>
                    
                  {index > 0 && (
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => removePlanAccion(index)}
                    >
                      <MaterialIcons name="remove-circle" size={24} color="#D32F2F" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>

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
                
                {recursos[tipo].map((recurso, index) => (
                  <View key={index} style={styles.recursoRowContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      <View style={styles.recursoTable}>
                        {index === 0 && (
                          <View style={styles.recursoHeader}>
                            <Text style={styles.recursoHeaderCell}>Unidad</Text>
                            <Text style={styles.recursoHeaderCell}>Cantidad</Text>
                            <Text style={styles.recursoHeaderCell}>Precio Unit.</Text>
                            <Text style={styles.recursoHeaderCell}>Total</Text>
                            <Text style={styles.recursoHeaderCell}>Proveedor 1</Text>
                            <Text style={styles.recursoHeaderCell}>Proveedor 2</Text>
                            <Text style={styles.recursoHeaderCell}>Descripción</Text>
                          </View>
                        )}
                        
                        <View style={styles.recursoRow}>
                          <TextInput
                            style={styles.recursoCell}
                            value={recurso.unidad}
                            onChangeText={(val) => handleRecursoChange(tipo, index, 'unidad', val)}
                            placeholder="Unidad"
                          />
                          <TextInput
                            style={styles.recursoCell}
                            value={recurso.cantidad}
                            onChangeText={(val) => handleRecursoChange(tipo, index, 'cantidad', val)}
                            placeholder="0"
                            keyboardType="numeric"
                          />
                          <TextInput
                            style={styles.recursoCell}
                            value={recurso.precio}
                            onChangeText={(val) => handleRecursoChange(tipo, index, 'precio', val)}
                            placeholder="0"
                            keyboardType="numeric"
                          />
                          <TextInput
                            style={styles.recursoCell}
                            value={recurso.total}
                            onChangeText={(val) => handleRecursoChange(tipo, index, 'total', val)}
                            placeholder="0"
                            keyboardType="numeric"
                            editable={false}
                          />
                          <TextInput
                            style={styles.recursoCell}
                            value={recurso.proveedor1}
                            onChangeText={(val) => handleRecursoChange(tipo, index, 'proveedor1', val)}
                            placeholder=""
                          />
                          <TextInput
                            style={styles.recursoCell}
                            value={recurso.proveedor2}
                            onChangeText={(val) => handleRecursoChange(tipo, index, 'proveedor2', val)}
                            placeholder=""
                          />
                          <TextInput
                            style={styles.recursoCell}
                            value={recurso.descripcion}
                            onChangeText={(val) => handleRecursoChange(tipo, index, 'descripcion', val)}
                            placeholder="Descripción"
                          />
                        </View>
                      </View>
                    </ScrollView>
                    
                    <View style={styles.recursoActions}>
                      {recursos[tipo].length > 1 && (
                        <TouchableOpacity 
                          style={styles.removeButtonRecurso}
                          onPress={() => eliminarLineaRecurso(tipo, index)}
                        >
                          <MaterialIcons name="remove-circle" size={24} color="#D32F2F" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))}
                
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => agregarNuevaLineaRecurso(tipo)}
                >
                  <MaterialIcons name="add-circle" size={24} color="#1C7D4A" />
                  <Text style={styles.addButtonText}>Agregar línea</Text>
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.presupuestoContainer}>
              <Text style={styles.presupuestoLabel}>Presupuesto Total:</Text>
              <Text style={styles.presupuestoTotal}>${presupuestoTotal.toFixed(2)}</Text>
            </View>
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
  checkboxGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  checkboxSelected: {
    backgroundColor: '#1C7D4A',
    borderColor: '#1C7D4A',
  },
  checkboxText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333333',
  },
  
  // Estilos para el Plan de Acción
  subsection: {
    marginTop: 20,
    marginBottom: 16,
  },
  planAccionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  planAccionInputs: {
    flex: 1,
    flexDirection: 'row',
  },
  planAccionInput: {
    flex: 1,
    marginRight: 8,
  },
  
  // Estilos para los Recursos dinámicos
  recursoRowContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  recursoActions: {
    justifyContent: 'center',
    paddingLeft: 8,
  },
  removeButtonRecurso: {
    padding: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  addButtonText: {
    marginLeft: 8,
    color: '#1C7D4A',
    fontWeight: '500',
  },
  presupuestoContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F5F7FA',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  presupuestoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginRight: 12,
  },
  presupuestoTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C7D4A',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    width: '100%',
    marginTop: 4,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1C7D4A',
    borderRadius: 4,
  },
  sectionProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionProgressLabel: {
    fontSize: 12,
    color: '#757575',
    marginRight: 8,
  },
  sectionProgressPercentage: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1C7D4A',
    marginLeft: 8,
  },

});

export default PanelControl;