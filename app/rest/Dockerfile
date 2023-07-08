FROM golang:latest

COPY . .

# ls dir
RUN ls -la

WORKDIR /app/rest

# ls dir
RUN ls -la

RUN go build -o main .

CMD ["./main"]