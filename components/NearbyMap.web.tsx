import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Map, Overlay } from 'pigeon-maps';
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

function satelliteProvider(x: number, y: number, z: number) {
  return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;
}

function getApproxRadiusPixels(radiusKm: number, latitude: number, zoom = 12) {
  const metersPerPixel =
    (156543.03392 * Math.cos((latitude * Math.PI) / 180)) / Math.pow(2, zoom);
  return Math.max(12, Math.min(320, (radiusKm * 1000) / metersPerPixel));
}

export default function NearbyMapWeb({ center, markerLabel, nodes, radiusKm, selectedNodeId, userCoords, onSelectNode }: Props) {
  const origin: [number, number] = [userCoords?.latitude || center.latitude, userCoords?.longitude || center.longitude];
  const radiusPx = getApproxRadiusPixels(radiusKm, origin[0]);
  const diameterPx = radiusPx * 2;

  return (
    <View style={s.wrap}>
      <Map defaultCenter={[center.latitude, center.longitude]} defaultZoom={12} provider={satelliteProvider} height={300}>
        <Overlay anchor={origin} offset={[diameterPx / 2, diameterPx / 2]}>
          <View
            pointerEvents="none"
            style={[
              s.radiusRing,
              {
                width: diameterPx,
                height: diameterPx,
                borderRadius: radiusPx,
              },
            ]}
          />
        </Overlay>

        <Overlay anchor={origin} offset={[12, 12]}>
          <View style={s.userDot}>
            <MapPin size={12} color="#fff" />
          </View>
        </Overlay>

        {nodes.map((node) => (
          <Overlay key={node.id} anchor={[node.latitude, node.longitude]} offset={[12, 12]}>
            <Pressable onPress={() => onSelectNode(node.id)} style={[s.pin, selectedNodeId === node.id && s.pinActive]}>
              <ThemedText style={s.pinText}>{markerLabel}</ThemedText>
            </Pressable>
          </Overlay>
        ))}
      </Map>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { height: 300, borderRadius: 14, overflow: 'hidden' },
  radiusRing: {
    borderWidth: 2,
    borderColor: 'rgba(37,99,235,0.85)',
    backgroundColor: 'rgba(37,99,235,0.15)',
  },
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
