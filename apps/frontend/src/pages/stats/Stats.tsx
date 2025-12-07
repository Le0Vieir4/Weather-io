import { useEffect, useState } from 'react';
import { useWeatherApi } from '@/hooks/useWeatherApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { parseDate, DAY_NAMES } from '@/utils/dateHelpers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { DailyWeather, WeatherData, WeatherLog } from '@/types/schemas/weather-schemas';


type PeriodType = 'forecast' | 'week' | 'month';
type ChartDataKey = 'temperatureMax' | 'temperatureMin' | 'apparentTemperatureMax' | 'uvIndexMax' | 'precipitationProbability';

interface ChartConfig {
  key: ChartDataKey;
  label: string;
  color: string;
  unit: string;
}

const chartConfigs: ChartConfig[] = [
  { key: "temperatureMax", label: "Temp. Máx", color: "hsl(var(--chart-1))", unit: "°" },
  { key: "temperatureMin", label: "Temp. Mín", color: "hsl(var(--chart-2))", unit: "°" },
  { key: "apparentTemperatureMax", label: "Sens. Máx", color: "hsl(var(--chart-3))", unit: "°" },
  { key: "uvIndexMax", label: "UV", color: "hsl(var(--chart-5))", unit: "" },
  { key: "precipitationProbability", label: "Chuva", color: "hsl(var(--chart-4))", unit: "%" },
];

