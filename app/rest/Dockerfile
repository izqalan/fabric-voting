FROM golang:latest
RUN go build -o main .

COPY go.mod .
COPY go.sum .
RUN go mod download

COPY . .

CMD ["./main"]