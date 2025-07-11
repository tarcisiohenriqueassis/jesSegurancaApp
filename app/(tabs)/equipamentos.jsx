// Importação de pacotes e componentes do React Native
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import {
  Ionicons,
  FontAwesome6,
  FontAwesome5,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import axios from 'axios';


export default function EquipamentosScreen() {

  // Estados principais
  const [equipamentos, setEquipamentos] = useState([]); // Lista de equipamentos
  const [loading, setLoading] = useState(true); // Controle de carregamento
  const [editandoId, setEditandoId] = useState(null); // ID do item sendo editado
  const [quantidadesTemp, setQuantidadesTemp] = useState({}); // Quantidades temporárias para edição
  const [filtro, setFiltro] = useState('todos'); // Filtro ativo

  // Detecção de tema e dimensões de tela
  const theme = useColorScheme();
  const isDarkMode = theme === 'dark';
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  // URL da API
  const API_URL = 'https://api-jesseguranca.onrender.com/equipamentos';

  // Função que busca os equipamentos da API
  const carregarEquipamentos = async (mostrarLoading = true) => {
    if (mostrarLoading) setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setEquipamentos(response.data);
    } catch (error) {
      console.error('Erro ao buscar equipamentos:', error);
    } finally {
      if (mostrarLoading) setLoading(false);
    }
  };

  // Salva nova quantidade no banco via API
  const salvarQuantidade = async (id) => {
    try {
      const novaQtd = parseInt(quantidadesTemp[id], 10);
      if (!isNaN(novaQtd)) {
        await axios.put(`${API_URL}/${id}`, { quantidade: novaQtd });
        setEditandoId(null);
        carregarEquipamentos(false); // Atualiza lista após salvar
      }
    } catch (error) {
      console.error('Erro ao salvar quantidade:', error);
    }
  };

  // Carrega os dados ao abrir o componente
  useEffect(() => {
    carregarEquipamentos(true);
  }, []);

  // Associa cada nome de equipamento a um ícone
  const getIcon = (nome) => {
    const key = (nome || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    switch (key) {
      case 'capacete':
        return { lib: FontAwesome6, name: 'helmet-un' };
      case 'bone':
        return { lib: MaterialCommunityIcons, name: 'hat-fedora' };
      case 'gandola':
      case 'camisa':
        return { lib: FontAwesome5, name: 'tshirt' };
      case 'calca':
        return { lib: Ionicons, name: 'walk-outline' };
      case 'coturno':
        return { lib: FontAwesome5, name: 'shoe-prints' };
      case 'tonfa':
        return { lib: Ionicons, name: 'alert' };
      case 'cinto tatico':
      case 'cinto':
        return { lib: MaterialCommunityIcons, name: 'belt' };
      case 'radio':
        return { lib: MaterialCommunityIcons, name: 'radio-handheld' };
      default:
        return { lib: Ionicons, name: 'cube-outline' };
    }
  };

  // Aplica o filtro selecionado
  const equipamentosFiltrados =
    filtro === 'todos'
      ? equipamentos
      : equipamentos.filter((e) => e.nome.toLowerCase().includes(filtro));

  // Renderiza cada item da lista
  const renderItem = ({ item }) => {
    const icon = getIcon(item.nome);
    const IconComponent = icon.lib;
    const estaEditando = editandoId === item.id;

    return (
      <View
        style={[
          styles.card,
          { backgroundColor: isDarkMode ? '#1c1c1e' : '#fff' },
        ]}
      >
        {/* Ícone do equipamento */}
        <IconComponent name={icon.name} size={30} color={isDarkMode ? '#fff' : '#444'} />

        {/* Nome do equipamento */}
        <Text style={[styles.nome, { color: isDarkMode ? '#fff' : '#000', fontSize: isTablet ? 20 : 17 }]}>
          {item.nome}
        </Text>

        {/* Se estiver em modo de edição, mostra o input */}
        <View style={styles.controles}>
          {estaEditando ? (
            <View>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: isDarkMode ? '#fff' : '#000',
                    borderColor: isDarkMode ? '#555' : '#ccc',
                  },
                ]}
                keyboardType="numeric"
                value={String(quantidadesTemp[item.id] ?? item.quantidade)}
                onChangeText={(text) =>
                  setQuantidadesTemp((prev) => ({
                    ...prev,
                    [item.id]: text,
                  }))
                }
              />
              <TouchableOpacity onPress={() => salvarQuantidade(item.id)}>
                <Ionicons name="checkmark-circle" size={30} color="#2ecc71" />
              </TouchableOpacity>
            </View>
          ) : (
            // Caso contrário, exibe a quantidade atual
            <Text
              style={[
                styles.quantidade,
                { color: isDarkMode ? '#fff' : '#000', fontSize: isTablet ? 28 : 25 },
              ]}
            >
              {item.quantidade}
            </Text>
          )}
        </View>

        {/* Botão de editar/cancelar */}
        <TouchableOpacity
          onPress={() => {
            if (estaEditando) {
              setEditandoId(null);
            } else {
              setEditandoId(item.id);
              setQuantidadesTemp((prev) => ({
                ...prev,
                [item.id]: String(item.quantidade),
              }));
            }
          }}
        >
          <Text style={[styles.editarTexto, { color: '#007AFF' }]}>
            {estaEditando ? 'Cancelar' : 'Editar'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Tela de loading enquanto carrega
  if (loading && equipamentos.length === 0) {
    return (
      <ActivityIndicator size="large" color="#000" style={{ marginTop: 60 }} />
    );
  }

  // Renderiza a tela principal
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#000' : '#f9f9f9' },
      ]}
    >
      {/* Título */}
      <Text
        style={[
          styles.titulo,
          { color: isDarkMode ? '#fff' : '#000', fontSize: isTablet ? 28 : 24 },
        ]}
      >
        Controle de Uniformes
      </Text>

      {/* Botões de filtro */}
      <View style={styles.filtros}>
        {['todos', 'camisa', 'capacete', 'bone', 'gandola', 'radio', 'tonfa'].map((tipo) => (
          <TouchableOpacity
            key={tipo}
            onPress={() => setFiltro(tipo)}
            style={[
              styles.filtroBtn,
              {
                backgroundColor:
                  filtro === tipo ? '#007AFF' : isDarkMode ? '#333' : '#ddd',
              },
            ]}
          >
            <Text style={{ color: filtro === tipo ? '#fff' : '#000' }}>
              {tipo.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista de equipamentos */}
      {equipamentosFiltrados.length === 0 ? (
        <Text style={{ textAlign: 'center', color: '#999', marginTop: 30 }}>
          Nenhum equipamento encontrado.
        </Text>
      ) : (
        <FlatList
          data={equipamentosFiltrados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 250 }}
          refreshing={loading}
          onRefresh={() => carregarEquipamentos(false)}
        />
      )}
    </View>
  );
}

// Estilos da tela
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  titulo: {
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  filtros: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 15,
  },
  filtroBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    margin: 4,
    borderRadius: 8,
  },
  card: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    alignItems: 'center',
  },
  nome: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 12,
    textTransform: 'uppercase',
    maxWidth: 200,
  },
  controles: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  quantidade: {
    fontWeight: 'bold',
    textAlign: 'center',
    minWidth: 30,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 18,
    marginRight: 10,
    width: 60,
    textAlign: 'center',
  },
  editarTexto: {
    marginTop: 8,
    fontWeight: 'bold',
  },
});
