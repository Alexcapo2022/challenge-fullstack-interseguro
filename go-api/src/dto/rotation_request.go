package dto

type RotationRequest struct {
	Matrix    [][]float64 `json:"matrix"`
	Degrees   int         `json:"degrees"`   // 90, 180, 270 (default 90)
	Direction string      `json:"direction"` // "cw" or "ccw" (default "cw")
}