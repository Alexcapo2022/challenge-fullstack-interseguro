package services

import (
	"errors"
	"strings"

	"go-api/src/utils"
)

type RotateService struct{}

func NewRotateService() *RotateService {
	return &RotateService{}
}

func (s *RotateService) Rotate(matrix [][]float64, degrees int, direction string) ([][]float64, error) {
	_, _, err := utils.ValidateMatrix(matrix)
	if err != nil {
		return nil, err
	}

	// defaults
	if degrees == 0 {
		degrees = 90
	}
	if direction == "" {
		direction = "cw"
	}
	direction = strings.ToLower(direction)

	if direction != "cw" && direction != "ccw" {
		return nil, errors.New("la dirección debe ser 'cw' (horario) o 'ccw' (antihorario)")
	}

	switch degrees {
	case 90, 180, 270:
	default:
		return nil, errors.New("los grados deben ser 90, 180 o 270")
	}

	// normalize ccw -> cw
	if direction == "ccw" {
		if degrees == 90 {
			degrees = 270
		} else if degrees == 270 {
			degrees = 90
		}
	}

	switch degrees {
	case 90:
		return utils.Rotate90CW(matrix), nil
	case 180:
		return utils.Rotate180(matrix), nil
	case 270:
		return utils.Rotate270CW(matrix), nil
	default:
		return nil, errors.New("rotación no soportada")
	}
}