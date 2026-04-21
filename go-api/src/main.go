package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"go-api/src/config"
	"go-api/src/middlewares"
	"go-api/src/routes"
)

// @title Interseguro Matrix Challenge API
// @version 1.0
// @description API para manipular matrices y calcular estadísticas.
// @securityDefinitions.apikey Bearer
// @in header
// @name Authorization
func main() {
	cfg := config.Load()

	app := fiber.New(fiber.Config{
		ErrorHandler: middlewares.ErrorHandler,
	})

	app.Use(recover.New())

	// ✅ CORS
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173,http://127.0.0.1:5173",
		AllowMethods: "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))

	routes.Register(app, cfg)

	log.Printf("Go API running on :%s (NODE_API_URL=%s)\n", cfg.Port, cfg.NodeApiURL)
	_ = app.Listen(":" + cfg.Port)
}