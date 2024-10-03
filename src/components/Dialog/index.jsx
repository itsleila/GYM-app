import * as React from 'react';
import { Text } from 'react-native';
import { Dialog as Dlg, Portal, Button } from 'react-native-paper';

const Dialog = (props) => {
  return (
    <Portal>
      <Dlg visible={props.visible} onDismiss={props.hideDialog}>
        <Dlg.Content>
          <Text style={{ fontSize: 16 }}>{props.text}</Text>
        </Dlg.Content>
        <Dlg.Actions>
          {props.actions?.map((action, index) => {
            return (
              <Button key={index} onPress={action.onPress}>
                {action.text}
              </Button>
            );
          })}
        </Dlg.Actions>
      </Dlg>
    </Portal>
  );
};

Dialog.defaultProps = {
  actions: [],
  hideDialog: () => {},
  text: '',
  title: '',
  visible: false,
};

export default Dialog;
