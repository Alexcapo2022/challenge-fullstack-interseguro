package middlewares

import "github.com/gofiber/fiber/v2"

// ErrorHandler centralizado tipo Express
func ErrorHandler(c *fiber.Ctx, err error) error {
	if e, ok := err.(*fiber.Error); ok {
		return c.Status(e.Code).JSON(fiber.Map{"error": e.Message})
	}
	return c.Status(500).JSON(fiber.Map{"error": "Error interno"})
}