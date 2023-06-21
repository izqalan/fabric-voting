package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"
	"sync"
	"time"

	"github.com/joho/godotenv"
)

type ElectionRequest struct {
	ElectionName string `json:"electionName"`
	StartDate    string `json:"startDate"`
	EndDate      string `json:"endDate"`
}

type CandidateRequest struct {
	Name       string `json:"name"`
	StudentID  string `json:"studentID"`
	ElectionID string `json:"electionID"`
	Faculty    string `json:"faculty"`
	Party      string `json:"party"`
	Avatar     string `json:"avatar"`
}

type VoteRequest struct {
	Email       string `json:"email"`
	Password    string `json:"password"`
	ElectionID  string `json:"electionID"`
	CandidateID string `json:"candidateID"`
}

type EndElectionRequest struct {
	Target string `json:"target"`
	Value  string `json:"value"`
}

func main() {
	// Configuration
	concurrentRequests := 50 // Total number of requests to be sent
	TEST_URL := goDotEnvVariable("TEST_URL")
	apiURL := TEST_URL + "/api/v2/ballot/vote"     // URL of the voting API endpoint
	electionURL := TEST_URL + "/api/v1/election"   // URL of the election API endpoint
	candidateURL := TEST_URL + "/api/v1/candidate" // URL of the candidate API endpoint
	AVATAR_URL := "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1061&q=80"

	// Create an election
	// format start date and end date to RFC3339
	startDate := time.Now().UTC().Format(time.RFC3339)
	date := time.Now()
	endDate := date.AddDate(0, 0, 1).UTC().Format(time.RFC3339)

	electionReq := ElectionRequest{
		ElectionName: "Load testing election",
		StartDate:    startDate,
		EndDate:      endDate,
	}

	requestBody, err := json.Marshal(electionReq)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	// Create a new POST request for election creation
	resp, err := http.Post(electionURL, "application/json", bytes.NewBuffer(requestBody))
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	defer resp.Body.Close()

	// Get the electionID from the response body.data.electionID
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	var electionResponse map[string]interface{}
	err = json.Unmarshal(body, &electionResponse)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	electionID := electionResponse["data"].(map[string]interface{})["electionID"].(string)

	fmt.Println("Election created successfully")

	// Create candidates
	for i := 0; i < 2; i++ {
		candidateReq := CandidateRequest{
			Name:       "Candidate " + strconv.Itoa(i+1), // Customize with appropriate values
			StudentID:  "A00000" + strconv.Itoa(i+1),     // Customize with appropriate values
			ElectionID: electionID,                       // Customize with appropriate values
			Faculty:    "ftsm",                           // Customize with appropriate values
			Party:      "Party " + strconv.Itoa(i+1),     // Customize with appropriate values
			Avatar:     AVATAR_URL,                       // Customize with appropriate values
		}

		requestBody, err := json.Marshal(candidateReq)
		if err != nil {
			fmt.Println("Error:", err)
			continue
		}

		// Create a new POST request for candidate creation
		resp, err := http.Post(candidateURL, "application/json", bytes.NewBuffer(requestBody))
		if err != nil {
			fmt.Println("Error:", err)
			continue
		}
		defer resp.Body.Close()

		_, err = io.Copy(ioutil.Discard, resp.Body)
		if err != nil {
			fmt.Println("Error:", err)
			continue
		}

		fmt.Printf("Candidate %d created successfully\n", i+1)
	}

	// Start the load testing
	// fmt.Printf("Sending %d voting requests...\n", totalRequests)
	startTime := time.Now()

	// Create a wait group to synchronize goroutines
	var wg sync.WaitGroup
	wg.Add(concurrentRequests)
	responseTimes := make(chan time.Duration, concurrentRequests)

	for i := 0; i < concurrentRequests; i++ {
		go func(i int) {
			defer wg.Done()
			fmt.Printf("Sending request %d...\n", i+1)
			// Prepare the request body
			email := "a" + strconv.Itoa(i+1) + "@siswa.ukm.edu.my" // Generate email based on iteration
			ledgerElectionID := electionID
			voteReq := VoteRequest{
				Email:       email,
				Password:    "P5ssw0rd",        // Customize with appropriate values
				ElectionID:  ledgerElectionID,  // Customize with appropriate values
				CandidateID: getCandidateID(i), // Get candidate ID based on the value of `i`
			}

			requestBody, err := json.Marshal(voteReq)

			if err != nil {
				fmt.Println("Error:", err)
			}

			// Create a new POST request for voting
			start := time.Now()
			resp, err := http.Post(apiURL, "application/json", bytes.NewBuffer(requestBody))
			if err != nil {
				fmt.Println("Error:", err)
			}
			defer resp.Body.Close()
			duration := time.Since(start)

			_, err = io.Copy(ioutil.Discard, resp.Body)
			if err != nil {
				fmt.Println("Error:", err)
			}

			// print status code and message

			//get response time from api

			responseTimes <- duration

			fmt.Printf("Request: %s | Status Code: %d | Response time: %s\n", email, resp.StatusCode, duration)
		}(i)

	}
	wg.Wait()

	close(responseTimes)

	// Calculate total duration
	totalDuration := time.Since(startTime)
	averageResponseTime := calculateAverage(responseTimes)

	endElectionUrl := TEST_URL + "/api/v1/election/" + electionID

	// End the election
	// Create a new PUT request for ending the election
	endElectionReq := EndElectionRequest{
		Target: "endDate",
		Value:  time.Now().UTC().Format(time.RFC3339),
	}

	requestBody, err = json.Marshal(endElectionReq)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	fmt.Printf("Ending election...")
	req, err := http.NewRequest(http.MethodPut, endElectionUrl, bytes.NewReader(requestBody))
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	defer req.Body.Close()

	_, err = io.Copy(ioutil.Discard, req.Body)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	fmt.Println("Election ended successfully")
	fmt.Println("Result at /election/result/" + electionID)

	// Print results
	fmt.Printf("Load test completed in %s\n", totalDuration)
	fmt.Printf("Average response time: %s\n", averageResponseTime)

}

// Helper function to get the candidate ID based on the value of `i`
func getCandidateID(i int) string {
	if i%2 == 0 {
		return "candidate.A000001" // Customize with appropriate candidate ID
	} else {
		return "candidate.A000002" // Customize with appropriate candidate ID
	}
}

func calculateAverage(times <-chan time.Duration) time.Duration {
	var sum time.Duration
	count := 0

	for t := range times {
		sum += t
		count++
	}

	if count > 0 {
		return time.Duration(int64(sum) / int64(count))
	}

	return 0
}

func goDotEnvVariable(key string) string {

	// load .env file
	err := godotenv.Load("../.env")

	if err != nil {
		fmt.Println("Error loading .env file")
	}

	return os.Getenv(key)
}
