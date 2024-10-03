import * as React from 'react';
import { StyleSheet } from 'react-native';
import { SegmentedButtons as SegmentedBtn } from 'react-native-paper';

const SegmentedButtons = (props) => {
  return <SegmentedBtn {...props} />;
};

const styles = StyleSheet.create({
  segmentedButtons: {
    marginVertical: 10,
  },
});

export default SegmentedButtons;
