import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  FlatList,
} from 'react-native';
import axios from 'axios';

// (Opcional) Componente de carregamento se quiser usar no lugar de texto “Cadastrando...”
// import Carregando from '../../utils/carregando';

export default function CadastrarVigilante() {
  // Estados para formulário e controle da tela
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [usuarios, setUsuarios] = useState([]); // Lista local de cadastrados
  const [enviando, setEnviando] = useState(false); // Controle do botão para evitar cliques duplos

  // Função para cadastrar vigilante
  const cadastrarUsuario = async () => {
    if (!nome || !cpf) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (enviando) return; // Evita envios múltiplos

    setEnviando(true); // Desativa botão durante envio

    try {
      const cpfNumeros = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos

      // Valida CPF com 11 dígitos
      if (!/^\d{11}$/.test(cpfNumeros)) {
        Alert.alert('Erro', 'CPF inválido. Deve conter 11 dígitos numéricos.');
        return;
      }

      // Envia dados para API
      await axios.post('https://api-jesseguranca.onrender.com/funcionarios', {
        nome,
        cpf: cpfNumeros,
      });

      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');

      // Adiciona o novo usuário à lista local
      setUsuarios((prev) => [...prev, { nome, cpf: cpfNumeros }]);

      // Limpa os campos
      setNome('');
      setCpf('');
    } catch (_error) {
      Alert.alert('Erro', 'Não foi possível cadastrar o usuário');
    } finally {
      setEnviando(false); // Reativa o botão
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastro de Vigilante</Text>

      {/* Campo Nome */}
      <TextInput
        placeholder="Nome"
        style={styles.input}
        value={nome}
        onChangeText={setNome}
      />

      {/* Campo CPF */}
      <TextInput
        placeholder="CPF"
        style={styles.input}
        keyboardType="numeric"
        value={cpf}
        onChangeText={setCpf}
      />

      {/* Botão de Cadastro */}
      <TouchableOpacity
        style={[styles.botao, enviando && { backgroundColor: '#999' }]}
        onPress={cadastrarUsuario}
        disabled={enviando}
      >
        <Text style={styles.botaoTexto}>
          {enviando ? 'Cadastrando...' : 'Cadastrar'}
        </Text>
      </TouchableOpacity>

      {/* Lista de usuários recém cadastrados localmente */}
      <FlatList
        data={usuarios}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.usuario}>
            <Text>Nome: {item.nome}</Text>
            <Text>CPF: {item.cpf}</Text>
          </View>
        )}
      />
    </View>
  );
}

// Estilos do componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 12,
    borderRadius: 5,
  },
  botao: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
  usuario: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
});
