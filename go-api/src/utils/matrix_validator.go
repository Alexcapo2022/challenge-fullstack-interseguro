package utils

import "fmt"

func ValidateMatrix(m [][]float64) (rows int, cols int, err error) {
	if m == nil || len(m) == 0 {
		return 0, 0, fmt.Errorf("la matriz no puede estar vacía")
	}
	if m[0] == nil || len(m[0]) == 0 {
		return 0, 0, fmt.Errorf("la matriz debe tener al menos 1 columna")
	}

	rows = len(m)
	cols = len(m[0])

	for i := 0; i < rows; i++ {
		if m[i] == nil {
			return 0, 0, fmt.Errorf("la fila %d de la matriz es nula", i)
		}
		if len(m[i]) != cols {
			return 0, 0, fmt.Errorf("la matriz debe ser rectangular: la fila %d tiene %d columnas, se esperaban %d", i, len(m[i]), cols)
		}
	}

	return rows, cols, nil
}