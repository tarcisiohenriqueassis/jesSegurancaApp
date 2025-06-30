import React, { useState, useRef, useEffect } from 'react';

//import axios from 'axios'; // Importa a biblioteca axios para fazer requisições HTTP

// Importa os componentes necessários do React Native
// View para contêineres, Text para textos, FlatList para listas roláveis,
import {
  View,
  FlatList,
  ImageBackground,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';

// Importa o Ionicons do Expo Vector Icons para ícones
// Neste caso, estamos usando ícones de camisa e pessoas
// para representar uniformes e vigilantes, respectivamente
import { Ionicons } from '@expo/vector-icons';

// Importa o hook useNavigation do React Navigation
// para permitir a navegação entre telas
import { useNavigation } from '@react-navigation/native'; // Importa hook navigation

// Obtém a largura da tela do dispositivo
// para definir o tamanho do carrossel
 const { width, height } = Dimensions.get('window');

const imagem1 = require('../assets/imagens/jes.png');
const imagem2 = require('../assets/imagens/jescopy.png');
const imagem3 = require('../assets/imagens/jescopy2.png');

// Cria um array de imagens para o carrossel
// As imagens são importadas de um diretório local
// Você pode substituir por suas próprias imagens
// Certifique-se de que as imagens estão no diretório correto
// e que os caminhos estão corretos
const imagens = [imagem1, imagem2, imagem3];

function Dashboard() {

  // Estado para controlar o índice atual do carrossel
  // e referência para o FlatList
  const [indexAtual, setIndexAtual] = useState(0);
  const flatListRef = useRef(null);
  const navigation = useNavigation(); // Hook para navegação

  /*
  const [quantidadeVigilantes, setQuantidadeVigilantes] = useState(0);
  const [quantidadeEquipamentos, setQuantidadeEquipamentos] = useState(0);

  // Efeito para carregar a quantidade de equipamentos
  const API_URL_EQUIPAMENTOS = 'https://api-jesseguranca.onrender.com/equipamentos';

  const carregarEquipamentos = async () => {
    try {
      const response = await axios.get(API_URL_EQUIPAMENTOS);
      setQuantidadeEquipamentos(response.data.length);
    } catch (error) {
      console.error('Erro ao buscar equipamentos:', error);
    } finally {
      carregarEquipamentos(); // Chama a função para carregar os equipamentos
    }
  };
  carregarEquipamentos(); // Chama a função para carregar os equipamentos

  // Efeito para carregar a quantidade de vigilantes
  const API_URL_VIGILANTES = 'https://api-jesseguranca.onrender.com/funcionarios';

  const carregarVigilantes = async () => {
    try {
      const response = await axios.get(API_URL_VIGILANTES);
      setQuantidadeVigilantes(response.data.length);
    } catch (error) {
      console.error('Erro ao buscar vigilantes:', error);
    } 
  };
  carregarVigilantes();
*/


  // Função para lidar com o scroll do FlatList
  // Atualiza o índice atual com base na posição do scroll
  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setIndexAtual(index);
  };
    
  // Efeito para auto-scroll do carrossel a cada 4 segundos
  // Atualiza o índice atual e faz o FlatList rolar para o próximo item
  // Reseta para o primeiro item quando chega ao final
  useEffect(() => {
    const intervalo = setInterval(() => {
      let proximoIndex = indexAtual + 1;
      if (proximoIndex >= imagens.length) {
        proximoIndex = 0;
      }
      // Rola o FlatList para o próximo índice
      // O método scrollToIndex é usado para rolar para o índice especificado
      // O parâmetro animated define se a rolagem deve ser suave ou instantânea
      flatListRef.current?.scrollToIndex({ index: proximoIndex, animated: true });
      setIndexAtual(proximoIndex);
    }, 10000); // 10 segundos

    // Limpa o intervalo quando o componente é desmontado
    // para evitar vazamentos de memória
    return () => clearInterval(intervalo);
  }, [indexAtual]);

  return ( 
    <SafeAreaView>
    <View style={{ flex: 1 }}>
      {/* Carrossel de imagens */}
      {/* FlatList é usado para criar um carrossel horizontal de imagens */}
      {/* O onScroll é usado para capturar o evento de rolagem e atualizar o índice atual */}
      {/* O pagingEnabled permite que o FlatList role uma página por vez */}
      {/* O showsHorizontalScrollIndicator desativa o indicador de rolagem horizontal */}
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

      {/* Cards fixos sobre o carrossel */}
      <View style={styles.overlay}>

  {/* Botão Vigilantes */}
  <TouchableOpacity
    style={styles.card}
    onPress={() => navigation.navigate('vigilantes')}
  >
    <Ionicons name="people" size={40} color="#fff" />
  </TouchableOpacity>

  {/* Botão Cadastrar */}
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

      {/* Dots indicativos */}
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

const styles = StyleSheet.create({

  imagemFundo: {
    width: width,
    height: height * 0.85, // 85% da altura da tela
  },
  overlay: {
  position: 'absolute',
  top: '20%',
  left: '50%',
  transform: [{ translateX: -150 }], // Metade da largura do overlay
  width: 300,
  backgroundColor: 'rgba(2, 2, 2, 0.86)',
  borderRadius: 15,
  padding: 20,
  flexDirection: 'row',
  justifyContent: 'space-around',
  borderColor: 'rgb(173, 170, 170)',
  borderStyle: 'solid',
  borderWidth: 4,
},
  card: {
    flex: 1,
    alignItems: 'center',
  },
  dots: {
    position: 'absolute',
    bottom:30,
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
