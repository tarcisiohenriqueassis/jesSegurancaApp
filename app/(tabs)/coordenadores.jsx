// Importa dependências do React e componentes do React Native
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,ActivityIndicator,
} from 'react-native';

import axios from 'axios';

// Componente principal da tela de Coordenadores
export default function CoordenadoresScreen() {
  // Estados para coordenadores, equipamentos, quantidades, etc.
  const [coordenadores, setCoordenadores] = useState([]);
  const [equipamentos, setEquipamentos] = useState([]);
  const [quantidades, setQuantidades] = useState({});
  const [novoNome, setNovoNome] = useState('');
  const [expandido, setExpandido] = useState(null); // ID do coordenador expandido
  const [editandoId, setEditandoId] = useState(null); // ID do coordenador em edição
  const [nomeEditado, setNomeEditado] = useState(''); // Nome temporário para edição
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);


  // URLs das APIs utilizadas
  const API_COORD = 'https://api-jesseguranca.onrender.com/coordenadores';
  const API_EQP = 'https://api-jesseguranca.onrender.com/equipamentos';
  const API_DISTRIB = 'https://api-jesseguranca.onrender.com/distribuicao';

  // Função para atualizar a lista ao puxar para baixo (pull-to-refresh)
  const onRefresh = async () => {
    setRefreshing(true);
    await carregarCoordenadores();
    await carregarEquipamentos();
    setRefreshing(false);
  };

  // Carrega coordenadores e equipamentos ao montar o componente
  useEffect(() => {
    carregarCoordenadores();
    carregarEquipamentos();
  }, []);

  // Busca lista de coordenadores da API
 const carregarCoordenadores = async () => {
  try {
    setLoading(true); // Mostra o loading
    const res = await axios.get(API_COORD);
    setCoordenadores(res.data);
  } catch (error) {
    console.error('Erro ao carregar coordenadores:', error);
  } finally {
    setLoading(false); // Esconde o loading
  }
};


  // Busca lista de equipamentos da API
  const carregarEquipamentos = async () => {
    try {
      const res = await axios.get(API_EQP);
      setEquipamentos(res.data);
    } catch (error) {
      console.error('Erro ao carregar equipamentos:', error);
    }
  };

  // Busca distribuição de equipamentos para um coordenador específico
  const carregarDistribuicao = async (coordenadorId) => {
    try {
      const res = await axios.get(`${API_DISTRIB}/${coordenadorId}`);
      const distrib = {};
      res.data.forEach((item) => {
        distrib[item.equipamento_id] = item.quantidade;
      });
      setQuantidades(distrib);
    } catch (error) {
      console.error('Erro ao carregar distribuição:', error);
    }
  };

  // Atualiza a quantidade de um equipamento para um coordenador
  const atualizarQuantidade = async (equipamentoId, texto, coordenadorId) => {
    // Remove espaços e tenta converter para número inteiro
    const novaQuantidade = parseInt(texto.trim(), 10);

    // Validação de quantidade
    if (isNaN(novaQuantidade) || novaQuantidade < 0) {
      Alert.alert('Quantidade inválida', 'Informe um número inteiro maior ou igual a zero.');
      return;
    }

    // Verifica se existe estoque suficiente
    const equipamento = equipamentos.find((e) => e.id === equipamentoId);
    if (!equipamento) return;

    if (novaQuantidade > equipamento.quantidade) {
      Alert.alert(
        'Quantidade inválida',
        `Não é possível atribuir mais do que o estoque disponível (${equipamento.quantidade}).`
      );
      return;
    }

    // Atualiza o estado local para refletir imediatamente
    setQuantidades((prev) => ({
      ...prev,
      [equipamentoId]: novaQuantidade,
    }));

    // Atualiza no backend
    try {
      await axios.post(`${API_DISTRIB}`, {
        coordenador_id: coordenadorId,
        equipamento_id: equipamentoId,
        quantidade: novaQuantidade,
      });
      await carregarEquipamentos(); // Atualiza o estoque total
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a quantidade.');
    }
  };

  // Cria um novo perfil de coordenador
  const criarNovoPerfil = async () => {
    if (novoNome.trim() === '') return;

    // Limite de perfis
    if (coordenadores.length >= 10) {
      Alert.alert('Limite atingido', 'Você pode ter no máximo 10 perfis.');
      return;
    }

    try {
      await axios.post(API_COORD, { nome: novoNome.trim() });
      setNovoNome('');
      carregarCoordenadores();
    } catch (error) {
      console.error('Erro ao criar perfil:', error);
      Alert.alert('Erro', 'Não foi possível criar o perfil.');
    }
  };

  // Expande ou recolhe o card do coordenador e carrega distribuição
  const toggleExpandido = async (coordenador) => {
    if (expandido === coordenador.id) {
      setExpandido(null);
    } else {
      setExpandido(coordenador.id);
      await carregarDistribuicao(coordenador.id);
    }
  };

  // Inicia modo de edição do nome do coordenador
  const iniciarEdicao = (coordenador) => {
    setEditandoId(coordenador.id);
    setNomeEditado(coordenador.nome);
  };

  // Salva edição do nome do coordenador
  const salvarEdicao = async () => {
    if (nomeEditado.trim() === '') {
      Alert.alert('Erro', 'O nome não pode ficar vazio.');
      return;
    }
    try {
      await axios.put(`${API_COORD}/${editandoId}`, { nome: nomeEditado.trim() });
      setEditandoId(null);
      setNomeEditado('');
      carregarCoordenadores();
    } catch (error) {
      console.error('Erro ao salvar edição:', error);
      Alert.alert('Erro', 'Não foi possível salvar a edição.');
    }
  };

  // Cancela edição do nome do coordenador
  const cancelarEdicao = () => {
    setEditandoId(null);
    setNomeEditado('');
  };

  // Apaga um coordenador após confirmação
  const apagarCoordenador = (id) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja apagar este coordenador?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`${API_COORD}/${id}`);
              if (expandido === id) setExpandido(null);
              carregarCoordenadores();
            } catch (error) {
              console.error('Erro ao apagar coordenador:', error);
              Alert.alert('Erro', 'Não foi possível apagar o coordenador.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Renderiza um item de equipamento para o coordenador expandido
  const renderEquipamento = (item, coordenadorId) => {
  return (
    <View key={item.id} style={styles.item}>
      <Text style={styles.nome}>{item.nome}</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={quantidades[item.id]?.toString() ?? ''}
        onChangeText={(text) => {
          setQuantidades((prev) => ({
            ...prev,
            [item.id]: text,
          }));
        }}
        onEndEditing={() => {
          const texto = quantidades[item.id]?.toString().trim();
          const valor = texto === '' ? 0 : parseInt(texto, 10);

          if (isNaN(valor) || valor < 0) {
            Alert.alert('Quantidade inválida', 'Informe um número inteiro maior ou igual a zero.');
            setQuantidades((prev) => ({
              ...prev,
              [item.id]: '0',
            }));
            return;
          }

          const equipamento = equipamentos.find((e) => e.id === item.id);
          if (!equipamento) return;

          if (valor > equipamento.quantidade) {
            Alert.alert(
              'Quantidade inválida',
              `Não é possível atribuir mais do que o estoque disponível (${equipamento.quantidade}).`
            );
            setQuantidades((prev) => ({
              ...prev,
              [item.id]: equipamento.quantidade.toString(),
            }));
            return;
          }

          atualizarQuantidade(item.id, valor.toString(), coordenadorId);
        }}
      />
      <Text style={styles.qtdTotal}>Estoque: {item.quantidade}</Text>
    </View>
  );
};
  return (
  <View style={styles.container}>
    <Text style={styles.titulo}>Perfis de Coordenadores</Text>

    <View style={styles.novoPerfilContainer}>
      <TextInput
        style={styles.inputNovo}
        placeholder="Nome do novo perfil"
        value={novoNome}
        onChangeText={setNovoNome}
      />
      <TouchableOpacity onPress={criarNovoPerfil} style={styles.botaoCriar}>
        <Text style={styles.botaoCriarTexto}>Criar</Text>
      </TouchableOpacity>
    </View>

    {loading ? (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Carregando coordenadores...</Text>
      </View>
    ) : coordenadores.length === 0 ? (
      <Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhum coordenador criado ainda.</Text>
    ) : (
      <FlatList
        data={coordenadores}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10 }}>
            <View
              style={[
                styles.botaoCoord,
                expandido === item.id && styles.botaoAtivo,
                { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
              ]}
            >
              {editandoId === item.id ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                  <TextInput
                    style={[styles.inputNovo, { flex: 1, backgroundColor: '#fff', paddingVertical: 4, marginRight: 10 }]}
                    value={nomeEditado}
                    onChangeText={setNomeEditado}
                    autoFocus
                  />
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={salvarEdicao} style={[styles.botaoPequeno, { backgroundColor: '#28a745', marginRight: 5 }]}>
                      <Text style={styles.botaoPequenoTexto}>Salvar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={cancelarEdicao} style={[styles.botaoPequeno, { backgroundColor: '#6c757d' }]}>
                      <Text style={styles.botaoPequenoTexto}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                  <TouchableOpacity style={{ flex: 1 }} onPress={() => toggleExpandido(item)}>
                    <Text style={[styles.textoCoord, { color: '#000' }]}>{item.nome}</Text>
                  </TouchableOpacity>
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => iniciarEdicao(item)} style={[styles.botaoPequeno, { backgroundColor: '#ffc107', marginRight: 5 }]}>
                      <Text style={styles.botaoPequenoTexto}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => apagarCoordenador(item.id)} style={[styles.botaoPequeno, { backgroundColor: '#dc3545' }]}>
                      <Text style={styles.botaoPequenoTexto}>Excluir</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {expandido === item.id && equipamentos.map((eq) => renderEquipamento(eq, item.id))}
          </View>
        )}
      />
    )}
  </View>
);

}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  novoPerfilContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  inputNovo: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
    padding: 8,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  botaoCriar: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
  },
  botaoCriarTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
  botaoCoord: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 8,
  },
  botaoAtivo: {
    backgroundColor: '#007AFF',
  },
  textoCoord: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  item: {
    backgroundColor: '#f4f4f4',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  nome: {
    fontSize: 15,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 6,
    marginTop: 8,
    width: 80,
  },
  qtdTotal: {
    marginTop: 4,
    color: '#888',
  },
  botaoPequeno: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  botaoPequenoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
