package services

import (
	"reflect"
	"testing"
)

func TestRotate(t *testing.T) {
	svc := NewRotateService()

	matrix := [][]float64{
		{1, 2},
		{3, 4},
	}

	tests := []struct {
		name      string
		degrees   int
		direction string
		want      [][]float64
		wantErr   bool
	}{
		{
			name:      "90 CW",
			degrees:   90,
			direction: "cw",
			want: [][]float64{
				{3, 1},
				{4, 2},
			},
			wantErr: false,
		},
		{
			name:      "90 CCW",
			degrees:   90,
			direction: "ccw",
			want: [][]float64{
				{2, 4},
				{1, 3},
			},
			wantErr: false,
		},
		{
			name:      "180",
			degrees:   180,
			direction: "cw",
			want: [][]float64{
				{4, 3},
				{2, 1},
			},
			wantErr: false,
		},
		{
			name:      "Invalid degrees",
			degrees:   45,
			direction: "cw",
			wantErr:   true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := svc.Rotate(matrix, tt.degrees, tt.direction)
			if (err != nil) != tt.wantErr {
				t.Errorf("Rotate() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !tt.wantErr && !reflect.DeepEqual(got, tt.want) {
				t.Errorf("Rotate() got = %v, want %v", got, tt.want)
			}
		})
	}
}
