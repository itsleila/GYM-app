import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Modal as PaperModal,
  Portal,
  Provider as PaperProvider,
} from 'react-native-paper';

const Modal = ({ visible, onDismiss, children }) => {
  return (
    <PaperProvider>
      <Portal>
        <PaperModal
          visible={visible}
          onDismiss={onDismiss}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalContent}>{children}</View>
        </PaperModal>
      </Portal>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 30,
    borderRadius: 20,
  },
});

export default Modal;
