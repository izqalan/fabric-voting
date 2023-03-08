package main

import (
	"fmt"
	"log"
	"net/http"
)

func testFunction(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello World")
}

func handleRequests() {
	http.HandleFunc("/", testFunction)
	log.Fatal(http.ListenAndServe(":5000", nil))
}

func main() {
	handleRequests()
}
