import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getChannelFeeds } from './api/api';
import { Feed } from './types/types';

const screenWidth = Dimensions.get('window').width;

export default function App() {
  const [data, setData] = useState<Feed[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar dados da API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getChannelFeeds(30); // Obtém os últimos 10 feeds
        setData(response.feeds); // Atualiza os feeds no estado
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Formatar as datas para o eixo X
  const formattedDates = data.map((item) =>
    new Date(item.created_at).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  );

  // Selecionar 3 datas espaçadas para o eixo X
  const getLabelsForXAxis = () => {
    if (formattedDates.length <= 3) return formattedDates; // Se houver 3 ou menos dados, exibe todos
    return [formattedDates[0], formattedDates[Math.floor(formattedDates.length / 2)], formattedDates[formattedDates.length - 1]];
  };

  const labelsForXAxis = getLabelsForXAxis();

  // Preparar dados para os gráficos
  const voltageData = {
    labels: labelsForXAxis, // Apenas 3 datas no eixo X
    datasets: [
      {
        data: data.map((item) => parseFloat(item.field1 || '0')), // Dados de tensão
        color: () => '#007BFF', // Cor da linha
        strokeWidth: 2, // Largura da linha
      },
    ],
    legend: ['Tensão (V)'], // Legenda
  };

  const temperatureData = {
    labels: labelsForXAxis, // Apenas 3 datas no eixo X
    datasets: [
      {
        data: data.map((item) => parseFloat(item.field2 || '0')), // Dados de temperatura
        color: () => '#FF5733', // Cor da linha
        strokeWidth: 2, // Largura da linha
      },
    ],
    legend: ['Temperatura (°C)'], // Legenda
  };

  // Exibir carregamento ou dados
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Título fixo com mais espaço acima */}
      <Text style={styles.title}>Monitoramento de Energia</Text>

      {/* Scroll para os gráficos */}
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {/* Gráfico de Tensão */}
        <Text style={styles.subtitle}>Tensão</Text>
        <LineChart
          data={voltageData}
          width={screenWidth - 40} // Largura do gráfico
          height={300} // Altura do gráfico
          chartConfig={{
            backgroundGradientFrom: '#FFF',
            backgroundGradientTo: '#F5F5F5',
            color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            strokeWidth: 2,
          }}
          bezier
          style={styles.chart}
          withHorizontalLines={false} // Remove linhas horizontais extras
          withVerticalLines={true} // Adiciona linhas verticais
          withDots={false} // Remove os pontos da linha
          segments={5} // Divide o gráfico em segmentos
          yAxisSuffix=" V" // Sufixo de unidade
        />

        {/* Gráfico de Temperatura */}
        <Text style={styles.subtitle}>Temperatura</Text>
        <LineChart
          data={temperatureData}
          width={screenWidth - 40} // Largura do gráfico
          height={300} // Altura do gráfico
          chartConfig={{
            backgroundGradientFrom: '#FFF',
            backgroundGradientTo: '#F5F5F5',
            color: (opacity = 1) => `rgba(255, 87, 51, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            strokeWidth: 2,
          }}
          bezier
          style={styles.chart}
          withHorizontalLines={false} // Remove linhas horizontais extras
          withVerticalLines={true} // Adiciona linhas verticais
          withDots={false} // Remove os pontos da linha
          segments={5} // Divide o gráfico em segmentos
          yAxisSuffix=" °C" // Sufixo de unidade
        />
      </ScrollView>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    position: 'absolute', // Fixa o título na parte superior
    top: 60, // Distância do topo (ajustado para 60px)
    left: 0,
    right: 0,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  scrollContainer: {
    marginTop: 100, // Ajusta o espaço para o título fixo
  },
  scrollContent: {
    paddingBottom: 20, // Espaço extra no final do conteúdo rolável
  },
  chart: {
    borderRadius: 16,
    marginVertical: 20,
  },
});
