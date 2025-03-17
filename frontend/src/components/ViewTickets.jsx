import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Header from './header';

const ViewTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5001/get-tickets');
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();

    const intervalId = setInterval(fetchTickets, 5000); // Actualiza cada 5 segundos

    return () => clearInterval(intervalId); // Limpia el intervalo al desmontar el componente
  }, []);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <View style={styles.accordion}>
      {tickets.length === 0 ? (
        <Text style={styles.noTicketsText}>No hay tickets abiertos.</Text>
      ) : (
        tickets.map((ticket, index) => (
          <View key={index} style={styles.accordionItem}>
            <Pressable onPress={() => toggleAccordion(index)} style={styles.accordionHeader}>
              <Text style={styles.headerText}>Ticket {ticket.id}</Text>
              <Text style={styles.headerAdd}>Fecha: {formatDate(ticket.date)}</Text>
              <Text style={styles.headerAdd}>{ticket.nc_products || ticket.nc_process}</Text>
            </Pressable>
            {activeIndex === index && (
              <View style={styles.accordionBody}>
                <Text>Nombre: {ticket.user_name}</Text>
                <Text>Sección: {ticket.section}</Text>
                <Text>Forma de detección: {ticket.detection_way}</Text>
                <Text>Tipo base: {ticket.base_type}</Text>
                <Text>Tipo origen: {ticket.origin_type}</Text>
                {ticket.base_type === "Producto" ?(
                <>
                    
                  {ticket.resources_product && <Text>Producto: {ticket.resources_product}</Text>}
                  {ticket.attributes_product && <Text>Atributos del producto: {ticket.attributes_product}</Text>}
                  {ticket.result_products && <Text>Resultado: {ticket.result_products}</Text>}
                </>
                ) :null }
                {ticket.base_type === "Proceso" ?(
                <>
                  {ticket.process && <Text>Proceso: {ticket.process}</Text>}
                  {ticket.attributes_process && <Text>Atributos del proceso: {ticket.attributes_process}</Text>}
                  {ticket.action && <Text>Resultado: {ticket.action}</Text>}
                </>
                ) :null }
                
                <Text>Descripción: {ticket.description}</Text>
              </View>
            )}
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  accordion: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  accordionItem: {
    borderWidth: 1,
    borderColor: '#6BB686',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#96CCA8', 
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#96CCA8',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    height: 50, // Altura fija para los encabezados de los acordeones
    width: 320,
  },
  headerText: {
    fontWeight: 'bold',
  },
  accordionBody: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#96CCA8',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: '#B2DCBF',
    fontSize: 16,
  },
  headerAdd: {
    fontWeight: 'black',
    padding: 10,
  },
  noTicketsText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default ViewTickets;