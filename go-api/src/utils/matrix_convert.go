package utils

import "gonum.org/v1/gonum/mat"

func ToDense(m [][]float64) *mat.Dense {
	r := len(m)
	c := len(m[0])
	data := make([]float64, 0, r*c)
	for i := 0; i < r; i++ {
		data = append(data, m[i]...)
	}
	return mat.NewDense(r, c, data)
}

func DenseTo2D(d *mat.Dense) [][]float64 {
	r, c := d.Dims()
	out := make([][]float64, r)
	for i := 0; i < r; i++ {
		row := make([]float64, c)
		for j := 0; j < c; j++ {
			row[j] = d.At(i, j)
		}
		out[i] = row
	}
	return out
}

// Flatten convierte [][]float64 a []float64 en orden row-major
func Flatten(m [][]float64) []float64 {
	if m == nil || len(m) == 0 {
		return []float64{}
	}
	rows := len(m)
	cols := len(m[0])
	out := make([]float64, 0, rows*cols)

	for i := 0; i < rows; i++ {
		out = append(out, m[i]...)
	}
	return out
}