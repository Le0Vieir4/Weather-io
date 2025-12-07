import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudDrizzle, 
  CloudSnow, 
  CloudLightning, 
  CloudFog,
  Wind,
  CloudSun,
  type LucideIcon 
} from "lucide-react";

// Maps the weather code to the corresponding icon
export function getWeatherIcon(weatherCode?: string): LucideIcon {
  if (!weatherCode) return CloudSun;

  const code = weatherCode.toLowerCase();

  // Clear sky
  if (code.includes('clear') || code.includes('limpo')) {
    return Sun;
  }

  // Partly cloudy
  if (code.includes('partly') || code.includes('parcialmente')) {
    return CloudSun;
  }

  // Cloudy
  if (code.includes('cloudy') || code.includes('overcast') || code.includes('nublado')) {
    return Cloud;
  }

  // Fog/Mist
  if (code.includes('fog') || code.includes('mist') || code.includes('neblina') || code.includes('névoa')) {
    return CloudFog;
  }

  // Drizzle
  if (code.includes('drizzle') || code.includes('garoa') || code.includes('chuvisco')) {
    return CloudDrizzle;
  }

  // Rain
  if (code.includes('rain') || code.includes('chuva') || code.includes('shower')) {
    return CloudRain;
  }

  // Snow
  if (code.includes('snow') || code.includes('neve') || code.includes('sleet')) {
    return CloudSnow;
  }

  // Thunderstorm
  if (code.includes('thunder') || code.includes('storm') || code.includes('trovoada') || code.includes('tempestade')) {
    return CloudLightning;
  }

  // Strong wind
  if (code.includes('wind') || code.includes('vento')) {
    return Wind;
  }

  // Default
  return CloudSun;
}

// Return an appropriate description for the weather code
export function getWeatherDescription(weatherCode?: string): string {
  if (!weatherCode) return 'Informação não disponível';

  const code = weatherCode.toLowerCase();

  if (code.includes('clear')) return 'Céu limpo';
  if (code.includes('partly')) return 'Parcialmente nublado';
  if (code.includes('cloudy') || code.includes('overcast')) return 'Nublado';
  if (code.includes('fog') || code.includes('mist')) return 'Neblina';
  if (code.includes('drizzle')) return 'Chuvisco';
  if (code.includes('rain')) return 'Chuva';
  if (code.includes('snow')) return 'Neve';
  if (code.includes('thunder') || code.includes('storm')) return 'Tempestade';
  if (code.includes('wind')) return 'Ventania';

  return weatherCode;
}
