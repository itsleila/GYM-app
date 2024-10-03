import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Snackbar as Snack } from 'react-native-paper';

const Snackbar = (props) => {
  return (
    <View style={styles.container}>
      <Snack {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
});

export default Snackbar;
