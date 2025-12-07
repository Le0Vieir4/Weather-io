import { useState, useEffect } from "react"
import { useWeatherApi } from "@/hooks/useWeatherApi"
import { useAutoRefresh } from "@/hooks/useAutoRefresh"
import { getWeatherIcon, getWeatherDescription } from "@/utils/weatherIcons"
import { parseDate, DAY_NAMES } from "@/utils/dateHelpers"
import { MapPin, type LucideIcon } from "lucide-react"
import { motion } from "motion/react"
import type { WeatherData } from "@/types/schemas/weather-schemas"
import botIcon from "@/assets/icons/bot-icon.svg?url"

type DayItem = {
  name: string,
  icon: LucideIcon,
  temp_max?: number,
  temp_min?: number,
  precipitationProbability?: number
}


export function Dashboard() {
  const [time, setTime] = useState("")
  const [date, setDate] = useState("")
  const { getLatestWeather } = useWeatherApi();
  const [latestWeather, setLatestWeather] = useState<WeatherData | null>(null);

  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // Auto-refresh hook - updates every 5 minutes

  const loadLatestWeather = async () => {
    try {
      setIsRefreshing(true);
      const data = await getLatestWeather();
      setLatestWeather(data);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Erro ao carregar dados mais recentes:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useAutoRefresh({
    onRefresh: loadLatestWeather,
    interval: 300 * 1000, // 5 minutes
    enabled: true, // can be controlled by a state
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString("pt-BR"))
      setDate(now.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Filters and maps daily data - only from today onwards
  const days: (DayItem & { date: string })[] = latestWeather ? latestWeather.daily
    .filter((dailyData) => {
      const date = parseDate(dailyData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset hours to compare only the date
      return date >= today; // Returns only dates from today onwards
    })
    .map((dailyData, index) => {
      const date = parseDate(dailyData.date);
      const dayOfWeek = date.getDay();
      // First day is "Today", then the days of the week
      const dayName = index === 0 ? "Hoje" : DAY_NAMES[dayOfWeek];

      return {
        name: dayName,
        temp_max: dailyData.temperatureMax,
        temp_min: dailyData.temperatureMin,
        precipitationProbability: dailyData.precipitationProbability,
        date: dailyData.date,
        icon: getWeatherIcon(dailyData.weatherCode)
      };
    }) : [];
  
    const items = latestWeather && days ? [
    { name: "Humidade", valor: latestWeather.current[0].relativeHumidity, sufixo: "%" },
    { name: "Uv", valor: latestWeather.current[0].uv },
    { name: "Sensação termica", valor: latestWeather.current[0].apparentTemperature, sufixo: "°" },
    { name: "Prob. de chuva", valor: days[0].precipitationProbability, sufixo: "%" },
  ] : [];

  return (
    <div className="relative w-full h-full overflow-hidden">
      {
        latestWeather && (
          <div className="px-10 space-y-5 mt-5 ">
            <div className="w-full flex flex-row justify-between">
              <span className="flex items-center gap-2 text-xl font-semibold "><MapPin /> {latestWeather.city} </span>
              {latestWeather.aiInsight && (
                <motion.div
                  animate={{ opacity: [0, 1], x: [250, 0] }}
                  transition={{ duration: 1.5, ease: 'easeIn' }} 
                  className="absolute right-5 bg-green-500 border rounded-lg p-4  w-[350px]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-1 "> 
                      <img src={botIcon} alt="Bot" className="w-7 h-7 relative -top-1.5" /></div>
                      <h1 className="text-lg font-semibold text-white">Insights de IA</h1>
                  </div>
                  <div className="px-4">
                    <span className=" text-md text-white font-light text-pretty">{latestWeather.aiInsight}</span>

                  </div>

                </motion.div>
              )}
            </div>

            <div className="flex justify-center items-center">
              <div className="relative flex flex-col items-center gap-1">

                <span className="pl-10 text-9xl font-normal">{latestWeather.current[0].temperature}°</span>
                <span className="text-lg font-light text-nowrap flex items-center gap-1">
                  {getWeatherDescription(latestWeather.current[0].weatherCode)}
                  {(() => {
                    const WeatherIcon = getWeatherIcon(latestWeather.current[0].weatherCode);
                    return <WeatherIcon className="w-10 h-10 text-amber-500" />;
                  })()}
                </span>
                <span>{`Max: ${days[0].temp_max}° | Min: ${days[0].temp_min}°`}</span>
              </div>
            </div>

            <div className="flex flex-row gap-10">
              {items.map((item) => (
                <div key={item.name} className="border border-black shadow-lg shadow-gray-300 w-full h-30 p-4 rounded-lg flex flex-col items-center gap-2">
                  <span className="font-light text-2xl">{item.name}</span>
                  <span className="font-bold text-xl">{item.valor}{item.sufixo ?? ""}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border border-black shadow-lg shadow-gray-300 w-full rounded-lg py-4 px-6 bg-white">
              {days.length === 0 ? (
                <p>Nenhum dado disponível</p>
              ) : (
                days.map((day) => {
                  const DayIcon = day.icon;
                  return (
                    <div className="flex flex-col items-center gap-2 min-w-20" key={day.date}>
                      <p className="text-xl font-semibold text-black m-0">{day.name}</p>
                      <DayIcon className="w-10 h-10 text-gray-700" />
                      <p className="text-lg font-bold text-black m-0">{day.temp_max}°</p>
                      <p className="text-lg text-gray-500 m-0">{day.temp_min}°</p>
                    </div>
                  );
                })
              )}
            </div>
            <div className="fixed right-10 bottom-10 text-right">
              <div className="text-xl font-semibold">{date} {time}</div>
              {lastUpdate && (
                <div className="text-sm text-muted-foreground flex items-center gap-2 justify-end">
                  <span>Última atualização: {lastUpdate.toLocaleTimeString("pt-BR")}</span>
                  {isRefreshing && (
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  )}
                </div>
              )}
            </div>
          </div>

        )
      }
    </div>
  )
}
