import React, { useState, useEffect, forwardRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  Alert,
  Dimensions,
  Pressable,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import UploadImg from "./upload_img"; // Importa el componente UploadImg
import Toast from 'react-native-toast-message'; // Importa Toast

SplashScreen.preventAutoHideAsync();

const NonConformityForm = () => {
  const [cliente, setCliente] = useState("");
  const [seccion, setSeccion] = useState(null);
  const [subseccion, setSubseccion] = useState(null);
  const [formaDeteccion, setFormaDeteccion] = useState(null);
  const [tipoBase, setTipoBase] = useState(null);
  const [tipoOrigen, setTipoOrigen] = useState(null);
  const [tipoError, setTipoError] = useState(null);
  const [lote, setLote] = useState("");
  const [atributo, setAtributo] = useState([]);
  const [resultado, setResultado] = useState("");
  const [animacion] = useState(new Animated.Value(0));
  const [nc, setNc] = useState("");
  const [errors, setErrors] = useState({});
  const [proceso, setProceso] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [accion, setAccion] = useState("");

  const [fontsLoaded] = useFonts({
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
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
    if (!cliente) newErrors.cliente = "El nombre es obligatorio";
    if (!seccion) newErrors.seccion = "La sección es obligatoria";
    if (!subseccion) newErrors.subseccion = "La subsección es obligatoria";
    if (!formaDeteccion) newErrors.formaDeteccion = "La forma de detección es obligatoria";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log("handleSubmit called");
    if (validateForm()) {
      console.log("Formulario válido");
      const ticketData = {
        user_name: cliente,
        section: seccion,
        sub_section: subseccion,
        detection_way: formaDeteccion,
        base_type: tipoBase,
        origin_type: tipoOrigen,
        batch: lote,
        resources_product: [tipoError], 
        attributes_product: [atributo],
        nc_products: tipoBase === "Producto" ? nc : "",
        result_products: tipoBase === "Producto" ? resultado : "",
        process: tipoBase === "Proceso" ? proceso : "",
        attributes_process: tipoBase === "Proceso" ? [atributo] : [],
        nc_process: tipoBase === "Proceso" ? nc : "",
        action: tipoBase === "Proceso" ? accion : "",
        description: descripcion,
      };

      console.log("ticketData:", ticketData);

      try {
        const response = await fetch("http://127.0.0.1:5001/create-ticket", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ticketData),
        });

        console.log("response:", response);

        if (response.ok) {
          console.log("Form enviado correctamente");
          Toast.show({
            type: 'success',
            text1: 'Formulado enviado correctamente',
            position: 'top',
            visibilityTime: 3000,
            autoHide: true,
            width: Dimensions.get('window').width * 0.75,
          
          });
          resetForm();
        } else {
          console.log("testeo que entro aca")
          Toast.show({
            type: 'error',
            text1: 'Error al enviar el formulario',
            text2: 'Formulario incorrecto, revisar y enviar nuevamente',
            position: 'top',
            visibilityTime: 3000,
            autoHide: true,
            width: Dimensions.get('window').width * 0.75,
          

          });
        }
      } catch (error) {
        console.error("Error al enviar el formulario:", error);
        Toast.show({
          type: 'error',
          text1: 'Error al enviar el formulario',
          text2: 'Formulario incorrecto, revisar y enviar nuevamente',
          topOffset: 30,
          position: 'top',
          visibilityTime: 3000,
          autoHide: true,
          width: Dimensions.get('window').width * 0.75,
          
        });
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error: Formulario inválido',
        text2: 'Por favor, complete todos los campos obligatorios',
        position: 'top',
        topOffset: 0,
        visibilityTime: 3000,
        autoHide: true,
        width: Dimensions.get('window').width * 0.75,
        
      });
    }
  };

  const resetForm = () => {
    setCliente("");
    setSeccion(null);
    setSubseccion(null);
    setFormaDeteccion(null);
    setTipoBase(null);
    setTipoOrigen(null);
    setTipoError(null);
    setLote("");
    setAtributo("");
    setResultado("");
    setNc("");
    setErrors({});
    setProceso("");
    setAccion("");
    setDescripcion("");
  };

  const secciones = [
    "Fábrica de alimentos",
    "Producción de pollos",
    "Faena",
    "Producción de quesos",
    "Producción de Leche: Tambo",
    "Reparto",
    "Producción de Cerdos",
    "Administración",
    "Mantenimiento",
  ];

  const subseccionesPorSeccion = {
    "Fábrica de alimentos": [
      "Ensilado/Depósito",
      "Tostadora",
      "Mixado",
      "Pesadas de Insumos/ Alimentos",
      "Despacho / Depósito",
      "Instalaciones Generales",
    ],
    "Producción de pollos": [
      "Galpón 1",
      "Galpón 2",
      "Galpón 3",
      "Galpón 4",
      "Galpón 5",
      "Galpón 6",
      "Instalaciones Generales",
    ],
    Faena: [
      "Transporte de pollos",
      "Sala de espera",
      "Sala de degolle",
      "Sala de pelado",
      "Sala de faena",
      "Instalaciones Generales",
    ],
    "Producción de quesos": [
      "Sala de elaboración",
      "Sala caldera",
      "Sala despacho",
      "Cámara 1",
      "Cadena de Frío",
      "Cámara 2",
      "Zotano",
      "Pileta efluentes",
      "Pesadas de Productos despachados",
    ],
    "Producción de Leche: Tambo": [
      "Rodeo vacas en producción",
      "Sala de ordeñe",
      "Sala tina de leche",
      "Rodeo de vacas en espera",
      "Rodeo vaquillas jóvenes",
      "Rodeo terneras",
      "Rodeo descarte y terneros",
      "Terreno de Pastoreo propio",
      "Terreno de pastoreo alquilado 1",
      "Terreno de Pastoreo alquilado 2",
      "Pileta efluentes",
    ],
    Reparto: [
      "Cámara 1: Pollos A",
      "Cámara 2: Pollos B",
      "Cadena de frío",
      "Sala despacho",
      "Transporte",
      "Pesadas de Productos Despachados",
    ],
    Administración: [
      "Depósito/Archivo",
      "Gerencia",
      "Contabilidad",
      "Ventas Alimentos",
      "Ventas Reparto",
      "Back-Up",
    ],
    Mantenimiento: [
      "Mantenimiento de 1er Nivel (Operarios)",
      "Mantenimiento Correctivo",
      "Mantenimiento preventivo",
      "Plan de verificación de instrumentos",
      "Plan de Control de Parámetros de Procesos",
    ],
  };

  const formasDeteccion = [
    "Reclamo de un cliente",
    "Incumplimiento de standares",
    "Auditorías",
    "Inspecciones",
    "Análisis de datos",
    "Resultados de evaluaciones",
    "Resultados de mediciones",
    "Sugerencia de Mejora",
  ];

  const tiposBase = ["Producto", "Proceso"];

  const tiposOrigenPorBase = {
    Producto: ["Materia prima"],
    Proceso: [
      "Mano de Obra",
      "Métodos",
      "Maquinaria",
      "Infraestructura",
      "Servicios",
      "Medio Ambiente",
      "Higiene y Seguridad",
      "Transporte",
    ],
  };

  const productos_materiaprima = [
    "Producto 1",
    "Producto 2",
    "Producto 3",
    "Producto 4",
    "Producto 5",
  ];

  const atributos = {
    Producto: [
      "Cantidad",
      "Calidad",
      "Ph",
      "Dimensión",
      "Peso",
      "Sabor",
      "Humedad",
      "Olor",
    ],
    Proceso: [
      "Plazo entrega",
      "Humedad",
      "Higiene",
      "Seguridad",
      "Temperatura",
    ],
  };

  const resultados_posibles = [
    "Aceptado",
    "Aceptado con observación",
    "Rechazado",
  ];

  const nc_posibles = {
    Producto: ["Grave", "Urgente", "Menor"],
    Proceso: ["Grave", "Urgente", "Menor"],
  };

  const procesos = [
    "Control de recepción de materia prima/insumo",
    "Control de proceso",
    "Controles finales",
    "Controles producto",
  ];

  const acciones = ["Correctiva", "Plan de acción", "Correctora"];

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
        placeholderStyle={{ color: "gray" }}
        value={seccion}
        onChange={(item) => handleSeccionChange(item.value)}
      />

      {seccion && (
        <Dropdown
          style={styles.dropdown}
          data={subseccionesPorSeccion[seccion].map((item) => ({
            label: item,
            value: item,
          }))}
          labelField="label"
          valueField="value"
          placeholder="Seleccione una subsección..."
          placeholderStyle={{ color: "gray" }}
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
        placeholderStyle={{ color: "gray" }}
        value={formaDeteccion}
        onChange={(item) => setFormaDeteccion(item.value)}
      />

      <Dropdown
        style={styles.dropdown}
        data={tiposBase.map((item) => ({ label: item, value: item }))}
        labelField="label"
        valueField="value"
        placeholder="Seleccione un tipo base..."
        placeholderStyle={{ color: "gray" }}
        value={tipoBase}
        onChange={(item) => {
          setTipoBase(item.value);
          if (item.value === "Producto") {
            setProceso("");
            setAccion("");
            setAtributo("");
          }
        }}
      />

      {tipoBase && (
        <Dropdown
          style={styles.dropdown}
          data={tiposOrigenPorBase[tipoBase].map((item) => ({
            label: item,
            value: item,
          }))}
          labelField="label"
          valueField="value"
          placeholder="Seleccione un tipo de origen..."
          placeholderStyle={{ color: "gray" }}
          value={tipoOrigen}
          onChange={(item) => setTipoOrigen(item.value)}
        />
      )}

      {tipoBase === "Producto" && (
        <Animated.View style={{ ...styles.inputContainer, opacity: animacion }}>
          <TextInput
            style={styles.input}
            placeholder="Ingrese el número de lote..."
            placeholderStyle={{ color: "gray" }}
            value={lote}
            onChangeText={setLote}
          />
        </Animated.View>
      )}

      {tipoBase === "Producto" && (
        <Dropdown
          style={styles.dropdown}
          data={productos_materiaprima.map((item) => ({
            label: item,
            value: item,
          }))}
          labelField="label"
          valueField="value"
          placeholder="Seleccione producto..."
          placeholderStyle={{ color: "gray" }}
          value={tipoError}
          onChange={(item) => setTipoError(item.value)}
        />
      )}

      {tipoBase && (
        <Dropdown
          style={styles.dropdown}
          data={atributos[tipoBase].map((item) => ({
            label: item,
            value: item,
          }))}

          labelField="label"
          valueField="value"
          placeholder={atributo.length > 0 ? atributo.join(", ") : "Seleccione atributo..."}
          placeholderStyle={{ color: atributo.length > 0 ? "black" : "gray" }}
          value={atributo}
          onChange={(item) => {
            if (atributo.includes(item.value)) {
              setAtributo(atributo.filter(i => i !== item.value));
            } else {
              setAtributo([...atributo, item.value]);
            }
          }}
          renderItem={item => (
            <View style={styles.item}>
              <Text>{item.label}</Text>
              {atributo.includes(item.value) && <Text>✓</Text>}
            </View>
          )}
          selectedTextStyle={styles.selectedText}
          multiple={true}
        />
      )}

      {tipoBase === "Producto" && (
        <Dropdown
          style={styles.dropdown}
          data={resultados_posibles.map((item) => ({
            label: item,
            value: item,
          }))}
          labelField="label"
          valueField="value"
          placeholder="Seleccione resultado..."
          placeholderStyle={{ color: "gray" }}
          value={resultado}
          onChange={(item) => setResultado(item.value)}
        />
      )}

      {tipoBase === "Proceso" && (
        <Dropdown
          style={styles.dropdown}
          data={procesos.map((item) => ({ label: item, value: item }))}
          labelField="label"
          valueField="value"
          placeholder="Seleccione subproceso..."
          placeholderStyle={{ color: "gray" }}
          value={proceso}
          onChange={(item) => setProceso(item.value)}
        />
      )}

      {tipoBase === "Proceso" && (
        <Dropdown
          style={styles.dropdown}
          data={acciones.map((item) => ({ label: item, value: item }))}
          labelField="label"
          valueField="value"
          placeholder="Seleccione acción..."
          placeholderStyle={{ color: "gray" }}
          value={accion}
          onChange={(item) => setAccion(item.value)}
        />
      )}

      {tipoBase && (
        <Dropdown
          style={styles.dropdown}
          data={nc_posibles[tipoBase].map((item) => ({
            label: item,
            value: item,
          }))}
          labelField="label"
          valueField="value"
          placeholder="Seleccione estado..."
          placeholderStyle={{ color: "gray" }}
          value={nc}
          onChange={(item) => setNc(item.value)}
        />
      )}

      <TextInput
        value={descripcion}
        onChangeText={setDescripcion}
        placeholder="Agregue una descripción del problema/sugerencia..."
        style={{     
          
          borderColor: "#2E8B57",
          borderWidth: 2,
          borderRadius: 10,
          paddingHorizontal: 15,
          fontFamily: "Roboto-Regular",
          fontSize: 16,
          shadowColor: "#fff",
          height: 100,
          color: "#808080",
          textAlignVertical: "center",
          textAlign: "center",
          paddingTop: 20,
          marginBottom: 20,
        }}
        multiline
      />
      <UploadImg />
      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Enviar Formulario</Text>
      </Pressable>
    </ScrollView>
  );
};

export default NonConformityForm;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    padding: 40,
    backgroundColor: "#fff",
    fontFamily: "Roboto-Regular",
    
  },
  scrollViewContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
  },
  inputContainer: {
    marginBottom: 20,
    color: "#808080",

  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: "#2E8B57",
  
  },
  selectedText: {
    fontSize: 16,
    color: "#00000",
  },
  input: {
    height: 45,
    borderColor: "#2E8B57",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    fontWeight: "ultralight",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  dropdown: {
    width: "100%",
    height: 45,
    borderColor: "#2E8B57",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
    fontFamily: "Roboto-Regular",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    height: 45,
    backgroundColor: "#2E8B57",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20, // Añade un margen inferior para separar los botones
    width: "80%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Roboto-Regular",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginTop: 5,
    textAlign: "center"
  },
});