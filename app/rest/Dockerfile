FROM golang:latest
RUN go build -o main .

COPY go.mod .
COPY go.sum .
COPY main .
COPY . .
RUN go mod download

CMD ["./main"]