package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/rabbitmq/amqp091-go"
)

// --- Estruturas do JSON enviado pelo Python ---
type Location struct {
	City      string  `json:"city"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Timezone  string  `json:"timezone"`
}

type Current struct {
	Time                string  `json:"time"`
	Temperature         int     `json:"temperature"`
	ApparentTemperature int     `json:"apparentTemperature"`
	RelativeHumidity    int     `json:"relativeHumidity"`
	IsDay               bool    `json:"isDay"`
	PrecipitationMm     float64 `json:"precipitationMm"`
	RainMm              float64 `json:"rainMm"`
	RainProbability     int     `json:"rainProbability"`
}

type Daily struct {
	TemperatureMax         int     `json:"temperatureMax"`
	TemperatureMin         int     `json:"temperatureMin"`
	ApparentTemperatureMax int     `json:"apparentTemperatureMax"`
	ApparentTemperatureMin int     `json:"apparentTemperatureMin"`
	UVIndexMax             int     `json:"uvIndexMax"`
	RainSum                float64 `json:"rainSum"`
}

type WeatherInput struct {
	Location Location `json:"location"`
	Current  Current  `json:"current"`
	Daily    Daily    `json:"daily"`
}

// --- Estrutura transformada para enviar ao NestJS ---
type WeatherTransformed struct {
	City            string  `json:"city"`
	CurrentTempC    float64 `json:"current_temp_c"`
	ApparentTempC   float64 `json:"apparent_temp_c"`
	Humidity        float64 `json:"humidity"`
	RainMm          float64 `json:"rain_mm"`
	RainProbability int     `json:"rain_probability"`
	TempMax         int     `json:"temp_max"`
	TempMin         int     `json:"temp_min"`
	ApparentTempMax int     `json:"apparent_temp_max"`
	ApparentTempMin int     `json:"apparent_temp_min"`
	UVIndexMax      int     `json:"uv_index_max"`
	RainSum         float64 `json:"rain_sum"`
	Time            string  `json:"time"`
}

func main() {

	conn, err := amqp091.DialConfig("amqp://guest:guest@host.docker.internal", amqp091.Config{
		Heartbeat: 30,
	})
	if err != nil {
		log.Fatalf("Erro ao conectar no RabbitMQ: %v", err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("Erro ao abrir canal: %v", err)
	}
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"weather",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatalf("Erro ao declarar fila: %v", err)
	}

	msgs, err := ch.Consume(
		q.Name,
		"",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatalf("Erro ao consumir fila: %v", err)
	}

	fmt.Println("Consumer Go aguardando mensagens...")

	for msg := range msgs {
		fmt.Println("Mensagem recebida:", string(msg.Body))

		var input WeatherInput
		if err := json.Unmarshal(msg.Body, &input); err != nil {
			fmt.Println("JSON inválido:", err)
			continue
		}

		// Transformar os dados
		transformed := WeatherTransformed{
			City:            fmt.Sprintf("%s: [%.4f,%.4f]", input.Location.City, input.Location.Latitude, input.Location.Longitude),
			CurrentTempC:    float64(input.Current.Temperature),
			ApparentTempC:   float64(input.Current.ApparentTemperature),
			Humidity:        float64(input.Current.RelativeHumidity),
			RainMm:          input.Current.RainMm,
			RainProbability: input.Current.RainProbability,
			TempMax:         input.Daily.TemperatureMax,
			TempMin:         input.Daily.TemperatureMin,
			ApparentTempMax: input.Daily.ApparentTemperatureMax,
			ApparentTempMin: input.Daily.ApparentTemperatureMin,
			UVIndexMax:      input.Daily.UVIndexMax,
			RainSum:         input.Daily.RainSum,
			Time:            input.Current.Time,
		}

		payload, _ := json.Marshal(transformed)

		resp, err := http.Post("http://localhost:3000/weather/logs", "application/json", bytes.NewBuffer(payload))
		if err != nil {
			fmt.Println("Erro ao enviar ao NestJS:", err)
			continue
		}
		resp.Body.Close()

		fmt.Println("Enviado ao NestJS:", string(payload))
	}
}
