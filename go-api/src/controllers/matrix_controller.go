package controllers

import (
	"github.com/gofiber/fiber/v2"
	"go-api/src/contracts"
	"go-api/src/dto"
)

type MatrixController struct {
	qrService     contracts.QRService
	rotateService contracts.RotateService
	statsClient   contracts.StatsClient
}

func NewMatrixController(
	qr contracts.QRService,
	rot contracts.RotateService,
	stats contracts.StatsClient,
) *MatrixController {
	return &MatrixController{
		qrService:     qr,
		rotateService: rot,
		statsClient:   stats,
	}
}

func (mc *MatrixController) QR(c *fiber.Ctx) error {
	var req dto.MatrixRequest
	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid JSON body")
	}

	Q, R, err := mc.qrService.ComputeQR(req.Matrix)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	stats, err := mc.statsClient.GetStats(map[string][][]float64{
		"Q": Q,
		"R": R,
	})

	// ✅ Downstream failure should not break primary result
	if err != nil {
		return c.JSON(fiber.Map{
			"qr":      fiber.Map{"Q": Q, "R": R},
			"stats":   nil,
			"warning": "QR computed successfully, but stats service is unavailable",
			"detail":  err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"qr":    fiber.Map{"Q": Q, "R": R},
		"stats": stats,
	})
}

func (mc *MatrixController) Rotate(c *fiber.Ctx) error {
	var req dto.RotationRequest
	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid JSON body")
	}

	rotated, err := mc.rotateService.Rotate(req.Matrix, req.Degrees, req.Direction)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	stats, err := mc.statsClient.GetStats(map[string][][]float64{
		"Rotated": rotated,
	})
	if err != nil {
		return c.JSON(fiber.Map{
			"rotated": rotated,
			"stats":   nil,
			"warning": "Rotation computed successfully, but stats service is unavailable",
			"detail":  err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"rotated": rotated,
		"stats":   stats,
	})
}