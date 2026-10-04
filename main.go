package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"golang-api/api"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	fmt.Printf("Marugo Porto API Server listening on http://localhost:%s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, http.HandlerFunc(api.Handler)))
}
