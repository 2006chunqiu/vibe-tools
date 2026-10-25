import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { format, isToday, parseISO } from "date-fns";
import { zhCN } from "date-fns/locale";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSun,
  Droplets,
  LocateFixed,
  MapPin,
  MoonStar,
  RefreshCw,
  Search,
  Snowflake,
  Star,
  Sun,
  Thermometer,
  Wind,
  X
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import {
  defaultLocation,
  getWeather,
  searchCity,
  weatherKindFor,
  weatherMeta,
  type GeoLocation,
  type WeatherBundle,
  type WeatherKind
} from "../lib/weather";

const FAVORITES_KEY = "vibe-tools-weather-favorites-v1";
const LAST_KEY = "vibe-tools-weather-last-v1";

const iconMap: Record<WeatherKind, LucideIcon> = {
  sun: Sun,
  moon: MoonStar,
  "cloud-sun": CloudSun,
  "cloud-moon": CloudMoon,
  cloud: Cloud,
  fog: CloudFog,
  drizzle: CloudDrizzle,
  rain: CloudRain,
  snow: Snowflake,
  storm: CloudLightning
};

function parseFavorites(): GeoLocation[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item?.name === "string") : [];
  } catch {
    return [];
  }
}

function readLastLocation(): GeoLocation {
  try {
    const raw = localStorage.getItem(LAST_KEY);
    if (!raw) return defaultLocation;
    const parsed = JSON.parse(raw) as GeoLocation;
    return typeof parsed?.name === "string" && typeof parsed?.latitude === "number" ? parsed : defaultLocation;
  } catch {
    return defaultLocation;
  }
}

