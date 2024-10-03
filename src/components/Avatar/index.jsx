import * as React from 'react';
import { Avatar as AvatarPaper } from 'react-native-paper';
import imagemPadrao from '../../../assets/imgs/Garrafa.png';

const Avatar = (props) => {
  const { source, label, ...rest } = props;
  const imageSource = source || imagemPadrao;

  return source || !props.label ? (
    <AvatarPaper.Image {...rest} source={imageSource} />
  ) : (
    <AvatarPaper.Text label={label || '?'} {...rest} />
  );
};

export default Avatar;
