import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Searchbar, Card, Text, Appbar, Provider as PaperProvider } from 'react-native-paper';
import { db } from './firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [rutas, setRutas] = useState([]);

  useEffect(() => {
    const cargarRutas = async () => {
      const querySnapshot = await getDocs(collection(db, "rutas"));
      const rutasCargadas = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRutas(rutasCargadas);
    };
    cargarRutas();
  }, []);

  const rutasFiltradas = rutas.filter(r =>
    r.numero.includes(searchQuery) || r.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PaperProvider>
      <Appbar.Header>
        <Appbar.Content title="Rutas Urbanas" />
      </Appbar.Header>

      <View style={styles.container}>
        <Searchbar
          placeholder="Buscar ruta..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 6.25184,
            longitude: -75.56359,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {rutasFiltradas.map((ruta, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: ruta.lat, longitude: ruta.lng }}
              title={`Ruta ${ruta.numero}`}
              description={ruta.nombre}
            />
          ))}
        </MapView>

        <FlatList
          data={rutasFiltradas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.card} mode="elevated">
              <Card.Title title={`Ruta ${item.numero} - ${item.nombre}`} />
              <Card.Content>
                <Text variant="bodyMedium"><Text style={styles.label}>Horario:</Text> {item.horario}</Text>
                <Text variant="bodyMedium"><Text style={styles.label}>Paradas:</Text> {item.paradas}</Text>
                <Text variant="bodyMedium"><Text style={styles.label}>Frecuencia:</Text> {item.frecuencia}</Text>
              </Card.Content>
            </Card>
          )}
        />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchbar: {
    marginBottom: 10,
    borderRadius: 8,
  },
  map: {
    height: 250,
    borderRadius: 12,
    marginBottom: 10,
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#e3f2fd',
  },
  label: {
    fontWeight: 'bold',
    color: '#1565c0'
  }
});
