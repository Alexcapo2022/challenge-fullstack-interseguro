package utils

func Rotate90CW(m [][]float64) [][]float64 {
	rows := len(m)
	cols := len(m[0])

	out := make([][]float64, cols)
	for r := 0; r < cols; r++ {
		out[r] = make([]float64, rows)
	}

	for r := 0; r < rows; r++ {
		for c := 0; c < cols; c++ {
			out[c][rows-1-r] = m[r][c]
		}
	}

	return out
}

func Rotate180(m [][]float64) [][]float64 {
	rows := len(m)
	cols := len(m[0])

	out := make([][]float64, rows)
	for r := 0; r < rows; r++ {
		out[r] = make([]float64, cols)
	}

	// output[r][c] = input[rows-1-r][cols-1-c]
	for r := 0; r < rows; r++ {
		for c := 0; c < cols; c++ {
			out[r][c] = m[rows-1-r][cols-1-c]
		}
	}

	return out
}

func Rotate270CW(m [][]float64) [][]float64 {
	rows := len(m)
	cols := len(m[0])

	out := make([][]float64, cols)
	for r := 0; r < cols; r++ {
		out[r] = make([]float64, rows)
	}

	// 270 CW = output[c][r] = input[rows-1-r][c]
	for r := 0; r < rows; r++ {
		for c := 0; c < cols; c++ {
			out[cols-1-c][r] = m[r][c]
		}
	}

	return out
}