import axios from 'axios';
import { ChannelResponse } from '../types/types';

const API_BASE = 'https://api.thingspeak.com/channels/2716801';
const READ_API_KEY = '9RUW134FEIYVZKSY';
const WRITE_API_KEY = 'CAZUNA066X5EDWCI';

// Obter todos os feeds do canal
export const getChannelFeeds = async (results = 10): Promise<ChannelResponse> => {
  const response = await axios.get(`${API_BASE}/feeds.json`, {
    params: {
      api_key: READ_API_KEY,
      results,
    },
  });
  return response.data;
};

// Obter dados de um campo específico
export const getFieldData = async (field: number, results = 10): Promise<ChannelResponse> => {
  const response = await axios.get(`${API_BASE}/fields/${field}.json`, {
    params: {
      api_key: READ_API_KEY,
      results,
    },
  });
  return response.data;
};

// Atualizar um valor (temperatura ou tensão)
export const updateField = async (field1: number): Promise<number> => {
  const response = await axios.get('https://api.thingspeak.com/update', {
    params: {
      api_key: WRITE_API_KEY,
      field1,
    },
  });
  return response.data; // Retorna o ID da entrada atualizada
};