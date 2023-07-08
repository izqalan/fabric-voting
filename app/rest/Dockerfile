FROM golang:latest
COPY /test-network /test-network

WORKDIR /app/rest

COPY go.mod /app/rest
COPY go.sum /app/rest

WORKDIR /app/rest
RUN go build -o main .
CMD ["./main"]
