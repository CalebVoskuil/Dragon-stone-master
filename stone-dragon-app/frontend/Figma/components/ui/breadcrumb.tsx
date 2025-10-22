import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: string;
  className?: string;
}

function Breadcrumb({ items, separator = 'chevron-forward', className }: BreadcrumbProps) {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <Ionicons 
              name={separator as any} 
              size={12} 
              color="#666" 
              style={styles.separator} 
            />
          )}
          <TouchableOpacity
            onPress={item.onClick}
            disabled={!item.onClick}
            style={styles.item}
          >
            <Text style={[
              styles.text,
              !item.onClick && styles.disabledText
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  item: {
    paddingVertical: 4,
  },
  text: {
    fontSize: 14,
    color: '#58398B',
  },
  disabledText: {
    color: '#666',
  },
  separator: {
    marginHorizontal: 4,
  },
});

export { Breadcrumb };