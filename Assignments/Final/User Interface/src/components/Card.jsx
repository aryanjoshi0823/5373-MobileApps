import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';

import candy from  '../../assets/candy.jpg'
const Card = ({ prodUrl, name, price, desc, imgUrl }) => {
  const truncateDescription = (desc) => {
    const words = desc.split(' ');
    if (words.length > 50) {
      return words.slice(0, 20).join(' ') + '...';
    }
    return desc;
  };

    return (
        <TouchableOpacity  style={styles.cardContainer} onPress={() => console.log(prodUrl)}>
          <View >
            <Image source={{ uri: imgUrl }} style={styles.cardImage} /> 
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{name}</Text>
              <Text style={styles.cardPrice}>${price}</Text>
              <Text style={styles.cardDescription}>{truncateDescription(desc)}</Text>
            </View>
          </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
      display:'flex',
      gap:10,
      alignItems:'center',
      justifyContent:'center',
      flexDirection: 'column',

      backgroundColor: '#fff', 
      borderRadius: 10,
      margin: 10,
      elevation: 5, 
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      width: '90%'
    },

    cardImage: {
      width: 250,
      height: 250,
    },

    cardContent: {
     padding:10,
     display: "flex",
     gap:5,
     flexDirection:"column",
     alignItems: "start",
    },

    cardTitle: {
     fontSize: 24,
     fontWeight:'bold',
    },

    cardPrice: {
      fontSize: 16,
      color: "rgba(0,0,0,0.8)"

    },

    cardDescription: {
      fontSize: 14,
      color: "rgba(124,124,124,0.9)"
    },
});

export default Card