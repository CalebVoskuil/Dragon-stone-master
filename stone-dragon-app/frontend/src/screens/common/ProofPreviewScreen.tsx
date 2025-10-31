import React from 'react';
import { View, Image, Text, TouchableOpacity, Linking } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types';

type ProofPreviewRoute = RouteProp<RootStackParamList, 'ProofPreview'>;

export default function ProofPreviewScreen() {
  const route = useRoute<ProofPreviewRoute>();
  const navigation = useNavigation();
  const { url } = route.params;

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={{ position: 'absolute', top: 48, left: 12, right: 12, zIndex: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingVertical: 8, paddingHorizontal: 12, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8 }}>
          <Text style={{ color: '#fff', fontSize: 16 }}>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL(url).catch(() => {})} style={{ paddingVertical: 8, paddingHorizontal: 12, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8 }}>
          <Text style={{ color: '#fff', fontSize: 16 }}>Open</Text>
        </TouchableOpacity>
      </View>
      <Image
        source={{ uri: url }}
        style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
        onError={() => {}}
      />
    </View>
  );
}


