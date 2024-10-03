import { Button as Btn } from 'react-native-paper';

const Index = ({ children, ...props }) => {
  return <Btn {...props}>{children}</Btn>;
};

export default Index;
