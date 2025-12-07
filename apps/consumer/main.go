package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/rabbitmq/amqp091-go"
)

// --- Structures from JSON sent by Python ---
type Location struct {
	City      string  `json:"city"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Timezone  string  `json:"timezone"`
	PastDays  int     `json:"pastDays"`
}

type Current struct {
	Time                     string  `json:"time"`
	Temperature              float64 `json:"temperature"`
	RelativeHumidity         float64 `json:"relativeHumidity"`
	ApparentTemperature      float64 `json:"apparentTemperature"`
	IsDay                    bool    `json:"isDay"`
	Uv                       float64 `json:"uv"`
	PrecipitationProbability int     `json:"precipitationProbability"`
	WeatherCode              string  `json:"weatherCode"`
}

type Daily struct {
	Date                     string  `json:"date"`
	TemperatureMax           float64 `json:"temperatureMax"`
	TemperatureMin           float64 `json:"temperatureMin"`
	ApparentTemperatureMax   float64 `json:"apparentTemperatureMax"`
	ApparentTemperatureMin   float64 `json:"apparentTemperatureMin"`
	UVIndexMax               float64 `json:"uvIndexMax"`
	PrecipitationProbability int     `json:"precipitationProbability"`
	WeatherCode              string  `json:"weatherCode"`
}

type WeatherInput struct {
	Location  Location `json:"location"`
	Current   Current  `json:"current"`
	Daily     []Daily  `json:"daily"`
	AIInsight string   `json:"aiInsight,omitempty"`
}

// --- Transformed structure to send to NestJS ---
type WeatherTransformed struct {
	Time      string    `json:"time"`
	City      string    `json:"city"`
	Current   []Current `json:"current"`
	Daily     []Daily   `json:"daily"`
	AIInsight string    `json:"aiInsight,omitempty"`
}

func main() {

	postUrl := os.Getenv("API_URL")
	rabbitUrl := os.Getenv("RABBIT_URL")

	// Retry connection to RabbitMQ
	var err error
	var conn *amqp091.Connection
	maxRetries := 10
	for i := 0; i < maxRetries; i++ {
		conn, err = amqp091.DialConfig(rabbitUrl, amqp091.Config{
			Heartbeat: 30,
		})
		if err == nil {
			break
		}
		log.Printf("Attempt %d failed: %v. Retrying...", i+1, err)
		if i < maxRetries-1 {
			time.Sleep(5 * time.Second)
		}
	}
	if err != nil {
		log.Fatalf("❌ Error connecting to RabbitMQ after %d attempts: %v", maxRetries, err)
	}

	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("❌ Error opening channel: %v", err)
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
		log.Fatalf("❌ Error declaring queue: %v", err)
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
		log.Fatalf("❌ Error consuming queue: %v", err)
	}

	fmt.Println("Go consumer waiting for messages...")

	for msg := range msgs {
		fmt.Println("✅ Message received successfully!")

		var input WeatherInput
		if err := json.Unmarshal(msg.Body, &input); err != nil {
			fmt.Println("❌ Invalid JSON:", err)
			continue
		}

		// Transform the data
		transformed := transformData(input)

		payload, _ := json.Marshal(transformed)

		resp, err := http.Post(postUrl+"weather", "application/json", bytes.NewBuffer(payload))
		if err != nil {
			fmt.Println("❌ Error sending to NestJS:", err)
			continue
		}
		resp.Body.Close()

		fmt.Println("✅ Sent to API successfully!")
	}
}
