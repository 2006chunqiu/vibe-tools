export type WeatherKind = "sun" | "moon" | "cloud-sun" | "cloud-moon" | "cloud" | "fog" | "drizzle" | "rain" | "snow" | "storm";

export type GeoLocation = {
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
};

export type CurrentWeather = {
  time: string;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  isDay: boolean;
};

export type DailyWeather = {
  date: string;
  weatherCode: number;
  max: number;
  min: number;
  precipitationProbability: number;
};

export type WeatherBundle = {
  location: GeoLocation;
  current: CurrentWeather;
  daily: DailyWeather[];
  timezone: string;
  updatedAt: string;
};

type OpenMeteoResponse = {
  timezone: string;
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
};

type GeoResponse = {
  results?: Array<{
    name: string;
    country?: string;
    admin1?: string;
    latitude: number;
    longitude: number;
    timezone?: string;
  }>;
};

export class WeatherError extends Error {
  code: "not-found" | "network" | "location";

  constructor(message: string, code: "not-found" | "network" | "location") {
    super(message);
    this.name = "WeatherError";
    this.code = code;
  }
}

export const defaultLocation: GeoLocation = {
  name: "武汉",
  country: "中国",
  admin1: "湖北省",
  latitude: 30.5928,
  longitude: 114.3055,
  timezone: "Asia/Shanghai"
};

export async function searchCity(query: string): Promise<GeoLocation> {
  const keyword = query.trim();
  if (!keyword) throw new WeatherError("请输入城市名称。", "not-found");

  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", keyword);
  url.searchParams.set("count", "1");
  url.searchParams.set("language", "zh");
  url.searchParams.set("format", "json");

  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new WeatherError("网络连接失败，请稍后再试。", "network");
  }

  if (!response.ok) throw new WeatherError("城市搜索服务暂时不可用。", "network");
  const data = (await response.json()) as GeoResponse;
  const result = data.results?.[0];
  if (!result) throw new WeatherError(`没有找到“${keyword}”，试试输入更完整的城市名。`, "not-found");

  return {
    name: result.name,
    country: result.country,
    admin1: result.admin1,
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone
  };
}

export async function getWeather(location: GeoLocation): Promise<WeatherBundle> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(location.latitude));
  url.searchParams.set("longitude", String(location.longitude));
  url.searchParams.set(
    "current",
    "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m"
  );
  url.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max"
  );
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", "7");

  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new WeatherError("天气服务连接失败，请检查网络。", "network");
  }

  if (!response.ok) throw new WeatherError("天气数据暂时不可用，请稍后再试。", "network");
  const data = (await response.json()) as OpenMeteoResponse;
  if (!data.current || !data.daily) throw new WeatherError("天气数据格式异常。", "network");

  return {
    location,
    current: {
      time: data.current.time,
      temperature: data.current.temperature_2m,
      apparentTemperature: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      precipitation: data.current.precipitation,
      weatherCode: data.current.weather_code,
      windSpeed: data.current.wind_speed_10m,
      isDay: data.current.is_day === 1
    },
    daily: data.daily.time.map((date, index) => ({
      date,
      weatherCode: data.daily.weather_code[index],
      max: data.daily.temperature_2m_max[index],
      min: data.daily.temperature_2m_min[index],
      precipitationProbability: data.daily.precipitation_probability_max[index] ?? 0
    })),
    timezone: data.timezone,
    updatedAt: new Date().toISOString()
  };
}

export function weatherMeta(code: number): { label: string; kind: WeatherKind } {
  if (code === 0) return { label: "晴", kind: "sun" };
  if (code === 1) return { label: "大部晴朗", kind: "cloud-sun" };
  if (code === 2) return { label: "多云", kind: "cloud-sun" };
  if (code === 3) return { label: "阴", kind: "cloud" };
  if (code === 45 || code === 48) return { label: "雾", kind: "fog" };
  if (code >= 51 && code <= 57) return { label: "毛毛雨", kind: "drizzle" };
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return { label: "雨", kind: "rain" };
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return { label: "雪", kind: "snow" };
  if (code >= 95) return { label: "雷暴", kind: "storm" };
  return { label: "天气变化中", kind: "cloud" };
}

export function weatherKindFor(code: number, isDay: boolean): WeatherKind {
  const meta = weatherMeta(code);
  if (!isDay && meta.kind === "sun") return "moon";
  if (!isDay && meta.kind === "cloud-sun") return "cloud-moon";
  return meta.kind;
}
