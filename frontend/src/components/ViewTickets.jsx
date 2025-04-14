import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator, Modal, FlatList, Linking, Dimensions } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';

const ViewTickets = ({ onTicketsLoaded }) => {
  const [tickets, setTickets] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  
  // Estados para el panel lateral de archivos
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [currentTicketId, setCurrentTicketId] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [fileError, setFileError] = useState(null);
  
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:5001/get-tickets');
        if (!response.ok) {
          throw new Error('Error al cargar tickets');
        }
        const data = await response.json();
        setTickets(data);
        setError(null);

        if (onTicketsLoaded) {
          onTicketsLoaded(data);
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setError('No se pudieron cargar los tickets. Intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTickets();

    const intervalId = setInterval(fetchTickets, 20000); // 10 segundos para reducir carga

    return () => clearInterval(intervalId);
  }, []);

  // Función para obtener los archivos asociados a un análisis de causa
  const fetchFilesList = async (ticketId) => {
    try {
      setLoadingFiles(true);
      setFileError(null);
      
      // Usar el endpoint correcto según la documentación proporcionada
      // El tipo es 'ticket' y el ID es el ticketId
      // Reemplazar en el endpoint la url, ahora trabajamos en local
      const response = await fetch(`http://127.0.0.1:5001/file/ticket/${ticketId}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar archivos');
      }
      
      const data = await response.json();
      setFileList(data);
    } catch (error) {
      console.error('Error fetching files:', error);
      setFileError('No se pudieron cargar los archivos asociados.');
    } finally {
      setLoadingFiles(false);
    }
  };

  // Función para descargar un archivo
  const downloadFile = async (fileId, fileName) => {
    try {
      // 
      Linking.openURL(`http://127.0.0.1:5001/file/${fileId}`);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error al descargar el archivo.');
    }
  };
  

  const viewAttachments = (ticketId) => {
    setCurrentTicketId(ticketId);
    fetchFilesList(ticketId);
    setSidebarVisible(true);
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
    setFileList([]);
    setCurrentTicketId(null);
  };

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const getSeverityStyle = (severity) => {
    if (severity?.toLowerCase().trim() === "grave") {
      return styles.severe;
    } else if (severity?.toLowerCase().trim() === "urgente") {
      return styles.urgent;
    }
    return styles.normal;
  };

  const getSeverityIcon = (severity) => {
    if (severity?.toLowerCase().trim() === "grave") {
      return "exclamation-circle";
    } else if (severity?.toLowerCase().trim() === "urgente") {
      return "exclamation-triangle";
    }
    return null;
  };

  // Componente para el renderizado de un elemento de archivo
  const FileItem = ({ item }) => {
    const getFileIcon = (type, extension) => {
      if (type === 'pdf') {
        return 'file-pdf-o';
      } else if (type === 'imagen') {
        return 'file-image-o';
      } else if (type === 'documento') {
        return extension.includes('doc') ? 'file-word-o' : 'file-excel-o';
      } else {
        return 'file-o';
      }
    };

    const formatFileSize = (bytes) => {
      if (bytes < 1024) {
        return `${bytes} B`;
      } else if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
      } else {
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
      }
    };

    return (
      <Pressable 
        style={styles.fileItem}
        onPress={() => downloadFile(item.id, item.nombre)}
      >
        <View style={styles.fileIconContainer}>
          <FontAwesome 
            name={getFileIcon(item.tipo_archivo, item.extension)}
            size={24} 
            color="#6BB686" 
          />
        </View>
        <View style={styles.fileDetails}>
          <Text style={styles.fileName} numberOfLines={1}>{item.nombre}</Text>
          <View style={styles.fileMetaData}>
            <Text style={styles.fileType}>{item.extension.toUpperCase()}</Text>
            <Text style={styles.fileSize}>{formatFileSize(item.tamano_bytes)}</Text>
            <Text style={styles.fileDate}>{new Date(item.fecha_subida).toLocaleDateString()}</Text>
          </View>
        </View>
        <FontAwesome name="download" size={18} color="#1565c0" />
      </Pressable>
    );
  };

  // Sidebar para mostrar los archivos
  const FilesSidebar = () => {
    const selectedTicket = tickets.find(t => t.id === currentTicketId);
    
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={sidebarVisible}
        onRequestClose={closeSidebar}
      >
        <View style={styles.sidebarOverlay}>
          <View style={styles.sidebar}>
            <View style={styles.sidebarHeader}>
              <View style={styles.sidebarTitle}>
                <FontAwesome name="paperclip" size={18} color="#6BB686" />
                <Text style={styles.sidebarTitleText}>
                  Archivos - Ticket {currentTicketId}
                </Text>
              </View>
              <Pressable onPress={closeSidebar} style={styles.closeButton}>
                <FontAwesome name="times" size={20} color="#555" />
              </Pressable>
            </View>

            <View style={styles.sidebarContent}>
              {loadingFiles ? (
                <View style={styles.fileLoadingContainer}>
                  <ActivityIndicator size="large" color="#6BB686" />
                  <Text style={styles.fileLoadingText}>Cargando archivos...</Text>
                </View>
              ) : fileError ? (
                <View style={styles.fileErrorContainer}>
                  <FontAwesome name="exclamation-circle" size={30} color="#d9534f" />
                  <Text style={styles.fileErrorText}>{fileError}</Text>
                  <Pressable 
                    style={styles.retryButton}
                    onPress={() => fetchFilesList(currentTicketId)}
                  >
                    <Text style={styles.retryButtonText}>Reintentar</Text>
                  </Pressable>
                </View>
              ) : fileList.length === 0 ? (
                <View style={styles.noFilesContainer}>
                  <FontAwesome name="folder-open-o" size={40} color="#6BB686" />
                  <Text style={styles.noFilesText}>No hay archivos adjuntos</Text>
                  <Text style={styles.noFilesSubText}>Los archivos que subas aparecerán aquí</Text>
                </View>
              ) : (
                <FlatList 
                  data={fileList}
                  renderItem={({ item }) => <FileItem item={item} />}
                  keyExtractor={item => item.id.toString()}
                  contentContainerStyle={styles.fileListContainer}
                />
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  if (loading && tickets.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6BB686" />
        <Text style={styles.loadingText}>Cargando tickets...</Text>
      </View>
    );
  }

  if (error && tickets.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <FontAwesome name="exclamation-triangle" size={40} color="#d9534f" />
        <Text style={styles.errorText}>{error}</Text>
        <Pressable 
          style={styles.retryButton}
          onPress={() => fetchTickets()}
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tickets de Reclamo</Text>
      
      {tickets.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <FontAwesome name="ticket" size={50} color="#6BB686" />
          <Text style={styles.noTicketsText}>No hay tickets abiertos.</Text>
          <Text style={styles.noTicketsSubText}>Los nuevos tickets aparecerán aquí.</Text>
        </View>
      ) : (
        <View style={styles.ticketList}>
          {tickets.map((ticket, index) => {
            const severity = ticket.nc_products || ticket.nc_process;
            const severityStyle = getSeverityStyle(severity);
            const severityIcon = getSeverityIcon(severity);
            
            return (
              <View key={index} style={[styles.ticketCard, activeIndex === index && styles.activeCard]}>
                <Pressable 
                  onPress={() => toggleAccordion(index)} 
                  style={[styles.ticketHeader, severityStyle]}
                >
                  <View style={styles.ticketTitleContainer}>
                    <Text style={styles.ticketId}>Ticket {ticket.id}</Text>
                    <Text style={styles.ticketDate}>{formatDate(ticket.date)}</Text>
                  </View>
                  
                  <View style={styles.statusContainer}>
                    <Text style={styles.severityText}>{severity}</Text>
                    {severityIcon && (
                      <FontAwesome
                        name={severityIcon}
                        size={18}
                        color="white"
                        style={styles.alertIcon}
                        onPress={(e) => {
                          e.stopPropagation();
                          router.push({
                            pathname: "/panel_control",
                            params: {
                              ticketId: ticket.id,
                            },
                          });
                        }}
                      />
                    )}
                    <FontAwesome 
                      name={activeIndex === index ? "chevron-up" : "chevron-down"} 
                      size={16} 
                      color="white" 
                      style={styles.chevron}
                    />
                  </View>
                </Pressable>
                
                {activeIndex === index && (
                  <View style={styles.ticketBody}>
                    <View style={styles.sectionHeader}>
                      <FontAwesome name="info-circle" size={16} color="#6BB686" />
                      <Text style={styles.sectionTitle}>Información del Ticket</Text>
                    </View>
                    
                    <View style={styles.infoSingleRow}>
                      <Text style={styles.infoLabel}>Usuario:</Text>
                      <Text style={styles.infoValue}>{ticket.user_name || 'No especificado'}</Text>
                    </View>
                    
                    <View style={styles.infoSingleRow}>
                      <Text style={styles.infoLabel}>Sección:</Text>
                      <Text style={styles.infoValue}>{ticket.section || 'No especificado'}</Text>
                    </View>
                    
                    <View style={styles.infoSingleRow}>
                      <Text style={styles.infoLabel}>Forma de detección:</Text>
                      <Text style={styles.infoValue}>{ticket.detection_way || 'No especificado'}</Text>
                    </View>
                    
                    <View style={styles.infoSingleRow}>
                      <Text style={styles.infoLabel}>Tipo base:</Text>
                      <Text style={styles.infoValue}>{ticket.base_type || 'No especificado'}</Text>
                    </View>
                    
                    <View style={styles.infoSingleRow}>
                      <Text style={styles.infoLabel}>Tipo origen:</Text>
                      <Text style={styles.infoValue}>{ticket.origin_type || 'No especificado'}</Text>
                    </View>
                    
                    {ticket.base_type === "Producto" && (
                      <>
                        <View style={styles.divider} />
                        <View style={styles.sectionHeader}>
                          <FontAwesome name="box" size={16} color="#6BB686" />
                          <Text style={styles.sectionTitle}>Información del Producto</Text>
                        </View>
                        
                        {ticket.resources_product && (
                          <View style={styles.infoSingleRow}>
                            <Text style={styles.infoLabel}>Producto:</Text>
                            <Text style={styles.infoValue}>{ticket.resources_product}</Text>
                          </View>
                        )}
                        
                        {ticket.attributes_product && (
                          <View style={styles.infoSingleRow}>
                            <Text style={styles.infoLabel}>Atributos del producto:</Text>
                            <Text style={styles.infoValue}>{ticket.attributes_product}</Text>
                          </View>
                        )}
                        
                        {ticket.result_products && (
                          <View style={styles.infoSingleRow}>
                            <Text style={styles.infoLabel}>Resultado:</Text>
                            <Text style={styles.infoValue}>{ticket.result_products}</Text>
                          </View>
                        )}
                      </>
                    )}
                    
                    {ticket.base_type === "Proceso" && (
                      <>
                        <View style={styles.divider} />
                        <View style={styles.sectionHeader}>
                          <FontAwesome name="cogs" size={16} color="#6BB686" />
                          <Text style={styles.sectionTitle}>Información del Proceso</Text>
                        </View>
                        
                        {ticket.process && (
                          <View style={styles.infoSingleRow}>
                            <Text style={styles.infoLabel}>Proceso:</Text>
                            <Text style={styles.infoValue}>{ticket.process}</Text>
                          </View>
                        )}
                        
                        {ticket.attributes_process && (
                          <View style={styles.infoSingleRow}>
                            <Text style={styles.infoLabel}>Atributos del proceso:</Text>
                            <Text style={styles.infoValue}>{ticket.attributes_process}</Text>
                          </View>
                        )}
                        
                        {ticket.action && (
                          <View style={styles.infoSingleRow}>
                            <Text style={styles.infoLabel}>Resultado:</Text>
                            <Text style={styles.infoValue}>{ticket.action}</Text>
                          </View>
                        )}
                      </>
                    )}
                    
                    <View style={styles.divider} />
                    <View style={styles.descriptionContainer}>
                      <Text style={styles.descriptionLabel}>Descripción:</Text>
                      <Text style={styles.descriptionText}>{ticket.description || 'Sin descripción'}</Text>
                    </View>
                    
                    <View style={styles.actionButtonsContainer}>
                      <Pressable 
                        style={styles.actionButton}
                        onPress={() => router.push({
                          pathname: "/panel_control",
                          params: { ticketId: ticket.id },
                        })}
                      >
                        <FontAwesome name="external-link" size={16} color="white" style={styles.buttonIcon} />
                        <Text style={styles.actionButtonText}>Gestionar Ticket</Text>
                      </Pressable>
                      
                      <Pressable 
                        style={styles.attachmentButton}
                        onPress={() => viewAttachments(ticket.id)}
                      >
                        <FontAwesome name="paperclip" size={16} color="white" style={styles.buttonIcon} />
                        <Text style={styles.actionButtonText}>Ver Archivos</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}
      
      <FilesSidebar />
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2e7d32',
    textAlign: 'center',
  },
  ticketList: {
    width: '100%',
  },
  ticketCard: {
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  activeCard: {
    shadowOpacity: 0.2,
    elevation: 5,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#6BB686',
  },
  ticketTitleContainer: {
    flexDirection: 'column',
  },
  ticketId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  ticketDate: {
    fontSize: 12,
    color: 'white',
    opacity: 0.9,
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  severityText: {
    fontWeight: 'bold',
    color: 'white',
    marginRight: 6,
  },
  alertIcon: {
    marginRight: 8,
  },
  chevron: {
    marginLeft: 6,
  },
  severe: {
    backgroundColor: '#d32f2f',
  },
  urgent: {
    backgroundColor: '#ff9800',
  },
  normal: {
    backgroundColor: '#6BB686',
  },
  ticketBody: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  infoSingleRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#555',
    marginRight: 4,
    width: '40%',
  },
  infoValue: {
    color: '#333',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#6BB686',
    marginLeft: 8,
  },
  descriptionContainer: {
    marginTop: 8,
  },
  descriptionLabel: {
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 4,
  },
  descriptionText: {
    color: '#333',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#6BB686',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    backgroundColor: '#2e7d32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding:16,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    marginBottom: 0,
  },
  attachmentButton: {
    backgroundColor: '#1565c0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6BB686',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginVertical: 16,
    fontSize: 16,
    color: '#d9534f',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#6BB686',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noTicketsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#555',
  },
  noTicketsSubText: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
  },
  
  // Estilos para el sidebar de archivos
  sidebarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
  },
  sidebar: {
    width: width * 0.75,
    backgroundColor: 'white',
    marginLeft: 'auto',
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
  },
  sidebarTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sidebarTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
    marginLeft: 8,
  },
  closeButton: {
    padding: 8,
  },
  sidebarContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  fileLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fileLoadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6BB686',
  },
  fileErrorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fileErrorText: {
    marginVertical: 16,
    fontSize: 16,
    color: '#d9534f',
    textAlign: 'center',
  },
  noFilesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noFilesText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#555',
  },
  noFilesSubText: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
  },
  fileListContainer: {
    padding: 10,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  fileIconContainer: {
    marginRight: 12, 
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  fileMetaData: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileType: {
    fontSize: 12,
    color: '#1565c0',
    fontWeight: 'bold',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  fileSize: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  fileDate: {
    fontSize: 12,
    color: '#888',
  },
});

export default ViewTickets;