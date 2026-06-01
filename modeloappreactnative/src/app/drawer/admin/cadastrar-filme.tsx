import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

export default function CadastrarFilmeScreen() {
  const router = useRouter();
  const [titulo, setTitulo] = useState('');
  const [generoId, setGeneroId] = useState('');
  const [duracao, setDuracao] = useState('');
  const [classificacao, setClassificacao] = useState('');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cadastrar Filme</Text>

      <Text style={styles.label}>Título *</Text>
      <TextInput
        value={titulo}
        onChangeText={setTitulo}
        style={styles.input}
        placeholder="Ex: Vingadores"
        placeholderTextColor="#aaa"
      />

      <Text style={styles.label}>ID do Gênero</Text>
      {/* Consulte /generos/ no backend para obter os IDs disponíveis */}
      <TextInput
        value={generoId}
        onChangeText={setGeneroId}
        style={styles.input}
        placeholder="Ex: 1"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Duração (min)</Text>
      <TextInput
        value={duracao}
        onChangeText={setDuracao}
        style={styles.input}
        placeholder="Ex: 120"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Classificação</Text>
      <TextInput
        value={classificacao}
        onChangeText={setClassificacao}
        style={styles.input}
        placeholder="Ex: Livre, 12, 14, 16, 18"
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity style={styles.btnSalvar}>
        <Text style={styles.btnTexto}>Salvar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnVoltar}
        onPress={() => router.push('/(drawer)/admin/listar-filmes')}
      >
        <Text style={[styles.btnTexto, { color: '#ccc' }]}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', padding: 16 },
  title: {
    fontSize: 22, fontWeight: 'bold', color: '#ff2d2d',
    alignSelf: 'center', marginBottom: 16,
  },
  label: { fontWeight: '600', marginTop: 12, marginBottom: 4, color: '#fff' },
  input: {
    borderWidth: 1, borderColor: '#333', borderRadius: 8,
    padding: 10, color: '#fff', backgroundColor: '#111',
  },
  btnSalvar: {
    backgroundColor: '#c40000', padding: 14,
    borderRadius: 8, marginTop: 20, alignItems: 'center',
  },
  btnVoltar: {
    borderWidth: 1, borderColor: '#444', padding: 14,
    borderRadius: 8, marginTop: 10, alignItems: 'center', backgroundColor: '#2a2a2a',
  },
  btnTexto: { color: '#fff', fontWeight: '600', fontSize: 16 },
});