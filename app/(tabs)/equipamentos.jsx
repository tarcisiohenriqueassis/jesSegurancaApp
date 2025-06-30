import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {
  Ionicons,
  FontAwesome6,
  FontAwesome5,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import axios from 'axios';

export default function EquipamentosScreen() {
  const [equipamentos, setEquipamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editandoId, setEditandoId] = useState(null);
  const [quantidadesTemp, setQuantidadesTemp] = useState({});

  const API_URL = 'https://api-jesseguranca.onrender.com/equipamentos';

  const carregarEquipamentos = async () => {
    try {
      const response = await axios.get(API_URL);
      setEquipamentos(response.data);
    } catch (error) {
      console.error('Erro ao buscar equipamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const alterarQuantidade = async (id, tipo) => {
    try {
      await axios.post(`${API_URL}/${id}/${tipo}`);
      carregarEquipamentos();
    } catch (error) {
      console.error(`Erro ao ${tipo} quantidade:`, error);
    }
  };

  const salvarQuantidade = async (id) => {
    try {
      const novaQtd = parseInt(quantidadesTemp[id], 10);
      if (!isNaN(novaQtd)) {
        await axios.put(`${API_URL}/${id}`, { quantidade: novaQtd });
        setEditandoId(null);
        carregarEquipamentos();
      }
    } catch (error) {
      console.error('Erro ao salvar quantidade:', error);
    }
  };

  useEffect(() => {
    carregarEquipamentos();
  }, []);

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

  const renderItem = ({ item }) => {
    const icon = getIcon(item.nome);
    const IconComponent = icon.lib;
    const estaEditando = editandoId === item.id;

    return (
      <View style={styles.card}>
        <IconComponent name={icon.name} size={30} color="#444" />
        <Text style={styles.nome}>{item.nome}</Text>

        <View style={styles.controles}>
          {estaEditando ? (
            <>
              <TextInput
                style={styles.input}
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
            </>
          ) : (
            <>
              <TouchableOpacity
                disabled={estaEditando}
                onPress={() => alterarQuantidade(item.id, 'remove')}
              >
                <Ionicons name="remove-circle" size={30} color="#e74c3c" />
              </TouchableOpacity>

              <Text style={styles.quantidade}>{item.quantidade}</Text>

              <TouchableOpacity
                disabled={estaEditando}
                onPress={() => alterarQuantidade(item.id, 'add')}
              >
                <Ionicons name="add-circle" size={30} color="#2ecc71" />
              </TouchableOpacity>
            </>
          )}
        </View>

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
          <Text style={styles.editarTexto}>
            {estaEditando ? 'Cancelar' : 'Editar'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#000" style={{ marginTop: 60 }} />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Controle de Uniformes</Text>
 
      {equipamentos.length === 0 ? (
        <Text style={styles.vazio}>Nenhum equipamento encontrado.</Text>
      ) : (
        <FlatList
          data={equipamentos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 250 }}
        />
        
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingBottom:0,
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  vazio: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    alignItems: 'center',
  },
  nome: {
    textAlign: 'center',
    width: Platform.OS === 'ios' ? 100 : 150,
    backgroundColor: 'white',
    fontSize: Platform.OS === 'ios' ? 16 : 17,
    fontWeight:'bold',
    marginTop: 8,
    marginBottom: 12,
    color: '#000',
    textTransform:'uppercase'
  },
  controles: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  quantidade: {
    fontSize: 25,
    fontWeight: 'bold',
    minWidth: 30,
    textAlign: 'center',
    marginHorizontal: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 18,
    marginRight: 10,
    width: 60,
    textAlign: 'center',
  },
  editarTexto: {
    color: '#007AFF',
    marginTop: 8,
    fontWeight: 'bold',
  },
});
