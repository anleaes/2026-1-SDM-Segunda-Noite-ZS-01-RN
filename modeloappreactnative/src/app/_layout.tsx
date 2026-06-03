import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import CustomDrawerContent from '../../components/CustomDrawerContent';

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerActiveTintColor: '#c40000',
        drawerInactiveTintColor: '#ccc',
        drawerLabelStyle: { marginLeft: 0, fontSize: 16 },
        drawerStyle: { backgroundColor: '#0f0f0f', width: 260 },
        headerStyle: { backgroundColor: '#c40000' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: 'Início',
          drawerIcon: ({ color, size }) =>
            <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />

      <Drawer.Screen
        name="admin/index"
        options={{
          title: 'Painel Admin',
          drawerIcon: ({ color, size }) =>
            <Ionicons name="speedometer-outline" size={size} color={color} />,
        }}
      />

      <Drawer.Screen
        name="admin/listar-filmes"
        options={{
          title: 'Filmes (Admin)',
          drawerIcon: ({ color, size }) =>
            <Ionicons name="film-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="admin/cadastrar-filme"
        options={{ title: 'Cadastrar Filme', drawerItemStyle: { display: 'none' } }}
      />
      <Drawer.Screen
        name="admin/editar-filme"
        options={{ title: 'Editar Filme', drawerItemStyle: { display: 'none' } }}
      />

      <Drawer.Screen
        name="admin/listar-generos"
        options={{ title: 'Gêneros', drawerIcon: ({ color, size }) => <Ionicons name="pricetag-outline" size={size} color={color} /> }}
      />
      <Drawer.Screen
        name="admin/cadastrar-genero"
        options={{ title: 'Cadastrar Gênero', drawerItemStyle: { display: 'none' } }}
      />
      <Drawer.Screen
        name="admin/editar-genero"
        options={{ title: 'Editar Gênero', drawerItemStyle: { display: 'none' } }}
      />

      <Drawer.Screen
        name="admin/listar-salas"
        options={{ title: 'Salas', drawerIcon: ({ color, size }) => <Ionicons name="business-outline" size={size} color={color} /> }}
      />
      <Drawer.Screen
        name="admin/cadastrar-sala"
        options={{ title: 'Cadastrar Sala', drawerItemStyle: { display: 'none' } }}
      />
      <Drawer.Screen
        name="admin/editar-sala"
        options={{ title: 'Editar Sala', drawerItemStyle: { display: 'none' } }}
      />

      <Drawer.Screen
        name="admin/listar-assentos"
        options={{
          title: 'Assentos',
          drawerIcon: ({ color, size }) =>
            <Ionicons name="grid-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="admin/criar-assento"
        options={{ title: 'Criar Assento', drawerItemStyle: { display: 'none' } }}
      />
      <Drawer.Screen
        name="admin/mudar-status-assento"
        options={{ title: 'Mudar Status', drawerItemStyle: { display: 'none' } }}
      />

      <Drawer.Screen
        name="admin/cadastrar-usuario"
        options={{
          title: 'Cadastrar Usuário',
          drawerIcon: ({ color, size }) =>
            <Ionicons name="person-add-outline" size={size} color={color} />,
        }}
      />

      <Drawer.Screen
        name="cliente/listar-filmes"
        options={{
          title: 'Em Cartaz',
          drawerIcon: ({ color, size }) =>
            <Ionicons name="ticket-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="cliente/escolher-sessao"
        options={{ title: 'Escolher Sessão', drawerItemStyle: { display: 'none' } }}
      />

      <Drawer.Screen
        name="cliente/comprar-ingresso"
        options={{ title: 'Comprar Ingresso', drawerItemStyle: { display: 'none' } }}
      />
      <Drawer.Screen
        name="cliente/compra-confirmacao"
        options={{ title: 'Confirmação', drawerItemStyle: { display: 'none' } }}
      />
    </Drawer>
  );
}