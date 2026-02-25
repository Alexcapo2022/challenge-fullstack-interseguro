FROM golang:1.22-alpine AS build

WORKDIR /app

# 1) Copiamos go.mod
COPY go.mod ./

# 2) Copiamos el código para que 'go mod tidy' detecte imports
COPY src ./src

# 3) Ahora sí: descarga deps y genera go.sum automáticamente
RUN go mod tidy

# 4) Compilamos
RUN go build -o server ./src/main.go

FROM alpine:3.20
WORKDIR /app
COPY --from=build /app/server ./server

EXPOSE 8080
CMD ["./server"]