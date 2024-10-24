import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  Button,
  Alert,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';


SplashScreen.preventAutoHideAsync();

const NonConformityForm = () => {
  const [cliente, setCliente] = useState('');
  const [seccion, setSeccion] = useState(null);
  const [subseccion, setSubseccion] = useState(null);
  const [formaDeteccion, setFormaDeteccion] = useState(null);
  const [tipoBase, setTipoBase] = useState(null);
  const [tipoOrigen, setTipoOrigen] = useState(null);
  const [tipoError, setTipoError] = useState(null);
  const [lote, setLote] = useState('');
  const [atributo, setAtributo] = useState('');
  const	[resultado, setResultado] = useState('');
  const [animacion] = useState(new Animated.Value(0));
  const [nc, setNc] = useState('');
  const [errors, setErrors] = useState({});

  const [fontsLoaded] = useFonts({
    'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
  });


  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    Animated.timing(animacion, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const validateForm = () => {
    const newErrors = {};
    if (!cliente) newErrors.cliente = 'El nombre es obligatorio';
    if (!seccion) newErrors.seccion = 'La sección es obligatoria';
    if (!subseccion) newErrors.subseccion = 'La subsección es obligatoria';
    if (!formaDeteccion) newErrors.formaDeteccion = 'La forma de detección es obligatoria';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Formulario enviado');
      Alert.alert('No Conformidad', 'Formulario enviado');
    } else {
      Alert.alert('No Conformidad', 'Por favor, complete todos los campos obligatorios');
    }
  };

  const secciones = [
    'Fábrica de alimentos',
    'Producción de pollos',
    'Faena',
    'Producción de quesos',
    'Producción de Leche: Tambo',
    'Reparto',
    'Producción de Cerdos',
    'Administración',
    'Mantenimiento',
  ];

  const subseccionesPorSeccion = {
    'Fábrica de alimentos': ['Ensilado/Depósito', 'Tostadora', 'Mixado', 'Pesadas de Insumos/ Alimentos', 'Despacho / Depósito', 'Instalaciones Generales'],
    'Producción de pollos': ['Galpón 1', 'Galpón 2', 'Galpón 3', 'Galpón 4', 'Galpón 5', 'Galpón 6', 'Instalaciones Generales'],
    'Faena': ['Transporte de pollos', 'Sala de espera', 'Sala de degolle', 'Sala de pelado', 'Sala de faena', 'Instalaciones Generales'],
    'Producción de quesos': ['Sala de elaboración', 'Sala caldera', 'Sala despacho', 'Cámara 1', 'Cadena de Frío', 'Cámara 2', 'Zotano', 'Pileta efluentes', 'Pesadas de Productos despachados'],
    'Producción de Leche: Tambo': ['Rodeo vacas en producción', 'Sala de ordeñe', 'Sala tina de leche', 'Rodeo de vacas en espera', 'Rodeo vaquillas jóvenes', 'Rodeo terneras', 'Rodeo descarte y terneros', 'Terreno de Pastoreo propio', 'Terreno de pastoreo alquilado 1', 'Terreno de Pastoreo alquilado 2', 'Pileta efluentes'],
    'Reparto': ['Cámara 1: Pollos A', 'Cámara 2: Pollos B', 'Cadena de frío', 'Sala despacho', 'Transporte', 'Pesadas de Productos Despachados'],
    'Administración': ['Depósito/Archivo', 'Gerencia', 'Contabilidad', 'Ventas Alimentos', 'Ventas Reparto', 'Back-Up'],
    'Mantenimiento': ['Mantenimiento de 1er Nivel (Operarios)', 'Mantenimiento Correctivo', 'Mantenimiento preventivo', 'Plan de verificación de instrumentos', 'Plan de Control de Parámetros de Procesos'],
  };

  const formasDeteccion = [
    'Reclamo de un cliente',
    'Incumplimiento de standares',
    'Auditoráas',
    'Inspecciones',
    'Análisis de datos',
    'Resultados de evaluaciones',
    'Resultados de mediciones',
    'Sugerencia de Mejora',
  ];

  const tiposBase = ['Producto', 'Proceso'];

  const tiposOrigenPorBase = {
    'Producto': ['Materia Prima'],
    'Proceso': ['Mano de Obra', 'Métodos', 'Maquinaria', 'Infraestructura', 'Servicios', 'Medio Ambiente', 'Higiene y Seguridad', 'Transporte'],
  };


  const productos_materiaprima = {
    'Materia Prima': ['Producto 1', 'Producto 2', 'Producto 3', 'Producto 4', 'Producto 5'],
  };

  const atributos_producto = [
    'Cantidad',
    'Calidad',
    'Ph',
    'Dimensión',
    'Peso',
    'Sabor',
    'Humedad',
    'Olor',
  ];

  const resultados_posibles = [
  'Aceptado',
  'Aceptado con observación',
  'Rechazado',
  ];

  const nc_posibles = [
    'Grave',
    'Urgente',
    'Menor',
  ];

  const handleSeccionChange = (value) => {
    setSeccion(value);
    setSubseccion(null);
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={{ ...styles.inputContainer, opacity: animacion }}>
        <TextInput
          style={styles.input}
          placeholder="Ingrese su nombre..."
          value={cliente}
          onChangeText={setCliente}
        />
      </Animated.View>
      <Dropdown
        style={styles.dropdown}
        data={secciones.map((item) => ({ label: item, value: item }))}
        labelField="label"
        valueField="value"
        placeholder="Seleccione una sección..."
        value={seccion}
        onChange={(item) => handleSeccionChange(item.value)}
      />
      {seccion && (
        <Dropdown
          style={styles.dropdown}
          data={subseccionesPorSeccion[seccion].map((item) => ({ label: item, value: item }))}
          labelField="label"
          valueField="value"
          placeholder="Seleccione una subsección..."
          value={subseccion}
          onChange={(item) => setSubseccion(item.value)}
        />
      )}
      <Dropdown
        style={styles.dropdown}
        data={formasDeteccion.map((item) => ({ label: item, value: item }))}
        labelField="label"
        valueField="value"
        placeholder="Seleccione una forma de detección..."
        value={formaDeteccion}
        onChange={(item) => setFormaDeteccion(item.value)}
      />
      <Dropdown
        style={styles.dropdown}
        data={tiposBase.map((item) => ({ label: item, value: item }))}
        labelField="label"
        valueField="value"
        placeholder="Seleccione un tipo base..."
        value={tipoBase}
        onChange={(item) => setTipoBase(item.value)}
      />
      {tipoBase && (
        <Dropdown
          style={styles.dropdown}
          data={tiposOrigenPorBase[tipoBase].map((item) => ({ label: item, value: item }))}
          labelField="label"
          valueField="value"
          placeholder="Seleccione un tipo de origen..."
          value={tipoOrigen}
          onChange={(item) => setTipoOrigen(item.value)}
        />
      )}

      {tipoBase == "Producto/Materia prima" && (
      <Animated.View style={{ ...styles.inputContainer, opacity: animacion }}>
        <TextInput
          style={styles.input}
          placeholder="Ingrese el número de lote..."
          value={lote}
          onChangeText={setLote}
        />
      </Animated.View>
      )}

      {tipoOrigen && (
      <Dropdown
        style={styles.dropdown}
        data={productos_materiaprima[tipoOrigen].map((item) => ({ label: item, value: item }))}
        labelField="label"
        valueField="value"
        placeholder='Seleccione producto...'
        value={tipoError}
        onChange={(item) => setTipoError(item.value)}
      />
      )}

      {tipoOrigen && (
      <Dropdown
        style={styles.dropdown}
        data={atributos_producto.map((item) => ({ label: item, value: item }))}
        labelField="label"
        valueField="value"
        placeholder='Seleccione atributo...'
        value={atributo}
        onChange={(item) => setAtributo(item.value)}
      />
      )}

      {tipoOrigen && (
      <Dropdown
        style={styles.dropdown}
        data={resultados_posibles.map((item) => ({ label: item, value: item }))}
        labelField="label"
        valueField="value"
        placeholder='Seleccione resultado...'
        value={resultado}
        onChange={(item) => setResultado(item.value)}
      />
      )}

      {tipoOrigen && (
      <Dropdown
        style={styles.dropdown}
        data={nc_posibles.map((item) => ({ label: item, value: item }))}
        labelField="label"
        valueField="value"
        placeholder='Seleccione estado...'
        value={nc}
        onChange={(item) => setNc(item.value)}
      />
      )}

    {errors.cliente && <Text style={styles.errorText}>{errors.cliente}</Text>}
    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
      <Text style={styles.buttonText}>Enviar Formulario</Text>
    </TouchableOpacity>

    </ScrollView>
  );
};

export default NonConformityForm;

const styles = StyleSheet.create({
  container: {
    width: '115%',
    flex: 1,
    padding: 40,
    backgroundColor: '#fff',
    fontFamily: 'Roboto-Regular',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10, // Bordes redondeados
    paddingHorizontal: 15, // Más padding
    fontFamily: 'Roboto-Regular', // Cambia la fuente a Roboto
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2, // Sombreado
  },
  dropdown: {
    width: '100%',
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10, // Bordes redondeados
    paddingHorizontal: 15, // Más padding
    paddingVertical: 10, // Más padding
    marginBottom: 20,
    fontFamily: 'Roboto-Regular', // Cambia la fuente a Roboto
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2, // Sombreado
  },
  button: {
    height: 45,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10, // Bordes redondeados
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2, // Sombreado
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Roboto-Regular', // Cambia la fuente a Roboto
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginTop: 5,
  },
});