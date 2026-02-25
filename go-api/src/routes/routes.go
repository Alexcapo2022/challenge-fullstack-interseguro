package routes

import (
	"github.com/gofiber/fiber/v2"
	"go-api/src/config"
	"go-api/src/controllers"
	"go-api/src/services"
)

func Register(app *fiber.App, cfg config.Config) {
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"ok": true, "nodeApi": cfg.NodeApiURL})
	})

	// Dependencies
	statsClient := services.NewStatsClient(cfg.NodeApiURL)
	qrSvc := services.NewQRService()
	rotSvc := services.NewRotateService()

	ctrl := controllers.NewMatrixController(qrSvc, rotSvc, statsClient)

	api := app.Group("/api")
	v1 := api.Group("/v1")

	// REST-ish resources
	matrices := v1.Group("/matrices")
	matrices.Post("/qr", ctrl.QR)
	matrices.Post("/rotation", ctrl.Rotate)
}