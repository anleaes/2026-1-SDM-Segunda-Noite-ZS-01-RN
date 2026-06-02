import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

import { API_URL } from '@/constants/api';
import { useAdminGuard } from '@/hooks/useAdminGuard';

export default function EditarGeneroScreen() {
  useAdminGuard();
  const router = useRouter();
  const { id, nome: nomeParam, descricao: descricaoParam, icone: iconeParam } = useLocalSearchParams<{
    id?: string; nome?: string; descricao?: string; icone?: string;
  }>();

  const [nome, setNome] = useState(nomeParam ?? '');
  const [descricao, setDescricao] = useState(descricaoParam ?? '');
  const [icone, setIcone] = useState(iconeParam ?? '🎬');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!id) return;
    if (!nome.trim() || !descricao.trim()) {
      Alert.alert('Atenção', 'Preencha nome e descrição.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/generos/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, descricao, icone: icone.trim() || '🎬' }),
      });

      if (res.ok) {
        Alert.alert('Sucesso', 'Gênero atualizado!');
        router.push('/(drawer)/admin/listar-generos' as Href);
      } else {
        Alert.alert('Erro', 'Não foi possível atualizar o gênero.');
      }
    } catch {
      Alert.alert('Erro', 'Sem conexão com o servidor.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <Text style={styles.title}>Editar Gênero</Text>
      <Text style={styles.label}>Nome *</Text>
      <TextInput value={nome} onChangeText={setNome} style={styles.input} />
      <Text style={styles.label}>Descrição *</Text>
      <TextInput value={descricao} onChangeText={setDescricao} style={[styles.input, styles.textArea]} multiline />
      <Text style={styles.label}>Ícone</Text>
      <TextInput value={icone} onChangeText={setIcone} style={styles.input} />

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
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  btnSalvar: { backgroundColor: '#c40000', padding: 14, borderRadius: 8, marginTop: 10, alignItems: 'center' },
  btnVoltar: { borderWidth: 1, borderColor: '#444', padding: 14, borderRadius: 8, marginTop: 10, alignItems: 'center', backgroundColor: '#2a2a2a' },
  btnTexto: { color: '#fff', fontWeight: '600', fontSize: 16 },
});