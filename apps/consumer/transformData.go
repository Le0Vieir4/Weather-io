package main

import (
	"fmt"
	"math"
)

func transformData(input WeatherInput) WeatherTransformed {
	// --- Transform CURRENT ---
	current := input.Current

	// Round UV to 1 decimal place
	current.Uv = math.Round(current.Uv*10) / 10

	// Round temperatures to nearest integer
	current.Temperature = math.Round(current.Temperature)
	current.ApparentTemperature = math.Round(current.ApparentTemperature)

	// Place in a slice because the output struct requires []Current
	currentSlice := []Current{current}

	// --- Transform DAILY ---
	var processedDaily []Daily
	for _, day := range input.Daily {
		d := day

		// Ensure precipitation probability is not negative
		if d.PrecipitationProbability < 0 {
			d.PrecipitationProbability = 0
		}

		// Round temperatures to nearest integer
		d.TemperatureMax = math.Round(d.TemperatureMax)
		d.TemperatureMin = math.Round(d.TemperatureMin)
		d.ApparentTemperatureMax = math.Round(d.ApparentTemperatureMax)
		d.ApparentTemperatureMin = math.Round(d.ApparentTemperatureMin)

		// Round UV Index to 1 decimal place
		d.UVIndexMax = math.Round(d.UVIndexMax*10) / 10

		processedDaily = append(processedDaily, d)
	}

	// --- Final assembly ---
	return WeatherTransformed{
		City:      input.Location.City,
		Time:      fmt.Sprintf("%s - %s", input.Current.Time, input.Location.Timezone),
		Current:   currentSlice,
		Daily:     processedDaily,
		AIInsight: input.AIInsight,
	}
}
