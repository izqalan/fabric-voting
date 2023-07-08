FROM golang:latest
RUN go build -o main .

COPY go.mod .
COPY go.sum .
COPY main .
RUN go mod download

COPY . .

CMD ["./main"]