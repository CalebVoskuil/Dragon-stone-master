import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: number;
  className?: string;
  style?: ViewStyle;
}

function Avatar({ src, alt, fallback, size = 40, className, style }: AvatarProps) {
  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  return (
    <View style={[styles.container, avatarStyle, style]}>
      {src ? (
        <Image
          source={{ uri: src }}
          style={[styles.image, avatarStyle]}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.fallback, avatarStyle]}>
          <Text style={[styles.fallbackText, { fontSize: size * 0.4 }]}>
            {fallback || '?'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#f1f5f9',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    color: '#64748b',
    fontWeight: '500',
  },
});

export { Avatar };