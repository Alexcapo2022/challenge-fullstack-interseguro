package config

import "os"

type Config struct {
	Port       string
	NodeApiURL string
}

func Load() Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	node := os.Getenv("NODE_API_URL")
	if node == "" {
		node = "http://localhost:3000"
	}

	return Config{
		Port:       port,
		NodeApiURL: node,
	}
}