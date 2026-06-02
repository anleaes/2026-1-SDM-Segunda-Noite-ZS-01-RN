
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

import { API_URL } from '@/constants/api';
import { useAdminGuard } from '@/hooks/useAdminGuard';

export default function EditarFilmeScreen() {
  useAdminGuard();
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    titulo?: string;
    duracao?: string;
    classificacao?: string;
    genero?: string;
  }>();

  const [titulo, setTitulo] = useState(params.titulo ?? '');
  const [duracao, setDuracao] = useState(params.duracao ?? '');
  const [classificacao, setClassificacao] = useState(params.classificacao ?? '');
  const [generoId, setGeneroId] = useState(params.genero ?? '');
  const [generos, setGeneros] = useState<{ id: number; nome: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchGeneros = async () => {
      try {
        const res = await fetch(`${API_URL}/generos/`);
        setGeneros(await res.json());
      } catch {
        setGeneros([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGeneros();
  }, []);

  const handleSave = async () => {
    if (!params.id) return;
    if (!titulo.trim() || !duracao.trim() || !classificacao.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/filmes/${params.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo,
          duracao: Number(duracao),
          classificacao,
          genero: generoId ? Number(generoId) : null,
        }),
      });

      if (res.ok) {
        Alert.alert('Sucesso', 'Filme atualizado!');
        router.push('/(drawer)/admin/listar-filmes' as Href);
      } else {
        Alert.alert('Erro', 'Não foi possível atualizar o filme.');
      }
    } catch {
      Alert.alert('Erro', 'Sem conexão com o servidor.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <Text style={styles.title}>Editar Filme</Text>

      <Text style={styles.label}>Título *</Text>
      <TextInput value={titulo} onChangeText={setTitulo} style={styles.input} placeholder="Ex: Vingadores" placeholderTextColor="#777" />

      <Text style={styles.label}>Duração (min) *</Text>
      <TextInput value={duracao} onChangeText={setDuracao} style={styles.input} keyboardType="numeric" placeholder="120" placeholderTextColor="#777" />

      <Text style={styles.label}>Classificação *</Text>
      <TextInput value={classificacao} onChangeText={setClassificacao} style={styles.input} placeholder="Ex: 12 anos" placeholderTextColor="#777" />

      <Text style={styles.label}>Gênero</Text>
      {loading ? (
        <ActivityIndicator size="small" color="#ff2d2d" />
      ) : (
        <TextInput
          value={generos.find(item => item.id === Number(generoId))?.nome ?? ''}
          onChangeText={() => {}}
          style={styles.input}
          placeholder="Selecione o gênero no backend"
          placeholderTextColor="#777"
          editable={false}
        />
      )}

      {saving ? (
        <ActivityIndicator size="large" color="#ff2d2d" style={{ marginTop: 20 }} />
      ) : (
        <TouchableOpacity style={styles.btnSalvar} onPress={handleSave}>
          <Text style={styles.btnTexto}>Salvar</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.btnVoltar} onPress={() => router.back()}>
        <Text style={[styles.btnTexto, { color: '#ccc' }]}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', padding: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#ff2d2d', alignSelf: 'center', marginBottom: 18 },
  label: { color: '#fff', fontWeight: '600', marginBottom: 6 },
  input: { backgroundColor: '#111', color: '#fff', borderWidth: 1, borderColor: '#333', borderRadius: 8, padding: 12, marginBottom: 10 },
  btnSalvar: { backgroundColor: '#c40000', padding: 14, borderRadius: 8, marginTop: 10, alignItems: 'center' },
  btnVoltar: { borderWidth: 1, borderColor: '#444', padding: 14, borderRadius: 8, marginTop: 10, alignItems: 'center', backgroundColor: '#2a2a2a' },
  btnTexto: { color: '#fff', fontWeight: '600', fontSize: 16 },
});