export default function WeatherPage() {
  const [query, setQuery] = useState("武汉");
  const [data, setData] = useState<WeatherBundle | null>(null);
  const [favorites, setFavorites] = useState<GeoLocation[]>(parseFavorites);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWeather = useCallback(async (location: GeoLocation) => {
    setLoading(true);
    setError("");
    try {
      const bundle = await getWeather(location);
      setData(bundle);
      setQuery(location.name);
      localStorage.setItem(LAST_KEY, JSON.stringify(location));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "天气查询失败，请稍后再试。");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadWeather(readLastLocation());
  }, [loadWeather]);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const currentMeta = data ? weatherMeta(data.current.weatherCode) : null;
  const currentIcon = data ? weatherKindFor(data.current.weatherCode, data.current.isDay) : "cloud";
  const CurrentIcon = iconMap[currentIcon];
  const isFavorite = data
    ? favorites.some(
        (favorite) =>
          Math.abs(favorite.latitude - data.location.latitude) < 0.001 &&
          Math.abs(favorite.longitude - data.location.longitude) < 0.001
      )
    : false;

  const today = data?.daily[0];
  const temperatureRange = useMemo(() => {
    if (!data) return "";
    const values = data.daily.flatMap((day) => [day.max, day.min]);
    return `${Math.round(Math.min(...values))}° ~ ${Math.round(Math.max(...values))}°`;
  }, [data]);

  const handleSearch = async (event: FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const location = await searchCity(query);
      await loadWeather(location);
    } catch (reason) {
      setLoading(false);
      setError(reason instanceof Error ? reason.message : "没有找到这个城市。");
    }
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setError("当前浏览器不支持定位，请手动输入城市。");
      return;
    }
    setLoading(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        void loadWeather({
          name: "当前位置",
          country: "中国",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (geoError) => {
        setLoading(false);
        setError(
          geoError.code === geoError.PERMISSION_DENIED
            ? "定位权限被拒绝，请手动输入城市，或在浏览器设置中允许定位。"
            : "暂时无法获取当前位置，请手动输入城市。"
        );
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 10 * 60 * 1000 }
    );
  };

  const addFavorite = () => {
    if (!data) return;
    const exists = favorites.some(
      (favorite) =>
        Math.abs(favorite.latitude - data.location.latitude) < 0.001 &&
        Math.abs(favorite.longitude - data.location.longitude) < 0.001
    );
    if (exists) return;
    setFavorites((items) => [...items, data.location].slice(-8));
  };

  const removeFavorite = (location: GeoLocation) => {
    setFavorites((items) =>
      items.filter(
        (item) =>
          Math.abs(item.latitude - location.latitude) > 0.001 ||
          Math.abs(item.longitude - location.longitude) > 0.001
      )
    );
  };

  return (
    <div>
      <PageHeader
        index="05"
        kicker="PROJECT / WEATHER NOW"
        title="天气，查得刚刚好。"
        description="输入城市或使用当前位置，查看实时天气、体感温度、湿度和未来 7 日预报。使用 Open-Meteo 公开接口，无需 API Key。"
        icon={<CloudSun className="h-7 w-7" />}
        accent="text-cyan"
        actions={
          <span className="chip">
            <span className="h-1 w-1 rounded-full bg-cyan" /> Open-Meteo API · No Key
          </span>
        }
      />

      <div className="shell">
        <div className="card p-4 sm:p-5">
          <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row">
            <label className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="field pl-10"
                placeholder="输入城市，例如：武汉、上海、London…"
                aria-label="输入城市名称"
              />
            </label>
            <div className="flex gap-2">
              <button type="submit" disabled={loading} className="btn-primary flex-1 sm:flex-none">
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                查询天气
              </button>
              <button type="button" onClick={handleGeolocate} className="btn-secondary" aria-label="使用当前位置">
                <LocateFixed className="h-4 w-4" />
                <span className="hidden sm:inline">定位</span>
              </button>
            </div>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/20">收藏城市</span>
            {favorites.length === 0 ? (
              <span className="text-[9px] text-white/25">查询后可点击星标收藏</span>
            ) : (
              favorites.map((favorite) => (
                <span key={`${favorite.latitude}-${favorite.longitude}`} className="group flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] py-1 pl-3 pr-1.5">
                  <button
                    type="button"
                    onClick={() => void loadWeather(favorite)}
                    className="text-[9px] text-white/55 transition hover:text-lime"
                  >
                    {favorite.name}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFavorite(favorite)}
                    className="grid h-4 w-4 place-items-center rounded-full text-white/25 transition hover:bg-rose-400/15 hover:text-rose-300"
                    aria-label={`删除收藏城市 ${favorite.name}`}
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        {loading && !data && <WeatherSkeleton />}

        {error && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-rose-400/20 bg-rose-400/[0.06] p-4">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-none text-rose-300" />
            <div>
              <p className="text-[11px] text-rose-200/90">{error}</p>
              <p className="mt-1 text-[9px] text-white/25">可以换一个城市名，或稍后重试。</p>
            </div>
            <button
              type="button"
              onClick={() => void loadWeather(data?.location ?? readLastLocation())}
              className="ml-auto text-[9px] text-white/40 transition hover:text-white"
            >
              重试
            </button>
          </div>
        )}

        {data && (
          <>
            {loading && (
              <div className="mt-3 flex items-center gap-2 text-[9px] text-white/30">
                <RefreshCw className="h-3 w-3 animate-spin" /> 正在更新天气…
              </div>
            )}

            <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="card relative overflow-hidden p-6 sm:p-8">
                <div className="absolute -right-28 -top-32 h-80 w-80 rounded-full bg-cyan/10 blur-[90px]" />
                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] text-white/35">
                        <MapPin className="h-3 w-3" />
                        {data.location.name}
                        {data.location.admin1 && <span className="text-white/20">· {data.location.admin1}</span>}
                        {data.location.country && <span className="text-white/20">· {data.location.country}</span>}
                      </div>
                      <div className="mt-5 flex items-end gap-1.5">
                        <span className="font-display text-[96px] font-medium leading-[0.85] tracking-[-0.08em] text-white sm:text-[118px]">
                          {Math.round(data.current.temperature)}
                        </span>
                        <span className="pb-3 text-3xl font-light text-white/40">°C</span>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <span className="text-sm text-white/75">{currentMeta?.label}</span>
                        <span className="text-[10px] text-white/30">
                          体感 {Math.round(data.current.apparentTemperature)}°
                        </span>
                        {today && (
                          <span className="text-[10px] text-white/30">
                            最高 {Math.round(today.max)}° / 最低 {Math.round(today.min)}°
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="relative flex flex-none flex-col items-center gap-3">
                      <CurrentIcon className="h-20 w-20 text-cyan/80 sm:h-24 sm:w-24" strokeWidth={1.1} />
                      <button
                        type="button"
                        onClick={addFavorite}
                        className={`flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-[9px] transition ${
                          isFavorite
                            ? "border-amber-300/25 bg-amber-300/10 text-amber-300"
                            : "border-white/10 bg-white/[0.04] text-white/35 hover:border-lime/30 hover:text-lime"
                        }`}
                        disabled={isFavorite}
                      >
                        <Star className={`h-3 w-3 ${isFavorite ? "fill-amber-300" : ""}`} />
                        {isFavorite ? "已收藏" : "收藏城市"}
                      </button>
                    </div>
                  </div>

                  <div className="mt-10 grid grid-cols-2 gap-2 border-t border-white/[0.08] pt-5 sm:grid-cols-4">
                    <WeatherMetric icon={<Thermometer className="h-3.5 w-3.5" />} label="体感温度" value={`${Math.round(data.current.apparentTemperature)}°`} />
                    <WeatherMetric icon={<Droplets className="h-3.5 w-3.5" />} label="湿度" value={`${Math.round(data.current.humidity)}%`} />
                    <WeatherMetric icon={<Wind className="h-3.5 w-3.5" />} label="风速" value={`${Math.round(data.current.windSpeed)} km/h`} />
                    <WeatherMetric icon={<CloudRain className="h-3.5 w-3.5" />} label="降水" value={`${data.current.precipitation} mm`} />
                  </div>
                </div>
              </div>

              <div className="card flex flex-col justify-between p-6">
                <div>
                  <span className="label">NOW / DETAILS</span>
                  <h2 className="mt-3 font-display text-2xl font-medium text-white">此刻的天气</h2>
                  <p className="mt-2 text-xs leading-6 text-white/35">
                    {data.location.name} 今天的气温范围是 {temperatureRange}，降水概率最高{" "}
                    {Math.round(Math.max(...data.daily.map((day) => day.precipitationProbability)))}%。
                  </p>
                </div>
                <div className="mt-7 grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-white/[0.07] bg-black/20 p-3">
                    <div className="font-mono text-[8px] text-white/25">更新时间</div>
                    <div className="mt-1 text-[11px] text-white/65">{data.current.time.slice(11, 16)}</div>
                  </div>
                  <div className="rounded-xl border border-white/[0.07] bg-black/20 p-3">
                    <div className="font-mono text-[8px] text-white/25">时区</div>
                    <div className="mt-1 truncate text-[11px] text-white/65">{data.timezone}</div>
                  </div>
                  <div className="rounded-xl border border-white/[0.07] bg-black/20 p-3">
                    <div className="font-mono text-[8px] text-white/25">今日降水概率</div>
                    <div className="mt-1 text-[11px] text-white/65">{Math.round(today?.precipitationProbability ?? 0)}%</div>
                  </div>
                  <div className="rounded-xl border border-white/[0.07] bg-black/20 p-3">
                    <div className="font-mono text-[8px] text-white/25">数据来源</div>
                    <div className="mt-1 text-[11px] text-white/65">Open-Meteo</div>
                  </div>
                </div>
                <p className="mt-5 text-[9px] leading-5 text-white/20">
                  天气数据为公开接口的实时结果，存在一定更新延迟，仅作学习与日常参考。
                </p>
              </div>
            </div>

            <div className="card mt-4 p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="label">FORECAST / 7 DAYS</span>
                  <h2 className="mt-2 text-lg font-medium text-white">未来 7 天</h2>
                </div>
                <span className="font-mono text-[8px] text-white/20">{data.daily[0]?.date.slice(0, 4)}</span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                {data.daily.map((day) => {
                  const meta = weatherMeta(day.weatherCode);
                  const kind = weatherKindFor(day.weatherCode, true);
                  const Icon = iconMap[kind];
                  const tomorrow = isToday(parseISO(day.date));
                  return (
                    <div
                      key={day.date}
                      className={`rounded-xl border p-3 text-center ${
                        tomorrow ? "border-cyan/25 bg-cyan/[0.07]" : "border-white/[0.07] bg-black/20"
                      }`}
                    >
                      <div className={`font-mono text-[8px] ${tomorrow ? "text-cyan" : "text-white/30"}`}>
                        {tomorrow ? "今天" : format(parseISO(day.date), "EEE", { locale: zhCN })}
                      </div>
                      <div className="mt-3 flex justify-center">
                        <Icon className={`h-6 w-6 ${tomorrow ? "text-cyan/80" : "text-white/45"}`} strokeWidth={1.5} />
                      </div>
                      <div className="mt-2 text-[10px] text-white/45">{meta.label}</div>
                      <div className="mt-2 text-[11px] text-white/75">
                        {Math.round(day.max)}° <span className="text-white/25">/ {Math.round(day.min)}°</span>
                      </div>
                      <div className="mt-1 flex items-center justify-center gap-0.5 text-[8px] text-cyan/45">
                        <Droplets className="h-2.5 w-2.5" /> {Math.round(day.precipitationProbability)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {!data && !loading && !error && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <CloudSun className="mx-auto h-10 w-10 text-white/20" />
            <p className="mt-4 text-sm text-white/50">输入城市开始查询天气。</p>
          </div>
        )}
      </div>
    </div>
  );
}

function WeatherMetric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-white/25">
        {icon}
        <span className="font-mono text-[7px] uppercase tracking-[0.1em]">{label}</span>
      </div>
      <div className="mt-1.5 text-sm text-white/70">{value}</div>
    </div>
  );
}

function WeatherSkeleton() {
  return (
    <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="card skeleton h-[300px]" />
      <div className="card skeleton h-[300px]" />
    </div>
  );
}
