FROM golang:1.22 AS builder

WORKDIR /app
COPY . .

RUN go mod download
RUN go build -o consumer .

FROM debian:stable-slim
WORKDIR /app
COPY --from=builder /app/consumer .

CMD ["./consumer"]
