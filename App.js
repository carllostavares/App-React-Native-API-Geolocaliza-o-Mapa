import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const App = () => {
  const [movieTitle, setMovieTitle] = useState('');
  const [movieData, setMovieData] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão de localização não concedida',
          'Por favor, conceda permissão de localização para obter a localização.'
        );
        return;
      }

      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);
    })();
  }, []);

  const handleSearch = async () => {
    if (movieTitle.trim() === '') {
      Alert.alert('Aviso', 'Por favor, insira um título de filme válido.');
      return;
    }

    try {
      const apiKey = '3d4e86da'; // Substitua pelo seu próprio API Key
      const apiUrl = `https://www.omdbapi.com/?t=${movieTitle}&apikey=${apiKey}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.Response === 'True') {
        setMovieData(data);
      } else {
        Alert.alert('Erro', 'Filme não encontrado. Verifique o título e tente novamente.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Houve um problema na busca do filme. Tente novamente mais tarde.');
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#2f4f4f', // Fundo cinza escuro
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          borderWidth: 2,
          borderColor: 'black', // Bordas pretas
          borderRadius: 10,
          backgroundColor: 'white',
          padding: 20,
          width: '80%',
        }}
      >
        <Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 20 }}>
          Busca de Filmes
        </Text>
        <TextInput
          style={{ borderWidth: 1, margin: 10, padding: 8 }}
          placeholder="Digite o nome do filme"
          value={movieTitle}
          onChangeText={(text) => setMovieTitle(text)}
        />
        <TouchableOpacity
          onPress={handleSearch}
          style={{
            backgroundColor: '#2f4f4f', // Cor cinza escuro
            borderRadius: 5,
            padding: 10,
            marginTop: 10,
            borderWidth: 1,
            borderColor: 'black', // Bordas pretas
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>Buscar Filme</Text>
        </TouchableOpacity>
        {location && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Sua Localização</Text>
            <Text>Latitude: {location.coords.latitude}</Text>
            <Text>Longitude: {location.coords.longitude}</Text>
            <MapView
              style={{ width: '100%', height: 200, marginTop: 10 }}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="Sua Localização"
              />
            </MapView>
          </View>
        )}
        {movieData && (
          <View style={{ margin: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{movieData.Title}</Text>
            <Text>Ano: {movieData.Year}</Text>
            <Text>Gênero: {movieData.Genre}</Text>
            <Text>Diretor: {movieData.Director}</Text>
            <Text>Prêmios: {movieData.Awards}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default App;
