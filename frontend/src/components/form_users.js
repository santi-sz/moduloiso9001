import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
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

  const animacion = useRef(new Animated.Value(0)).current;

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
    return null; // Render nothing while fonts are loading
  }

  const secciones = [
    'Fabrica de alimentos',
    'Produccion de pollos',
    'Faena',
    'Produccion de quesos',
    'Produccion de Leche: Tambo',
    'Reparto',
    'Produccion de Cerdos',
    'Administraccion',
    'Mantenimiento',
  ];

  const subseccionesPorSeccion = {
    'Fabrica de alimentos': ['Ensilado/Deposito', 'Tostadora', 'Mixado', 'Pesadas de Insumos/ Alimentos', 'Despacho / deposito', 'Instalaciones Generales'],
    'Produccion de pollos': ['Galpon 1', 'Galpon 2', 'Galpon 3', 'Galpon 4', 'Galpon 5', 'Galpon 6', 'Instalaciones Generales'],
    'Faena': ['Transporte de pollos', 'Sala de espera', 'Sala de degolle', 'Sala de pelado', 'Sala de faena', 'Instalaciones Generales'],
    'Produccion de quesos': ['Sala de elaboracion', 'Sala caldera', 'Sala despacho', 'camara 1', 'Cadena de Frio', 'camara 2', 'Zotano', 'Pileta efluentes', 'Pesadas de Productos despachados'],
    'Produccion de Leche: Tambo': ['ROdeo vacas en produccion', 'Sala de ordene', 'sala tina de leche', 'Rodeo de vacas en espera', 'rodeo vaquillas jovenes', 'rodeo terneras', 'rodeo descarte y terneros', 'terreno de Pastoreo propio', 'Terreno de pastoreo alquilado 1', 'Terreno de Pastoreo alquilado 2', 'Pileta efluentes'],
    'Reparto': ['Camara 1: Pollos A', 'Camara 2: Pollos B', 'Cadena de frio', 'Sala despacho', 'Transporte', 'Pesadas de Productos Despachados'],
    'Administraccion': ['Desposito/ Archivo', 'Gerencia', 'Contabilidad', 'Ventas Alimentos', 'Ventas Reparto', 'Back-Up'],
    'Mantenimiento': ['Mantenimiento de 1er Nivel (Operarios)', 'Mantenimiento Correctivo', 'matenimiento preventivo', 'Plan de verificacion de instrumentos', 'Plan de COntrol de Parametros de Procesos'],
  };

  const formasDeteccion = [
    'Reclamo de un cliente',
    'Incumplimiento de standares',
    'Auditorias',
    'Inspecciones',
    'Analisis de Datos',
    'Resultados de evaluaciones',
    'Resultados de mediciones',
    'Sugerencia de Mejora',
  ];

  const tiposBase = ['Producto', 'Proceso'];

  const tiposOrigenPorBase = {
    Producto: ['Materia Prima'],
    Proceso: ['Mano de Obra', 'Metodos', 'Maquinaria', 'Infraestructura', 'Servicios', 'Medio Ambiente', 'Higiene y Seguridad', 'Transporte'],
  };

  const handleSeccionChange = (value) => {
    setSeccion(value);
    setSubseccion(null); // Reset subseccion when seccion changes
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={{ ...styles.inputContainer, opacity: animacion }}>
        <TextInput
          style={styles.input}
          placeholder="Nombre del Cliente"
          value={cliente}
          onChangeText={setCliente}
        />
      </Animated.View>
      <Dropdown
        style={styles.dropdown}
        data={secciones.map((item) => ({ label: item, value: item }))}
        labelField="label"
        valueField="value"
        placeholder="Seleccione una Sección"
        value={seccion}
        onChange={(item) => handleSeccionChange(item.value)}
      />
      {seccion && (
        <Dropdown
          style={styles.dropdown}
          data={subseccionesPorSeccion[seccion].map((item) => ({ label: item, value: item }))}
          labelField="label"
          valueField="value"
          placeholder="Seleccione una Subsección"
          value={subseccion}
          onChange={(item) => setSubseccion(item.value)}
        />
      )}
      <Dropdown
        style={styles.dropdown}
        data={formasDeteccion.map((item) => ({ label: item, value: item }))}
        labelField="label"
        valueField="value"
        placeholder="Seleccione una Forma de Detección"
        value={formaDeteccion}
        onChange={(item) => setFormaDeteccion(item.value)}
      />
      <Dropdown
        style={styles.dropdown}
        data={tiposBase.map((item) => ({ label: item, value: item }))}
        labelField="label"
        valueField="value"
        placeholder="Seleccione un Tipo Base"
        value={tipoBase}
        onChange={(item) => setTipoBase(item.value)}
      />
      {tipoBase && (
        <Dropdown
          style={styles.dropdown}
          data={tiposOrigenPorBase[tipoBase].map((item) => ({ label: item, value: item }))}
          labelField="label"
          valueField="value"
          placeholder="Seleccione un Tipo de Origen"
          value={tipoOrigen}
          onChange={(item) => setTipoOrigen(item.value)}
        />
      )}
      <TouchableOpacity style={styles.button} onPress={() => { /* Handle form submission */ }}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default NonConformityForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    fontFamily: 'Roboto-Regular',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10, // Bordes redondeados
    paddingHorizontal: 15, // Más padding
    paddingVertical: 10, // Más padding
    fontFamily: 'Roboto-Regular', // Cambia la fuente a Roboto
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2, // Sombreado
  },
  dropdown: {
    height: 40,
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
    height: 40,
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
});