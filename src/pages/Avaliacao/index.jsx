import React from 'react';
import { Image, View, StyleSheet, Text } from 'react-native';
import img from '../../../assets/imgs/healthy.png';

export default function Avaliacao() {
  return (
    <View style={styles.container}>
      <Image source={img} style={styles.image} resizeMode="cover" />
      <Text style={styles.text}>
        Nenhuma avaliação física cadastrada ainda...{' '}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 400,
    resizeMode: 'contain',
  },
  text: {
    alignSelf: 'center',
    padding: 10,
    fontSize: 16,
  },
});
