import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, useColorScheme } from 'react-native';

export default function Carregando() {
  // Detecta se o tema atual é dark ou claro
  const isDark = useColorScheme() === 'dark';

  return (
    <View style={styles.centered}>
      {/* Indicador de carregamento animado */}
      <ActivityIndicator size="large" color={isDark ? '#fff' : '#007AFF'} />
      
      {/* Texto informando que está carregando */}
      <Text style={[styles.texto, { color: isDark ? '#fff' : '#333' }]}>
        Carregando ...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,               // Ocupa toda a tela
    justifyContent: 'center', // Centraliza verticalmente
    alignItems: 'center',     // Centraliza horizontalmente
  },
  texto: {
    marginTop: 10,        // Espaço acima do texto
    fontSize: 16,         // Tamanho da fonte
    fontWeight: '500',    // Peso da fonte
  },
});
