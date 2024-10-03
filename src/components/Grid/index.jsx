import { View, StyleSheet } from 'react-native';
import { Surface } from 'react-native-paper';

const Grid = (props) =>
  props.elevation ? (
    <Surface style={[styles.surface, props.style]}>
      <View style={styles.content}>{props.children}</View>
    </Surface>
  ) : (
    <View style={[props.style]}>{props.children}</View>
  );

const styles = StyleSheet.create({
  surface: {
    padding: 16,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
});

export default Grid;
