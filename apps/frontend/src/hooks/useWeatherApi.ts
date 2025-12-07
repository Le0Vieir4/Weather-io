import type { WeatherData, WeatherLog } from '@/types/schemas/weather-schemas';
import { useState, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';



export function useWeatherApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLatestWeather = useCallback(async (): Promise<WeatherData | null> => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/weather`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Erro ao buscar dados meteorológicos');
      }

      const data = await res.json();
      
      if (!data) {
        throw new Error('Resposta vazia do servidor');
      }
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getWeatherLogs = useCallback(async (
    city?: string,
    limit: number = 100
  ): Promise<WeatherLog[]> => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (city) params.append('city', city);
      params.append('limit', limit.toString());

      const res = await fetch(`${API_URL}/api/weather/logs?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Erro ao buscar histórico meteorológico');
      }

      const data = await res.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getWeatherInsights = useCallback(async (): Promise<WeatherData | null> => {
    setLoading(true)
    setError(null);
    
    try {
      const res = await fetch(`${API_URL}/api/weather/insight`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Erro ao buscar insights meteorológicos');
      }

      return await res.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadCSV = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/weather/export/csv`, {
        method: 'GET',
      });

      if (!res.ok) {
        throw new Error('Erro ao baixar CSV');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `weather_export_${new Date().getTime()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadExcel = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/weather/export/excel`, {
        method: 'GET',
      });

      if (!res.ok) {
        throw new Error('Erro ao baixar Excel');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `weather_export_${new Date().getTime()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getLatestExportInfo = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/weather/export/info`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Erro ao buscar informações de export');
      }

      return await res.json();
    } catch (err) {
      console.error('Erro ao buscar info de export:', err);
      return null;
    }
  }, []);

  return {
    loading,
    error,
    getLatestWeather,
    getWeatherLogs,
    getWeatherInsights,
    downloadCSV,
    downloadExcel,
    getLatestExportInfo,
  };
}
