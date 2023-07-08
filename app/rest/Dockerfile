FROM golang:latest
RUN go build -o main .

COPY . .
RUN go mod download

CMD ["./main"]