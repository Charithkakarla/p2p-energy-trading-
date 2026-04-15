import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Map, Overlay, GeoJson } from 'pigeon-maps';
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

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function toDegrees(value: number) {
  return (value * 180) / Math.PI;
}

function buildCircleGeoJson(
  origin: [number, number],
  radiusKm: number,
  points = 64
) {
  const earthRadiusKm = 6371;
  const [latDeg, lonDeg] = origin;
  const lat1 = toRadians(latDeg);
  const lon1 = toRadians(lonDeg);
  const angularDistance = radiusKm / earthRadiusKm;

  const ring: [number, number][] = [];

  for (let i = 0; i <= points; i += 1) {
    const bearing = toRadians((i / points) * 360);
    const lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(angularDistance) +
        Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(bearing)
    );

    const lon2 =
      lon1 +
      Math.atan2(
        Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(lat1),
        Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(lat2)
      );

    // GeoJSON coordinates are [longitude, latitude]
    ring.push([toDegrees(lon2), toDegrees(lat2)]);
  }

  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [ring],
        },
        properties: {},
      },
    ],
  };
}

export default function NearbyMapWeb({ center, markerLabel, nodes, radiusKm, selectedNodeId, userCoords, onSelectNode }: Props) {
  const origin: [number, number] = [userCoords?.latitude || center.latitude, userCoords?.longitude || center.longitude];
  const circleGeoJson = buildCircleGeoJson(origin, radiusKm);

  return (
    <View style={s.wrap}>
      <Map defaultCenter={[center.latitude, center.longitude]} defaultZoom={12} provider={satelliteProvider} height={300}>
        <GeoJson
          data={circleGeoJson}
          svgAttributes={{
            fill: 'transparent',
            stroke: 'rgba(37,99,235,0.85)',
            strokeWidth: 2,
          }}
        />

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
