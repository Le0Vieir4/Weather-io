import { z } from 'zod';
export const WeatherSchema = z.object({
  city: z.string(),
  current_temp_c: z.number(),
  apparent_temp_c: z.number(),
  humidity: z.number(),
  rain_mm: z.number(),
  rain_probability: z.number().int().min(0).max(100),
  temp_max: z.number().int(),
  temp_min: z.number().int(),
  apparent_temp_max: z.number().int(),
  apparent_temp_min: z.number().int(),
  uv_index_max: z.number().int(),
  rain_sum: z.number(),
  time: z.string(),
});

export type Weather = z.infer<typeof WeatherSchema>;
