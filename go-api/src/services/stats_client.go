package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type StatsClient struct {
	baseURL string
	client  *http.Client
}

func NewStatsClient(baseURL string) *StatsClient {
	return &StatsClient{
		baseURL: baseURL,
		client:  &http.Client{Timeout: 10 * time.Second},
	}
}

type nodeStatsRequest struct {
	Matrices map[string][][]float64 `json:"matrices"`
}

func (sc *StatsClient) GetStats(matrices map[string][][]float64) (map[string]interface{}, error) {
	body, err := json.Marshal(nodeStatsRequest{Matrices: matrices})
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest("POST", sc.baseURL+"/v1/api/stats", bytes.NewReader(body))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := sc.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error llamando Node API: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, fmt.Errorf("Node API respondió %d", resp.StatusCode)
	}

	var out map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		return nil, err
	}
	return out, nil
}