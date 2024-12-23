import React, { useState, useEffect, forwardRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
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
import {
  secciones,
  subseccionesPorSeccion,
  formasDeteccion,
  tiposBase,
  tiposOrigenPorBase,
  productos_materiaprima,
  atributos,
  resultados_posibles,
  nc_posibles,
  procesos,
  acciones,
} from "./formConstants"; // Importa las constantes
import styles from "./formStyles"; // Importa los estilos

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
  const [images, setImages] = useState([]); // Estado para las imágenes

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
  
      // Convierte a listas explícitamente
      const resourcesProductArray = Array.isArray(tipoError) ? tipoError : [tipoError];
      const attributesProductArray = Array.isArray(atributo) ? atributo : [atributo];
  
      const ticketData = {
        user_name: cliente,
        section: seccion,
        sub_section: subseccion,
        detection_way: formaDeteccion,
        base_type: tipoBase,
        origin_type: tipoOrigen,
        batch: lote,
        resources_product: resourcesProductArray,
        attributes_product: attributesProductArray,
        nc_products: tipoBase === "Producto" ? nc : "",
        result_products: tipoBase === "Producto" ? resultado : "",
        process: tipoBase === "Proceso" ? proceso : "",
        attributes_process: tipoBase === "Proceso" ? attributesProductArray : [],
        nc_process: tipoBase === "Proceso" ? nc : "",
        action: tipoBase === "Proceso" ? accion : "",
        description: descripcion,
      };
      console.log("ticketData:", ticketData);
      const formData = new FormData();

      // Agregar datos del formulario como JSON
      formData.append('data', JSON.stringify(ticketData));
      console.log("Form data:", formData);
      // Agregar imágenes al FormData
      images.forEach((image, index) => {
        formData.append(`image_${index}`, {
          uri: image,
          name: `image_${index}.jpg`, // Puedes ajustar la extensión según corresponda
          type: 'image/jpeg', // Asegúrate de usar el tipo MIME correcto
        });
      });
      try {
        const response = await fetch("http://127.0.0.1:5001/create-ticket", {
          method: "POST",
          body: formData,
        });
  
        if (response.ok) {
          console.log("Formulario enviado correctamente");
          Toast.show({
            type: "success",
            text1: "Formulario enviado correctamente",
          });
          resetForm();
        } else {
          const errorData = await response.json();
          console.error("Error al enviar el formulario:", errorData);
          Toast.show({
            type: "error",
            text1: "Error al enviar el formulario",
            text2: errorData["Invalid input error"],
          });
        }
      } catch (error) {
        console.error("Error al enviar el formulario:", error);
        Toast.show({
          type: "error",
          text1: "Error al enviar el formulario",
        });
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Error: Formulario inválido",
        text2: "Por favor, complete todos los campos obligatorios",
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
    setAtributo([]);
    setResultado("");
    setNc("");
    setErrors({});
    setProceso("");
    setAccion("");
    setDescripcion("");
    setImages([]); // Resetear las imágenes
  };

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
            setAtributo([]);
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
      <UploadImg onImagesSelect={(selectedImages) => setImages(selectedImages)} />
      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Enviar Formulario</Text>
      </Pressable>
    </ScrollView>
  );
};

export default NonConformityForm;