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

// QR godoc
// @Summary Factorización QR
// @Description Calcula Q y R y obtiene estadísticas del microservicio Node.
// @Tags Matrices
// @Security Bearer
// @Accept json
// @Produce json
// @Param request body dto.MatrixRequest true "Matriz A"
// @Success 200 {object} map[string]interface{}
// @Router /api/v1/matrices/qr [post]
func (mc *MatrixController) QR(c *fiber.Ctx) error {
	var req dto.MatrixRequest
	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Cuerpo JSON inválido")
	}

	Q, R, err := mc.qrService.ComputeQR(req.Matrix)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	token := c.Get("Authorization")
	stats, err := mc.statsClient.GetStats(map[string][][]float64{
		"Q": Q,
		"R": R,
	}, token)

	// ✅ Downstream failure should not break primary result
	if err != nil {
		return c.JSON(fiber.Map{
			"qr":      fiber.Map{"Q": Q, "R": R},
			"stats":   nil,
			"warning": "QR calculado con éxito, pero el servicio de estadísticas no está disponible",
			"detail":  err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"qr":    fiber.Map{"Q": Q, "R": R},
		"stats": stats,
	})
}

// Rotate godoc
// @Summary Rotar Matriz
// @Description Rota la matriz y obtiene estadísticas del microservicio Node.
// @Tags Matrices
// @Security Bearer
// @Accept json
// @Produce json
// @Param request body dto.RotationRequest true "Matriz y parámetros de rotación"
// @Success 200 {object} map[string]interface{}
// @Router /api/v1/matrices/rotation [post]
func (mc *MatrixController) Rotate(c *fiber.Ctx) error {
	var req dto.RotationRequest
	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Cuerpo JSON inválido")
	}

	rotated, err := mc.rotateService.Rotate(req.Matrix, req.Degrees, req.Direction)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	token := c.Get("Authorization")
	stats, err := mc.statsClient.GetStats(map[string][][]float64{
		"Rotated": rotated,
	}, token)
	if err != nil {
		return c.JSON(fiber.Map{
			"rotated": rotated,
			"stats":   nil,
			"warning": "Rotación calculada con éxito, pero el servicio de estadísticas no está disponible",
			"detail":  err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"rotated": rotated,
		"stats":   stats,
	})
}