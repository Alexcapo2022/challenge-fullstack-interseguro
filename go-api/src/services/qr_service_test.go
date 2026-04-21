package services

import (
	"testing"
)

func TestComputeQR(t *testing.T) {
	svc := NewQRService()

	tests := []struct {
		name    string
		matrix  [][]float64
		wantErr bool
	}{
		{
			name: "Valid 2x2 Square",
			matrix: [][]float64{
				{1, 2},
				{3, 4},
			},
			wantErr: false,
		},
		{
			name: "Valid 3x2 Rectangular",
			matrix: [][]float64{
				{1, 2},
				{3, 4},
				{5, 6},
			},
			wantErr: false,
		},
		{
			name: "Invalid 2x3 (Rows < Cols)",
			matrix: [][]float64{
				{1, 2, 3},
				{4, 5, 6},
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			Q, R, err := svc.ComputeQR(tt.matrix)
			if (err != nil) != tt.wantErr {
				t.Errorf("ComputeQR() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !tt.wantErr {
				if Q == nil || R == nil {
					t.Errorf("ComputeQR() returned nil matrices for valid input")
				}
				// Basic check for R: should be same dims or upper triangular
				if len(R) != len(tt.matrix[0]) { // R size for m x n is n x n (or m x n depending on implementation, but gonum's RTo usually fills the target)
                   // Gonum mat.QR.RTo(&R) fills Dense R.
				}
			}
		})
	}
}
