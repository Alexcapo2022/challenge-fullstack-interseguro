package utils

import "fmt"

func ValidateMatrix(m [][]float64) (rows int, cols int, err error) {
	if m == nil || len(m) == 0 {
		return 0, 0, fmt.Errorf("matrix must not be empty")
	}
	if m[0] == nil || len(m[0]) == 0 {
		return 0, 0, fmt.Errorf("matrix must have at least 1 column")
	}

	rows = len(m)
	cols = len(m[0])

	for i := 0; i < rows; i++ {
		if m[i] == nil {
			return 0, 0, fmt.Errorf("matrix row %d is null", i)
		}
		if len(m[i]) != cols {
			return 0, 0, fmt.Errorf("matrix must be rectangular: row %d has %d cols, expected %d", i, len(m[i]), cols)
		}
	}

	return rows, cols, nil
}