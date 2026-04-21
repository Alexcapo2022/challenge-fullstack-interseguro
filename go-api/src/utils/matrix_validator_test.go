package utils

import (
	"testing"
)

func TestValidateMatrix(t *testing.T) {
	tests := []struct {
		name      string
		matrix    [][]float64
		wantRows  int
		wantCols  int
		wantErr   bool
	}{
		{
			name: "Valid 2x2",
			matrix: [][]float64{
				{1, 2},
				{3, 4},
			},
			wantRows: 2,
			wantCols: 2,
			wantErr:  false,
		},
		{
			name: "Valid 3x2 (Rectangular)",
			matrix: [][]float64{
				{1, 2},
				{3, 4},
				{5, 6},
			},
			wantRows: 3,
			wantCols: 2,
			wantErr:  false,
		},
		{
			name:      "Empty matrix",
			matrix:    [][]float64{},
			wantErr:   true,
		},
		{
			name: "Inconsistent row lengths",
			matrix: [][]float64{
				{1, 2},
				{3},
			},
			wantErr: true,
		},
		{
			name: "Empty rows",
			matrix: [][]float64{
				{},
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			rows, cols, err := ValidateMatrix(tt.matrix)
			if (err != nil) != tt.wantErr {
				t.Errorf("ValidateMatrix() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !tt.wantErr {
				if rows != tt.wantRows {
					t.Errorf("ValidateMatrix() rows = %v, want %v", rows, tt.wantRows)
				}
				if cols != tt.wantCols {
					t.Errorf("ValidateMatrix() cols = %v, want %v", cols, tt.wantCols)
				}
			}
		})
	}
}
