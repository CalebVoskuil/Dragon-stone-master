import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform, Animated } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';

/**
 * CustomTabBar - Glassmorphic bottom navigation
 * Custom tab bar with blur effect matching Stone Dragon design
 */
export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const animatedValue = useRef(new Animated.Value(state.index)).current;
  const totalTabs = state.routes.length;
  const tabWidth = 100 / totalTabs;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: state.index,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [state.index, animatedValue]);

  return (
    <BlurView
      intensity={40}
      tint="default"
      style={[styles.container, { paddingBottom: insets.bottom }]}
    >
      <View style={styles.tabBar}>
        {/* Animated indicator */}
        <Animated.View
          style={[
            styles.indicator,
            {
              width: `${tabWidth}%`,
              left: animatedValue.interpolate({
                inputRange: state.routes.map((_, i) => i),
                outputRange: state.routes.map((_, i) => `${i * tabWidth}%`),
              }),
            },
          ]}
        />
        
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          // Get icon from options
          const IconComponent = options.tabBarIcon;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tab}
              activeOpacity={0.7}
            >
              {/* Icon */}
              {IconComponent && (
                <View style={styles.iconContainer}>
                  {IconComponent({
                    focused: isFocused,
                    color: isFocused ? Colors.light : Colors.deepPurple,
                    size: 24,
                  })}
                </View>
              )}

              {/* Label */}
              <Text
                style={[
                  styles.label,
                  { color: isFocused ? Colors.light : Colors.deepPurple },
                ]}
                numberOfLines={1}
              >
                {typeof label === 'string' ? label : ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 0, // Removed border for seamless blur effect
    backgroundColor: 'transparent', // Pure blur effect - transparent until content passes behind
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tabBar: {
    flexDirection: 'row',
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.xs,
    position: 'relative',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    minHeight: 56,
    justifyContent: 'center',
    position: 'relative',
    zIndex: 2,
  },
  indicator: {
    position: 'absolute',
    top: spacing.sm,
    bottom: 0,
    marginHorizontal: spacing.xs,
    backgroundColor: Colors.deepPurple,
    borderRadius: Sizes.radiusLg,
    zIndex: 1,
  },
  iconContainer: {
    marginBottom: 2,
    zIndex: 10,
  },
  label: {
    fontSize: Sizes.fontXs,
    fontWeight: '600',
    zIndex: 10,
  },
});

