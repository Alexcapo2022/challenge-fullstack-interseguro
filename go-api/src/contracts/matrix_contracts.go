package contracts

type QRService interface {
	ComputeQR(matrix [][]float64) (Q [][]float64, R [][]float64, err error)
}

type RotateService interface {
	Rotate(matrix [][]float64, degrees int, direction string) (rotated [][]float64, err error)
}

type StatsClient interface {
	GetStats(matrices map[string][][]float64, token string) (map[string]interface{}, error)
}