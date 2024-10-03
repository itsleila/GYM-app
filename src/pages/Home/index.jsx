import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import img from '../../../assets/imgs/banner.png';
import Card from '../../components/Card';
import { useNavigation } from '@react-navigation/native';
import segunda from '../../../assets/imgs/days/segunda.png';
import terca from '../../../assets/imgs/days/terca.png';
import quarta from '../../../assets/imgs/days/quarta.png';
import quinta from '../../../assets/imgs/days/quinta.png';
import sexta from '../../../assets/imgs/days/sexta.png';
import sabado from '../../../assets/imgs/days/sabado.png';
import domingo from '../../../assets/imgs/days/domingo.png';

const diasSemana = [
  { title: 'Segunda-feira', image: segunda },
  { title: 'Terça-feira', image: terca },
  { title: 'Quarta-feira', image: quarta },
  { title: 'Quinta-feira', image: quinta },
  { title: 'Sexta-feira', image: sexta },
  { title: 'Sabado', image: sabado },
  { title: 'Domingo', image: domingo },
];

const Home = () => {
  const navigation = useNavigation();
  return (
    <ScrollView>
      <Image source={img} style={styles.image} resizeMode="cover" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Rotina de Treinos</Text>
      </View>

      {diasSemana.map((dia, index) => (
        <Card
          key={index}
          style={styles.card}
          title={dia.title}
          leftIconSource={dia.image}
          rightIcon="arrow-right"
          onRightPress={() => navigation.navigate(dia.title)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    flex: 1,
    marginTop: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  card: {
    marginBottom: 8,
    marginHorizontal: 16,
  },
  image: {
    marginTop: 5,
    width: '90%',
    height: 350,
    alignSelf: 'center',
  },
});

export default Home;
