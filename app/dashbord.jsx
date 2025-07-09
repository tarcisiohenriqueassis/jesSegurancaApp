import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  ImageBackground,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Definições de imagens
const imagem1 = require('../assets/imagens/jes.png');
const imagem2 = require('../assets/imagens/empresa.jpeg');
const imagem3 = require('../assets/imagens/equipe1.jpeg');
const imagem4 = require('../assets/imagens/logo.jpeg');
const imagem5 = require('../assets/imagens/viatura1.jpeg');
const imagem6 = require('../assets/imagens/jesdemocrata.jpeg');

// Carrossel de imagens
const imagens = [imagem1, imagem2, imagem6, imagem3, imagem4, imagem5];

// Dimensões da tela para ajuste do layout
const { width, height } = Dimensions.get('window');

function Dashboard() {
  const [indexAtual, setIndexAtual] = useState(0); // Índice atual do carrossel
  const flatListRef = useRef(null); // Referência para o carrossel
  const navigation = useNavigation(); // Navegação entre telas

  // Atualiza o índice com base no scroll manual
  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setIndexAtual(index);
  };

  // Auto-scroll do carrossel a cada 10 segundos
  useEffect(() => {
    const intervalo = setInterval(() => {
      let proximoIndex = indexAtual + 1;
      if (proximoIndex >= imagens.length) {
        proximoIndex = 0;
      }

      flatListRef.current?.scrollToIndex({ index: proximoIndex, animated: true });
      setIndexAtual(proximoIndex);
    }, 10000); // Tempo em milissegundos

    return () => clearInterval(intervalo); // Limpa o intervalo no desmontar
  }, [indexAtual]);

  return (
    <SafeAreaView>
      <View style={{ flex: 1 }}>
        {/* Carrossel de imagens */}
        <FlatList
          ref={flatListRef}
          data={imagens}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          pagingEnabled
          onScroll={handleScroll}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <ImageBackground source={item} style={styles.imagemFundo} />
          )}
        />

        {/* Botões sobrepostos ao carrossel */}
        <View style={styles.overlay}>
          {/* Botão Vigilantes */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('vigilantes')}
          >
            <Ionicons name="person" size={40} color="#fff" />
          </TouchableOpacity>

          {/* Botão Cadastro de Vigilante */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('cadastrarVigilante')}
          >
            <Ionicons name="person-add" size={40} color="#fff" />
          </TouchableOpacity>

          {/* Botão Equipamentos */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('equipamentos')}
          >
            <Ionicons name="shirt" size={40} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Dots de paginação do carrossel */}
        <View style={styles.dots}>
          {imagens.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: i === indexAtual ? '#fff' : '#888' },
              ]}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

// Estilos da tela
const styles = StyleSheet.create({
  imagemFundo: {
    width: width,
    height: height * 0.85,
  },
  overlay: {
    position: 'absolute',
    top: '8%',
    left: '50%',
    transform: [{ translateX: -150 }],
    width: 300,
    backgroundColor: 'rgba(2, 2, 2, 0.56)',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderColor: 'rgb(173, 170, 170)',
    borderWidth: 4,
  },
  card: {
    flex: 1,
    alignItems: 'center',
  },
  dots: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default Dashboard;
