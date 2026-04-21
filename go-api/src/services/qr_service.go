package services

import (
	"fmt"

	"go-api/src/utils"
	"gonum.org/v1/gonum/mat"
)

type QRService struct{}

func NewQRService() *QRService { return &QRService{} }

func (s *QRService) ComputeQR(matrix [][]float64) ([][]float64, [][]float64, error) {
	rows, cols, err := utils.ValidateMatrix(matrix)
	if err != nil {
		return nil, nil, err
	}
	if rows < cols {
		return nil, nil, fmt.Errorf("matriz inválida: las filas (%d) deben ser >= a las columnas (%d)", rows, cols)
	}

	data := utils.Flatten(matrix) // si ya lo tienes; si no, te lo paso
	A := mat.NewDense(rows, cols, data)

	var qr mat.QR
	qr.Factorize(A)

	var Q, R mat.Dense
	qr.QTo(&Q)
	qr.RTo(&R)

	return utils.DenseTo2D(&Q), utils.DenseTo2D(&R), nil
}