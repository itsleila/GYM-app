import React, { useState } from 'react';
import { View } from 'react-native';
import { RadioButton as RadioBtn, Text } from 'react-native-paper';

const RadioButton = ({ label, value }) => {
  return (
    <View
      style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}
    >
      <RadioBtn value={value} />
      <Text style={{ marginLeft: 8 }}>{label}</Text>
    </View>
  );
};

export default RadioButton;
