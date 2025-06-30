import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Button,
  Alert,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import axios from 'axios';
import { router } from 'expo-router';

// Importando funções utilitárias
import formatarCpf from '../../utils/formataCPF';
import Carregando from '../../utils/carregando';
import formatarNome from '../../utils/formataNome';

export default function FuncionariosScreen() {

// Estados para gerenciar os dados dos funcionários, seleção, carregamento e visibilidade do menu
  const [funcionarios, setFuncionarios] = useState([]);
  const [selecionados, setSelecionados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [menuVisivel, setMenuVisivel] = useState(false);
  const [busca, setBusca] = useState('');
  const [cpfsDuplicados, setCpfsDuplicados] = useState([]);
  const [erroCPF, setErroCPF] = useState(false);

// Função para buscar a lista de funcionários da API
  const buscarFuncionarios = async () => {
  // Reseta os estados antes de buscar os dados
    setFuncionarios([]);
    setSelecionados([]);
    setCpfsDuplicados([]);
    setErroCPF(false);

  try {

    setCarregando(true);
    const response = await axios.get('https://api-jesseguranca.onrender.com/funcionarios');
   // Ordena a lista de funcionários pelo nome
    // Usando localeCompare para garantir a ordenação correta em português
    const listaOrdenada = response.data.sort((a, b) =>
      a.nome.localeCompare(b.nome, 'pt', { sensitivity: 'base' })
    );
    setFuncionarios(listaOrdenada);

    // Verifica CPFs duplicados
    const cpfs = listaOrdenada.map(f => f.cpf);
    const duplicados = cpfs.filter((cpf, index, array) => array.indexOf(cpf) !== index && array.lastIndexOf(cpf) === index);
    if (duplicados.length > 0) {

      setErroCPF(true);
      setCpfsDuplicados(duplicados);
      Alert.alert('Atenção', 'Há funcionários com CPFs duplicados!');
      // Exibe os CPFs duplicados no console
      console.log('CPFs duplicados:', duplicados);
    } else {
      setErroCPF(false);
      setCpfsDuplicados([]);
    }

  } catch (_error) {
    Alert.alert('Erro ao carregar funcionários');
  } finally {
    setCarregando(false);
  }
};
  // Efeito para buscar os funcionários ao montar o componente
  useEffect(() => {
    buscarFuncionarios();
  }, []);

  const alternarSelecao = (cpf) => {
    setSelecionados((prev) =>
      prev.includes(cpf) ? prev.filter((item) => item !== cpf) : [...prev, cpf]
    );
  };
  // Função para copiar os funcionários selecionados com CPF formatado
  // e exibir um alerta de confirmação
  const copiarSelecionados = async () => {
    // Verifica se há funcionários selecionados
    const dados = funcionarios
      .filter((f) => selecionados.includes(f.cpf))
      .map((f) => `NOME: ${f.nome}\nCPF: ${formatarCpf(f.cpf)}\n`)
      .join('\n');

    // Verifica se há funcionários selecionados
    if (dados.trim().length === 0) {
      Alert.alert('Nenhum funcionário selecionado.');
      return;
    }
    // Copia os dados formatados para a área de transferência
    await Clipboard.setStringAsync(dados);
    Alert.alert('Copiado!', 'Funcionários copiados com CPF formatado.');
    setMenuVisivel(false);
  };
  // Função para selecionar todos os funcionários ou desmarcar todos
  // Se todos os funcionários já estiverem selecionados, desmarca todos
  const selecionarTodos = () => {
    if (selecionados.length === funcionarios.length) {
      setSelecionados([]);
    } else {
      const cpfs = funcionarios.map((f) => f.cpf);
      setSelecionados(cpfs);
    }
    setMenuVisivel(false);
  };

  // Filtra os funcionários com base na busca por nome ou CPF
  // A busca é feita ignorando maiúsculas e minúsculas
  // e verificando se o nome contém a string de busca ou se o CPF é igual
  const funcionariosFiltrados = funcionarios.filter((f) =>
    f.nome.toLowerCase().includes(busca.toLowerCase()) || f.cpf.includes(busca)
  );
  // Se estiver carregando, exibe o componente de carregamento
  // Caso contrário, renderiza a lista de funcionários
  if (carregando) {
    return <Carregando />;
  }

  return (
    <View style={{ width: '100%', height: '100%' }}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Lista de Funcionários</Text>
        <TextInput
          placeholder="Buscar por Nome ou CPF"
          placeholderTextColor="#999"
          style={styles.inputBusca}
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      <FlatList
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
        data={funcionariosFiltrados}
        keyExtractor={(item) => item.cpf.toString()}
        renderItem={({ item }) => {
          const selecionado = selecionados.includes(item.cpf);

          return (
            <Pressable
            onPress={() => alternarSelecao(item.cpf)}
            style={[
            styles.card,
            cpfsDuplicados.includes(item.cpf) && styles.cardErro // adiciona borda vermelha se duplicado
            ]}
            >
              <View
                style={[
                  styles.checkbox,
                  { backgroundColor: selecionado ? '#007AFF' : '#FFF' },
                ]}
              >
                {selecionado && (
                  <Text style={styles.checkmark}>
                    <Ionicons name="checkmark" size={18} color="#FFF" />
                  </Text>
                )}
              </View>

              <View style={{ flex: 1 }}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 16 }}>
                  Nome: {formatarNome(item.nome)}
                </Text>
                <Text style={{ fontSize: 14, color: '#666' }}>Cpf: {item.cpf}</Text>

                <View style={{ flexDirection: 'row', marginTop: 8, gap: 12 }}>
                  {/* Editar */}
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: '../editarFuncionario',
                        params: { id: item.id, nome: item.nome, cpf: item.cpf },
                      })
                    }
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                  >
                    <Ionicons name="pencil-sharp" size={20} color="#000" />
                    <Text style={{ marginLeft: 3, fontSize: 15 }}>Editar</Text>
                  </TouchableOpacity>

                  {/* Excluir */}
                <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    'Confirmar Exclusão',
                    `Deseja excluir o funcionário "${item.nome}"?`,
                    [
                      { text: 'Cancelar', style: 'cancel' },
                      {
                        text: 'Excluir',
                        style: 'destructive',
                        onPress: async () => {
                          try {
                            await axios.delete(`https://api-jesseguranca.onrender.com/funcionarios/${item.id}`);
                            Alert.alert('Sucesso', 'Funcionário excluído com sucesso!');
                            buscarFuncionarios(); // Atualiza a lista
                          } catch (error) {
                            console.error('Erro ao excluir:', error);
                            Alert.alert('Erro', 'Não foi possível excluir o funcionário.');
                          }
                        },
                      },
                    ]
                  );
                }}
                style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}
              >
                <Ionicons name="trash" size={20} color="red" />
                <Text style={{ marginLeft: 3, fontSize: 15, color: 'red' }}>Excluir</Text>
              </TouchableOpacity>


                </View>
              </View>
            </Pressable>
          );
        }}
      />

      <TouchableOpacity
        style={styles.botaoFlutuante}
        onPress={() => setMenuVisivel(!menuVisivel)}
      >
        <Text style={{ color: 'Black', fontWeight: 'bold', fontSize: 40 }}>
          {menuVisivel ? (
            <Ionicons name="close" style={{ fontSize: 40 }} />
          ) : (
            <Ionicons name="ellipsis-vertical-circle" style={{ fontSize: 40 }} />
          )}
        </Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={menuVisivel}
        animationType={Platform.OS === 'ios' ? 'fade' : 'none'}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => setMenuVisivel(false)}
          activeOpacity={1}
        >
          <View style={styles.menuFlutuante}>
            <Button
              title={selecionados.length === funcionarios.length ? 'Limpar Seleção' : 'Selecionar Todos'}
              onPress={selecionarTodos}
            />
            <View style={{ height: 12 }} />
            <Button title="Copiar selecionados" onPress={copiarSelecionados} />
            <View style={{ height: 12 }} />
            <Button
              title="Atualizar lista"
              onPress={() => {
                buscarFuncionarios();
                setMenuVisivel(false);
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 27,
    backgroundColor: '#f9f9f9',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderRadius: 4,
  },
  checkmark: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  botaoFlutuante: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 420 : 690,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    zIndex: 10,
    shadowColor: 'transparent',
  },
  menuFlutuante: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 270 : 510,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    elevation: 6,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  inputBusca: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  cardErro: {
  borderColor: 'red',
  backgroundColor: '#ffe6e6',
},
});
