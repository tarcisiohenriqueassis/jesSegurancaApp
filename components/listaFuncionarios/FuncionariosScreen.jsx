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

// Importa funções utilitárias para formatar CPF, nome e componente de carregamento
import formatarCpf from '../../utils/formataCPF';
import Carregando from '../../utils/carregando';
import formatarNome from '../../utils/formataNome';

export default function FuncionariosScreen() {
  // Estado que guarda a lista de funcionários
  const [funcionarios, setFuncionarios] = useState([]);
  // Estado que guarda os CPFs dos funcionários selecionados na lista
  const [selecionados, setSelecionados] = useState([]);
  // Estado para controlar a exibição do componente de carregamento
  const [carregando, setCarregando] = useState(true);
  // Estado para mostrar/ocultar o menu flutuante
  const [menuVisivel, setMenuVisivel] = useState(false);
  // Estado para armazenar texto digitado na busca
  const [busca, setBusca] = useState('');
  // Estado para armazenar lista de CPFs duplicados detectados
  const [cpfsDuplicados, setCpfsDuplicados] = useState([]);
  // Estado para indicar se há erro de CPF duplicado
  const [erroCPF, setErroCPF] = useState(false);

  // Função que busca os funcionários da API
  const buscarFuncionarios = async () => {
    // Reseta estados antes da nova busca
    setFuncionarios([]);
    setSelecionados([]);
    setCpfsDuplicados([]);
    setErroCPF(false);

    try {
      setCarregando(true); // Exibe o componente de carregamento
      // Chamada GET para buscar funcionários
      const response = await axios.get('https://api-jesseguranca.onrender.com/funcionarios');
      
      // Ordena os funcionários pelo nome (considerando regras de português)
      const listaOrdenada = response.data.sort((a, b) =>
        a.nome.localeCompare(b.nome, 'pt', { sensitivity: 'base' })
      );
      setFuncionarios(listaOrdenada);

      // Verifica CPFs duplicados na lista retornada
      const cpfs = listaOrdenada.map(f => f.cpf);
      // Filtra CPFs que aparecem mais de uma vez
      const duplicados = cpfs.filter((cpf, index, array) =>
        array.indexOf(cpf) !== index && array.lastIndexOf(cpf) === index
      );

      // Caso existam duplicados, atualiza estados e alerta usuário
      if (duplicados.length > 0) {
        setErroCPF(true);
        setCpfsDuplicados(duplicados);
        Alert.alert('Atenção', 'Há funcionários com CPFs duplicados!');
        console.log('CPFs duplicados:', duplicados);
      } else {
        setErroCPF(false);
        setCpfsDuplicados([]);
      }

    } catch (_error) {
      Alert.alert('Erro ao carregar funcionários'); // Erro na requisição
    } finally {
      setCarregando(false); // Remove o carregamento
    }
  };

  // useEffect que chama a função de busca na montagem do componente
  useEffect(() => {
    buscarFuncionarios();
  }, []);

  // Alterna a seleção de um funcionário com base no CPF
  const alternarSelecao = (cpf) => {
    setSelecionados((prev) =>
      prev.includes(cpf) ? prev.filter((item) => item !== cpf) : [...prev, cpf]
    );
  };

  // Copia para a área de transferência os funcionários selecionados, formatando o CPF
  const copiarSelecionados = async () => {
    // Filtra os funcionários selecionados e formata os dados para copiar
    const dados = funcionarios
      .filter((f) => selecionados.includes(f.cpf))
      .map((f) => `NOME: ${formatarNome(f.nome)}\nCPF: ${formatarCpf(f.cpf)}\n`)
      .join('\n');

    // Caso nenhum funcionário esteja selecionado, alerta e retorna
    if (dados.trim().length === 0) {
      Alert.alert('Nenhum funcionário selecionado.');
      return;
    }
    // Copia os dados para a área de transferência e alerta sucesso
    await Clipboard.setStringAsync(dados);
    Alert.alert('Copiado!', 'Funcionários copiados com CPF formatado.');
    setMenuVisivel(false); // Fecha o menu flutuante
  };

  // Seleciona todos os funcionários, ou desmarca todos se já estiverem selecionados
  const selecionarTodos = () => {
    if (selecionados.length === funcionarios.length) {
      setSelecionados([]); // Desmarca todos
    } else {
      const cpfs = funcionarios.map((f) => f.cpf);
      setSelecionados(cpfs); // Seleciona todos
    }
    setMenuVisivel(false); // Fecha o menu flutuante
  };

  // Filtra funcionários conforme texto digitado na busca, por nome ou CPF
  const funcionariosFiltrados = funcionarios.filter((f) =>
    f.nome.toLowerCase().includes(busca.toLowerCase()) || f.cpf.includes(busca)
  );

  // Enquanto carregando, mostra o componente de loading
  if (carregando) {
    return <Carregando />;
  }

  return (
    <View style={{ width: '100%', height: '100%' }}>
      {/* Cabeçalho com título e campo de busca */}
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

      {/* Lista de funcionários filtrados */}
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
        data={funcionariosFiltrados}
        keyExtractor={(item) => item.cpf.toString()}
        refreshing={carregando}
        onRefresh={buscarFuncionarios}
        renderItem={({ item }) => {
          // Verifica se o funcionário está selecionado
          const selecionado = selecionados.includes(item.cpf);

          return (
            <Pressable
              onPress={() => alternarSelecao(item.cpf)}
              style={[
                styles.card,
                cpfsDuplicados.includes(item.cpf) && styles.cardErro,
              ]}
            >
              {/* Checkbox personalizado */}
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

              {/* Informações do funcionário */}
              <View style={{ flex: 1 }}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 16 }}>
                  Nome: {formatarNome(item.nome)}
                </Text>
                <Text style={{ fontSize: 14, color: '#666' }}>Cpf: {item.cpf}</Text>

                {/* Botões de ação: editar e excluir */}
                <View style={{ flexDirection: 'row', marginTop: 8, gap: 12 }}>
                  {/* Botão editar */}
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

                  {/* Botão excluir */}
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
                                await axios.delete(
                                  `https://api-jesseguranca.onrender.com/funcionarios/${item.id}`
                                );
                                Alert.alert('Sucesso', 'Funcionário excluído com sucesso!');
                                buscarFuncionarios(); // Atualiza a lista após exclusão
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

      {/* Botão flutuante que abre o menu de opções */}
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

      {/* Menu flutuante com opções */}
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
            {/* Botão para selecionar ou limpar seleção de todos */}
            <Button
              title={selecionados.length === funcionarios.length ? 'Limpar Seleção' : 'Selecionar Todos'}
              onPress={selecionarTodos}
            />
            <View style={{ height: 12 }} />
            {/* Botão para copiar funcionários selecionados */}
            <Button title="Copiar selecionados" onPress={copiarSelecionados} />
            <View style={{ height: 12 }} />
            {/* Botão para atualizar a lista */}
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

// Estilos usados na tela
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
    bottom: Platform.OS === 'ios' ? 420 : 705,
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
