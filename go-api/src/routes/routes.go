package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/swagger"
	"go-api/src/config"
	"go-api/src/controllers"
	_ "go-api/src/docs"
	"go-api/src/middlewares"
	"go-api/src/services"
)

func Register(app *fiber.App, cfg config.Config) {
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"ok": true, "nodeApi": cfg.NodeApiURL})
	})

	app.Get("/swagger/*", swagger.HandlerDefault)

	// Dependencies
	statsClient := services.NewStatsClient(cfg.NodeApiURL)
	qrSvc := services.NewQRService()
	rotSvc := services.NewRotateService()

	ctrl := controllers.NewMatrixController(qrSvc, rotSvc, statsClient)
	authCtrl := controllers.NewAuthController()

	api := app.Group("/api")
	v1 := api.Group("/v1")

	// 🔐 Auth
	v1.Post("/auth/login", authCtrl.Login)

	// 🛡️ Protected Resources
	matrices := v1.Group("/matrices", middlewares.AuthMiddleware)
	matrices.Post("/qr", ctrl.QR)
	matrices.Post("/rotation", ctrl.Rotate)
}