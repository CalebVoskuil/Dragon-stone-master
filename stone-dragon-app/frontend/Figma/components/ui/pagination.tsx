import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.pageButton,
            i === currentPage && styles.activePageButton
          ]}
          onPress={() => onPageChange(i)}
        >
          <Text style={[
            styles.pageText,
            i === currentPage && styles.activePageText
          ]}>
            {i}
          </Text>
        </TouchableOpacity>
      );
    }
    
    return pages;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.navButton, currentPage === 1 && styles.disabledButton]}
        onPress={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <Ionicons name="chevron-back" size={16} color={currentPage === 1 ? '#ccc' : '#333'} />
        <Text style={[styles.navText, currentPage === 1 && styles.disabledText]}>Previous</Text>
      </TouchableOpacity>
      
      {renderPageNumbers()}
      
      <TouchableOpacity
        style={[styles.navButton, currentPage === totalPages && styles.disabledButton]}
        onPress={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <Text style={[styles.navText, currentPage === totalPages && styles.disabledText]}>Next</Text>
        <Ionicons name="chevron-forward" size={16} color={currentPage === totalPages ? '#ccc' : '#333'} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
  navText: {
    fontSize: 14,
    color: '#333',
  },
  disabledText: {
    color: '#ccc',
  },
  pageButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 36,
    alignItems: 'center',
  },
  activePageButton: {
    backgroundColor: '#58398B',
  },
  pageText: {
    fontSize: 14,
    color: '#333',
  },
  activePageText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export { Pagination };
