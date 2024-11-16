from enum import Enum

class Section(Enum): 
    aliments = "Fábrica de alimentos"
    faena = "Faena"
    cheese =  "Producción de Quesos"
    milk = "Producción de Leche: Tambo"
    delivery = "Reparto"
    pig = "Producción de Cerdos"
    adm = "Administración"
    mantenaince = "Mantenimiento"

class SubSection(Enum):
    # Fábrica de alimentos
    ensilado_deposito = "Ensilado/Depósito"
    tostadora = "Tostadora"
    mixado = "Mixado"
    pesadas_insumos_alimentos = "Pesadas de Insumos/ Alimentos"
    despacho_deposito = "Despacho / Depósito"
    instalaciones_generales_alimentos = "Instalaciones Generales"

    # Producción de pollos
    galpon_1 = "Galpón 1"
    galpon_2 = "Galpón 2"
    galpon_3 = "Galpón 3"
    galpon_4 = "Galpón 4"
    galpon_5 = "Galpón 5"
    galpon_6 = "Galpón 6"
    instalaciones_generales_pollos = "Instalaciones Generales"

    # Faena
    transporte_pollos = "Transporte de pollos"
    sala_espera = "Sala de espera"
    sala_degolle = "Sala de degolle"
    sala_pelado = "Sala de pelado"
    sala_faena = "Sala de faena"
    instalaciones_generales_faena = "Instalaciones Generales"

    # Producción de quesos
    sala_elaboracion = "Sala de elaboración"
    sala_caldera = "Sala caldera"
    sala_despacho = "Sala despacho"
    camara_1_quesos = "Cámara 1"
    cadena_frio_quesos = "Cadena de Frío"
    camara_2_quesos = "Cámara 2"
    zotano = "Zotano"
    pileta_efluentes_quesos = "Pileta efluentes"
    pesadas_productos_despachados_quesos = "Pesadas de Productos despachados"

    # Producción de Leche: Tambo
    rodeo_vacas_produccion = "Rodeo vacas en producción"
    sala_ordene = "Sala de ordeñe"
    sala_tina_leche = "Sala tina de leche"
    rodeo_vacas_espera = "Rodeo de vacas en espera"
    rodeo_vaquillas_jovenes = "Rodeo vaquillas jóvenes"
    rodeo_terneras = "Rodeo terneras"
    rodeo_descarte_terneros = "Rodeo descarte y terneros"
    terreno_pastoreo_propio = "Terreno de Pastoreo propio"
    terreno_pastoreo_alquilado_1 = "Terreno de pastoreo alquilado 1"
    terreno_pastoreo_alquilado_2 = "Terreno de Pastoreo alquilado 2"
    pileta_efluentes_tambo = "Pileta efluentes"

    # Reparto
    camara_1_pollos_a = "Cámara 1: Pollos A"
    camara_2_pollos_b = "Cámara 2: Pollos B"
    cadena_frio_reparto = "Cadena de frío"
    sala_despacho_reparto = "Sala despacho"
    transporte_reparto = "Transporte"
    pesadas_productos_despachados_reparto = "Pesadas de Productos Despachados"

    # Administración
    deposito_archivo = "Depósito/Archivo"
    gerencia = "Gerencia"
    contabilidad = "Contabilidad"
    ventas_alimentos = "Ventas Alimentos"
    ventas_reparto = "Ventas Reparto"
    backup = "Back-Up"

    # Mantenimiento
    mantenimiento_1er_nivel = "Mantenimiento de 1er Nivel (Operarios)"
    mantenimiento_correctivo = "Mantenimiento Correctivo"
    mantenimiento_preventivo = "Mantenimiento preventivo"
    plan_verificacion_instrumentos = "Plan de verificación de instrumentos"
    plan_control_parametros_procesos = "Plan de Control de Parámetros de Procesos"
    
class DetectionWay(Enum):
    reclamo_cliente = "Reclamo de un cliente"
    incumplimiento_estandares = "Incumplimiento de standares"
    auditorias = "Auditorías"
    inspecciones = "Inspecciones"
    analisis_datos = "Análisis de datos"
    resultados_evaluaciones = "Resultados de evaluaciones"
    resultados_mediciones = "Resultados de mediciones"
    sugerencia_mejora = "Sugerencia de Mejora"

class BaseType(Enum):
    product = "Producto"
    process = "Proceso"

class OriginType(Enum):
    # Producto
    materia_prima = "Materia prima"

    # Proceso
    mano_obra = "Mano de Obra"
    metodos = "Métodos"
    maquinaria = "Maquinaria"
    infraestructura = "Infraestructura"
    servicios = "Servicios"
    medio_ambiente = "Medio Ambiente"
    higiene_seguridad = "Higiene y Seguridad"
    transporte = "Transporte"
    
# class Products(Enum): los productos se obtienen de la database.

class ProductAttributes(Enum):
    cantidad = "Cantidad"
    calidad = "Calidad"
    ph = "Ph"
    dimension = "Dimensión"
    peso = "Peso"
    sabor = "Sabor"
    humedad = "Humedad"
    olor = "Olor"    
    
class ProcessAttributes(Enum):
    plazo_entrega = "Plazo entrega"
    humedad = "Humedad"
    higiene = "Higiene"
    seguridad = "Seguridad"
    temperatura = "Temperatura"
    
class ProductResult(Enum):
    accepted = "Aceptado"
    accepted_with_obs = "Aceptado con observación"
    rejected = "Rechazado"
    
class NcResult(Enum):
    grave = "Grave"
    urgent = "Urgente"
    minor = "Menor"
    
class Process(Enum):
    control_reception_mp_insumo = "Control de recepción de materia prima/insumo"
    control_process = "Control de proceso"
    final_controls = "Controles finales"
    product_controls = "Controles producto"

class Action(Enum):
    corrective = "Correctiva"
    action_plan = "Plan de acción"
    correctora = "Correctora"