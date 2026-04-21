package controllers

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"go-api/src/dto"
)

// TODO: In a real app, use an environment variable for the secret
var jwtSecret = []byte("interseguro-secret-key-2024")

type AuthController struct{}

func NewAuthController() *AuthController {
	return &AuthController{}
}

// Login godoc
// @Summary Iniciar sesión
// @Description Obtiene un token JWT para acceder a las APIs de matrices.
// @Tags Auth
// @Accept json
// @Produce json
// @Param request body dto.LoginRequest true "Credenciales (admin/admin123)"
// @Success 200 {object} map[string]string
// @Router /api/v1/auth/login [post]
func (ac *AuthController) Login(c *fiber.Ctx) error {
	var req dto.LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Cuerpo JSON inválido")
	}

	// 🛡️ Mock Auth: En una prueba técnica, esto es aceptable
	if req.Username != "admin" || req.Password != "admin123" {
		return fiber.NewError(fiber.StatusUnauthorized, "Credenciales inválidas")
	}

	// 🔑 Generar Token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": req.Username,
		"exp":      time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "No se pudo generar el token")
	}

	return c.JSON(fiber.Map{
		"token": tokenString,
	})
}