function Stats() {
  const { loading, error, getLatestWeather, getWeatherLogs } = useWeatherApi();
  const [latestWeather, setLatestWeather] = useState<WeatherData | null>(null);
  const [historicalData, setHistoricalData] = useState<WeatherLog[]>([]);
  const [period, setPeriod] = useState<PeriodType>('forecast');
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [activeChart, setActiveChart] = useState<ChartDataKey>('temperatureMax');

  useEffect(() => {
    const loadLatestWeather = async () => {
      try {
        const data = await getLatestWeather();
        setLatestWeather(data);
      } catch (err) {
        console.error('Erro ao carregar dados mais recentes:', err);
      }
    };

    loadLatestWeather();
  }, [getLatestWeather]);

  useEffect(() => {
    const loadHistoricalData = async () => {
      if (period === 'forecast') return;

      setIsLoadingHistory(true);
      try {
        const limit = period === 'week' ? 7 : 30;
        const logs = await getWeatherLogs(undefined, limit);
        setHistoricalData(logs);
      } catch (err) {
        console.error('Erro ao carregar histórico:', err);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadHistoricalData();
  }, [period, getWeatherLogs]);

  const getForecastChartData = () => {
    if (!latestWeather?.daily) return [];

    return latestWeather.daily
      .filter((d) => {
        const date = parseDate(d.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
      })
      .map((day, index) => {
        const date = parseDate(day.date);
        const dayName = index === 0 ? "Hoje" : DAY_NAMES[date.getDay()];
        return {
          day: dayName,
          date: day.date,
          temperatureMax: Math.round(day.temperatureMax * 10) / 10,
          temperatureMin: Math.round(day.temperatureMin * 10) / 10,
          apparentTemperatureMax: Math.round(day.apparentTemperatureMax * 10) / 10,
          uvIndexMax: Math.round(day.uvIndexMax * 10) / 10,
          precipitationProbability: day.precipitationProbability,
        };
      });
  };

  const getHistoricalChartData = () => {
    if (!historicalData.length) return [];

    // Expandir todos os dias de todos os logs e agrupar por data
    const groupedByDate = new Map<string, DailyWeather>();

    historicalData.forEach((log) => {
      // Itera sobre TODOS os dias do array daily de cada log
      if (!log.daily || !Array.isArray(log.daily)) return;

      log.daily.forEach((dailyItem) => {
        const dailyDate = dailyItem.date;
        if (!dailyDate) return;

        const date = parseDate(dailyDate);
        const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

        // Mantém apenas o primeiro registro de cada dia
        if (!groupedByDate.has(dateKey)) {
          groupedByDate.set(dateKey, dailyItem);
        }
      });
    });

    // Converte o Map em array, ordena por data e filtra o período desejado
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysLimit = period === 'week' ? 7 : 30;
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - daysLimit);

    const result = Array.from(groupedByDate.entries())
      .map(([, dailyItem]) => {
        const date = parseDate(dailyItem.date);
        const dayName = DAY_NAMES[date.getDay()].substring(0, 3);
        const shortDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;

        return {
          day: `${dayName} ${shortDate}`,
          date: dailyItem.date,
          dateObj: date,
          temperatureMax: dailyItem.temperatureMax
            ? Math.round(dailyItem.temperatureMax * 10) / 10
            : 0,
          temperatureMin: dailyItem.temperatureMin
            ? Math.round(dailyItem.temperatureMin * 10) / 10
            : 0,
          apparentTemperatureMax: dailyItem.apparentTemperatureMax
            ? Math.round(dailyItem.apparentTemperatureMax * 10) / 10
            : 0,
          uvIndexMax: dailyItem.uvIndexMax
            ? Math.round(dailyItem.uvIndexMax * 10) / 10
            : 0,
          precipitationProbability: dailyItem.precipitationProbability || 0,
        };
      })
      .filter(item => item.dateObj >= startDate && item.dateObj <= today)
      .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())
      .map(item => ({
        day: item.day,
        date: item.date,
        temperatureMax: item.temperatureMax,
        temperatureMin: item.temperatureMin,
        apparentTemperatureMax: item.apparentTemperatureMax,
        uvIndexMax: item.uvIndexMax,
        precipitationProbability: item.precipitationProbability,
      }));

    return result;
  };

  const getChartData = () => {
    return period === 'forecast' ? getForecastChartData() : getHistoricalChartData();
  };

  const calculateAverage = (data: Array<Record<string, string | number>>, key: ChartDataKey) => {
    if (!data.length) return 0;
    const total = data.reduce((acc, curr) => {
      const value = curr[key];
      return acc + (typeof value === 'number' ? value : 0);
    }, 0);
    return Math.round((total / data.length) * 10) / 10;
  };

  const renderInteractiveChart = () => {
    const chartData = getChartData();

    if (!chartData.length) {
      return (
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground text-center">Nenhum dado disponível para este período</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle>Análise Meteorológica Interativa</CardTitle>
            <CardDescription>
              {period === 'forecast'
                ? 'Visualize todos os dados meteorológicos dos próximos 7 dias'
                : period === 'week'
                  ? 'Dados da última semana'
                  : 'Dados do último mês'}
            </CardDescription>
          </div>
          <div className="flex">
            {chartConfigs.map((config) => {
              const average = calculateAverage(chartData, config.key);

              return (
                <button
                  key={config.key}
                  data-active={activeChart === config.key}
                  className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6 hover:bg-muted/30 transition-colors"
                  onClick={() => setActiveChart(config.key)}
                >
                  <span className="text-xs text-muted-foreground text-nowrap">
                    {config.label}
                  </span>
                  <span className="text-lg font-bold leading-none sm:text-3xl">
                    {average}{config.unit}
                  </span>
                </button>
              );
            })}
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={Object.fromEntries(
              chartConfigs.map(c => [
                c.key,
                {
                  label: c.label,
                  color: c.color,
                }
              ])
            )}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}

            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 12 }}
                domain={
                  activeChart === 'uvIndexMax' || activeChart === 'precipitationProbability'
                    ? [0, 'auto']
                    : ['auto', 'auto']
                }
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey={activeChart}
                type="natural"
                fill={`var(--color-${activeChart})`}
                fillOpacity={0.4}
                stroke={`var(--color-${activeChart})`}
                strokeWidth={2}
                baseValue={activeChart === 'uvIndexMax' || activeChart === 'precipitationProbability' ? 0 : 'dataMin'}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    );
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-500">
          <CardHeader>
            <CardTitle className="text-red-500">Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="relative flex items-center space-x-0.5 text-lg">
          <a href="/dashboard" className="absolute w-full h-full" />
          <ArrowLeft />
          <span>Voltar</span>
        </Button>
      </div>

      <h1 className="text-3xl font-bold">Dados Meteorológicos</h1>

      {/* Dados mais recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Condições Atuais</CardTitle>
          <CardDescription>Dados meteorológicos mais recentes</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && !latestWeather ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : latestWeather ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Cidade</p>
                <p className="text-2xl font-bold">{latestWeather.city}</p>
              </div>
              {latestWeather.current && latestWeather.current[0] && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Temperatura</p>
                    <p className="text-xl font-semibold">{latestWeather.current[0].temperature}°C</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sensação Térmica</p>
                    <p className="text-xl font-semibold">{latestWeather.current[0].apparentTemperature}°C</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Umidade</p>
                    <p className="text-xl font-semibold">{latestWeather.current[0].relativeHumidity}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Índice UV</p>
                    <p className="text-xl font-semibold">{latestWeather.current[0].uv}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Período</p>
                    <p className="text-xl font-semibold">{latestWeather.current[0].isDay ? '☀️ Dia' : '🌙 Noite'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Atualizado</p>
                    <p className="text-xl font-semibold">{latestWeather.current[0].time}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">Nenhum dado disponível</p>
          )}
        </CardContent>
      </Card>

      {/* Tabs para alternar entre Previsão e Histórico */}
      <Tabs value={period} onValueChange={(value) => setPeriod(value as PeriodType)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="forecast">Previsão (7 dias)</TabsTrigger>
          <TabsTrigger value="week">Última Semana</TabsTrigger>
          <TabsTrigger value="month">Último Mês</TabsTrigger>
        </TabsList>

        {/* Previsão */}
        <TabsContent value="forecast" className="space-y-6 mt-6">
          {isLoadingHistory ? (
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          ) : (
            renderInteractiveChart()
          )}
        </TabsContent>

        {/* Última Semana */}
        <TabsContent value="week" className="space-y-6 mt-6">
          {isLoadingHistory ? (
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          ) : (
            renderInteractiveChart()
          )}
        </TabsContent>

        {/* Último Mês */}
        <TabsContent value="month" className="space-y-6 mt-6">
          {isLoadingHistory ? (
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          ) : (
            renderInteractiveChart()
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Stats;
