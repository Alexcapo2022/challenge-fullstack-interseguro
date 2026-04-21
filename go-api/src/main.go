package main

import (
	"log"
	"os"

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

	// 🌐 Puerto dinámico para Render
	port := os.Getenv("PORT")
	if port == "" {
		port = cfg.Port
	}

	app := fiber.New(fiber.Config{
		ErrorHandler: middlewares.ErrorHandler,
	})

	app.Use(recover.New())

	// ✅ CORS dinámico
	allowedOrigin := os.Getenv("ALLOWED_ORIGIN")
	if allowedOrigin == "" {
		allowedOrigin = "http://localhost:5173,http://127.0.0.1:5173"
	}

	app.Use(cors.New(cors.Config{
		AllowOrigins: allowedOrigin,
		AllowMethods: "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))

	routes.Register(app, cfg)

	log.Printf("Go API ejecutándose en puerto :%s\n", port)
	_ = app.Listen(":" + port)
}