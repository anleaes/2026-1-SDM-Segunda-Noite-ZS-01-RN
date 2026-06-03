import { Ionicons } from '@expo/vector-icons';
import { Href, useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { API_URL } from '@/constants/api';
import { useAdminGuard } from '@/hooks/useAdminGuard';

export type Sala = {
  id: number;
  numero: number;
  capacidade: number;
  sala3D: boolean;
};

export default function ListarSalasScreen() {
  useAdminGuard();
  const router = useRouter();
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSalas = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/salas/`);
      setSalas(await res.json());
    } catch {
      setSalas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/salas/${id}/`, { method: 'DELETE' });
      if (res.ok) {
        setSalas(prev => prev.filter(item => item.id !== id));
      } else {
        Alert.alert('Erro', 'Não foi possível excluir a sala.');
      }
    } catch {
      Alert.alert('Erro', 'Sem conexão com o servidor.');
    }
  };

  useFocusEffect(useCallback(() => { fetchSalas(); }, []));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Salas</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#ff2d2d" style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={salas}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 90 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Sala {item.numero}</Text>
              <Text style={styles.cardText}>Capacidade: {item.capacidade}</Text>
              <Text style={styles.cardText}>3D: {item.sala3D ? 'Sim' : 'Não'}</Text>
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.btnEditar}
                  onPress={() => router.push({ pathname: '/(drawer)/admin/editar-sala', params: { id: String(item.id), numero: String(item.numero), capacidade: String(item.capacidade), sala3D: String(item.sala3D) } } as Href)}
                >
                  <Text style={styles.btnText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnExcluir} onPress={() => handleDelete(item.id)}>
                  <Text style={styles.btnText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/(drawer)/admin/cadastrar-sala' as Href)}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

