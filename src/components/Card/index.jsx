import React from 'react';
import {
  Card as CardPaper,
  IconButton,
  Text,
  Button,
} from 'react-native-paper';
import { StyleSheet, Image } from 'react-native';

const Card = ({
  title,
  subtitle,
  leftIconSource,
  rightIcon,
  onRightPress,
  texts = [],
  buttons = [],
  imageSource,
  style,
  contentStyle,
  left,
  right,
}) => {
  return (
    <CardPaper style={[styles.cardContainer, style]}>
      {(title || leftIconSource || rightIcon) && (
        <CardPaper.Title
          title={title}
          subtitle={subtitle}
          left={
            left
              ? left
              : (props) =>
                  leftIconSource && (
                    <Image
                      source={leftIconSource}
                      style={[styles.leftIcon]}
                      {...props}
                    />
                  )
          }
          right={
            right
              ? right
              : (props) =>
                  rightIcon && (
                    <IconButton
                      {...props}
                      icon={rightIcon}
                      onPress={onRightPress}
                    />
                  )
          }
        />
      )}
      {texts.length > 0 && (
        <CardPaper.Content style={[styles.content, contentStyle]}>
          {texts.map((text, index) => (
            <Text key={index} style={styles.text}>
              {text}
            </Text>
          ))}
        </CardPaper.Content>
      )}
      {imageSource && (
        <CardPaper.Cover
          source={imageSource}
          resizeMode="contain"
          style={styles.image}
        />
      )}
      {buttons.length > 0 && (
        <CardPaper.Actions>
          {buttons.map((button, index) => (
            <Button key={index} onPress={button.onPress}>
              {button.label}
            </Button>
          ))}
        </CardPaper.Actions>
      )}
    </CardPaper>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 8,
    marginVertical: 8,
  },
  leftIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  image: {
    height: 150,
    width: '100%',
  },
  content: {
    marginVertical: 8,
  },
  text: {
    marginBottom: 4,
  },
});

export default Card;
