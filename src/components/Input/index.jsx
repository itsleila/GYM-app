import * as React from 'react';
import { HelperText, TextInput } from 'react-native-paper';

const Input = (props) => {
  return (
    <>
      <TextInput {...props} />
      {props.helpText ? (
        <HelperText type="error" visible={true}>
          {props.helpText}
        </HelperText>
      ) : null}
    </>
  );
};

export default Input;
