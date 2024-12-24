import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ViewTickets = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <View style={styles.accordion}>
      {[1, 2, 3].map((item, index) => (
        <View key={index} style={styles.accordionItem}>
          <TouchableOpacity onPress={() => toggleAccordion(index)} style={styles.accordionHeader}>
            <Text style={styles.headerText}>Ticket {item}</Text>
            <Text style={styles.headerAdd}>Fecha</Text>
            <Text style={styles.headerAdd}>Estado</Text>
          </TouchableOpacity>
          {activeIndex === index && (
            <View style={styles.accordionBody}>
              <Text>Contenido del acordeón {item}</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  accordion: {
    width: '100%',
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
    backgrounColor: '#96CCA8',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
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
  }
});

export default ViewTickets;