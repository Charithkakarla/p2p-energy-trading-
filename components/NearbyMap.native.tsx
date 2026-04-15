import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import { MapPin } from 'lucide-react-native';
import { ThemedText } from './ThemedText';

type NearbyNode = {
  id: string;
  latitude: number;
  longitude: number;
};

type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

type Props = {
  center: Region;
  markerLabel: 'S' | 'B';
  nodes: NearbyNode[];
  radiusKm: number;
  selectedNodeId: string | null;
  userCoords: { latitude: number; longitude: number } | null;
  onSelectNode: (id: string) => void;
};

export default function NearbyMapNative({ center, markerLabel, nodes, radiusKm, selectedNodeId, userCoords, onSelectNode }: Props) {
  const origin = userCoords || { latitude: center.latitude, longitude: center.longitude };

  return (
    <MapView style={s.map} initialRegion={center} mapType="satellite" showsCompass>
      <Circle
        center={origin}
        radius={radiusKm * 1000}
        strokeWidth={2}
        strokeColor="rgba(37,99,235,0.8)"
        fillColor="rgba(37,99,235,0)"
      />

      <Marker
        coordinate={origin}
        title="You"
        description="Current/approximate location"
      >
        <View style={s.userDot}>
          <MapPin size={12} color="#fff" />
        </View>
      </Marker>

      {nodes.map((node) => (
        <Marker key={node.id} coordinate={{ latitude: node.latitude, longitude: node.longitude }} onPress={() => onSelectNode(node.id)}>
          <Pressable style={[s.pin, selectedNodeId === node.id && s.pinActive]}>
            <ThemedText style={s.pinText}>{markerLabel}</ThemedText>
          </Pressable>
        </Marker>
      ))}
    </MapView>
  );
}

const s = StyleSheet.create({
  map: { height: 300, borderRadius: 14, overflow: 'hidden' },
  userDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pin: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1d4ed8',
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinActive: {
    backgroundColor: '#0f172a',
  },
  pinText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 12,
  },
});
