FROM golang:latest

COPY . .

WORKDIR /app/rest

RUN go build -o main .

CMD ["./main"]