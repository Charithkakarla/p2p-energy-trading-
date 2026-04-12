import { View, type ViewProps } from 'react-native';
import { Colors } from '../constants/Colors';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = Colors.light.background; // Simplest: white default.
  // Actually, I'll use the Colors constant to support both.
  
  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
