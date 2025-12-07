# Build stage
FROM golang:1.23 AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o consumer main.go transformData.go

# Final image
FROM debian:bookworm-slim
WORKDIR /app
COPY --from=builder /app/consumer .
CMD ["./consumer"]
