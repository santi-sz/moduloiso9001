// formConstants.js

export const secciones = [
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

export const subseccionesPorSeccion = {
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

export const formasDeteccion = [
  "Reclamo de un cliente",
  "Incumplimiento de standares",
  "Auditorías",
  "Inspecciones",
  "Análisis de datos",
  "Resultados de evaluaciones",
  "Resultados de mediciones",
  "Sugerencia de Mejora",
];

export const tiposBase = ["Producto", "Proceso"];

export const tiposOrigenPorBase = {
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

export const productos_materiaprima = [
  "Producto 1",
  "Producto 2",
  "Producto 3",
  "Producto 4",
  "Producto 5",
];

export const atributos = {
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

export const resultados_posibles = [
  "Aceptado",
  "Aceptado con observación",
  "Rechazado",
];

export const nc_posibles = {
  Producto: ["Grave", "Urgente", "Menor"],
  Proceso: ["Grave", "Urgente", "Menor"],
};

export const procesos = [
  "Control de recepción de materia prima/insumo",
  "Control de proceso",
  "Controles finales",
  "Controles producto",
];

export const acciones = ["Correctiva", "Plan de acción", "Correctora"];