package main

import (
	_ "github.com/izqalan/fabric-voting/app/docs"
	r "github.com/izqalan/fabric-voting/app/routes"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title     Fabric Voting API
// @version         1.0
// @description     A Voting DLT service API in Go using Gin framework.

// @contact.name   Izqalan Nor'Izad
// @contact.url    https://github.com/izqalan
// @contact.email  izqalan@duck.com

// @host      localhost:8081
// @BasePath  /api/v1

func main() {
	r := r.SetupRouter()
	r.GET("/docs/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	r.Run(":8081")
}
