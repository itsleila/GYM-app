import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RadioButton from '../../components/RadioButton/radioButton';
import RadioButtonGroup from '../../components/RadioButton/radioButtonGroup';
import IconButton from '../../components/IconButton';
import Grid from '../../components/Grid';
import { useTheme } from 'react-native-paper';
import { useSession } from '../../Services/ctx';

export default function Configuracoes() {
  const { theme, changeTheme } = useSession();
  const [valor, setValor] = useState(theme || 'automatico');

  useEffect(() => {
    setValor(theme);
  }, [theme]);

  const handleChange = (newTheme) => {
    setValor(newTheme);
    changeTheme(newTheme);
  };

  return (
    <Grid style={styles.container}>
      <Text style={styles.title}>Tema</Text>
      <RadioButtonGroup valor={valor} onValueChange={handleChange}>
        <Grid style={styles.radioContainer}>
          <Grid style={styles.radioItem}>
            <RadioButton label="Automático" value="automatico" />
            <IconButton icon="brightness-6" size={20} />
          </Grid>
          <Grid style={styles.radioItem}>
            <RadioButton label="Light" value="light" />
            <IconButton icon="white-balance-sunny" size={20} />
          </Grid>
          <Grid style={styles.radioItem}>
            <RadioButton label="Dark" value="dark" />
            <IconButton icon="moon-waxing-crescent" size={20} />
          </Grid>
        </Grid>
      </RadioButtonGroup>
    </Grid>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    margin: 10,
    backgroundColor: 'rgb(140, 51, 179)',
    borderColor: 'rgb(50, 0, 71)',
    borderWidth: 5,
    borderRadius: 10,
  },
  radioContainer: {
    backgroundColor: 'rgb(248, 216, 255)',
    padding: 20,
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
});
