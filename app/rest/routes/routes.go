package routes

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/hyperledger/fabric-gateway/pkg/client"
)

type candidate struct {
	Name       string `json:"name"`
	StudentID  string `json:"studentID"`
	ElectionID string `json:"electionID"`
}

type election struct {
	ElectionID   string `json:"electionID"`
	ElectionName string `json:"electionName"`
	StartDate    string `json:"startDate"`
	EndDate      string `json:"endDate"`
}

func SetupRouter(contract *client.Contract) *gin.Engine {
	r := gin.Default()
	v1 := r.Group("/api/v1")
	{
		v1.GET("/ping", pong)
		v1.GET("/hello", helloWorld)
		v1.POST("/candidate", func(c *gin.Context) {
			createCandidate(contract, c)
		})
		v1.GET("/candidate/:electionID", func(c *gin.Context) {
			getCandidatesByElectionId(contract, c)
		})
		v1.POST("/election", func(c *gin.Context) {
			createElection(contract, c)
		})
		v1.GET("/election/:electionID", func(c *gin.Context) {
			getElectionById(contract, c)
		})
		v1.GET("/election", func(c *gin.Context) {
			getAllElections(contract, c)
		})
	}
	return r
}

// write swagger endpoint for /ping
// @Summary Ping Pong
// @Description Returns pong
// @Tags Signal
// @Produce  text/plain
// @Success 200 {string} string "pong"
// @Router /ping [get]
func pong(c *gin.Context) {
	c.String(http.StatusOK, "pong")
}

// @Summary Hello World
// @Description Returns hello world
// @Tags Signal
// @Produce  json
// @Success 200 {string} string "hello world"
// @Router /hello [get]
func helloWorld(c *gin.Context) {
	// retunr in json
	c.JSON(http.StatusOK, gin.H{
		"message": "hello world",
	})
}

// @Summary Create Candidate
// @Description Create a new candidate
// @Tags Candidate
// @Accept  json
// @Produce  json
// @Body  {object} candidate
// @Success 200 {string} string "Candidate created"
// @Router /candidate [post]
func createCandidate(contract *client.Contract, c *gin.Context) {

	// get candidate studentName, studentId and electionId from request body
	var candidate candidate
	if err := c.ShouldBindJSON(&candidate); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := contract.SubmitTransaction("createCandidate", candidate.Name, candidate.StudentID, candidate.ElectionID)
	if err != nil {
		panic(fmt.Errorf("failed to submit transaction: %w", err))
	}

	fmt.Printf("*** Transaction committed successfully\n")

	// retunr in json
	c.JSON(http.StatusOK, gin.H{
		"message": "Candidate created. Txn committed successfully.",
	})
}

// @Summary Get Candidate
// @Description Get candidate by electionID
// @Tags Candidate
// @Accept  json
// @Produce  json
// @Param electionID path string true "Election ID"
// @Success 200 {string} string "Candidates fetched"
// @Router /candidate/{electionID} [get]
func getCandidatesByElectionId(contract *client.Contract, c *gin.Context) {
	electionID := c.Param("electionID")
	result, err := contract.EvaluateTransaction("getCandidatesById", electionID)
	if err != nil {
		panic(fmt.Errorf("failed to evaluate transaction: %w", err))
	}

	fmt.Printf("*** Transaction result: %s\n", string(result))

	r := string(result)
	// out, _ := json.Marshal(string(r))

	c.JSON(http.StatusOK, gin.H{
		"message": "Candidate fetched successfully.",
		"data":    r,
	})
}

// @Summary Create Election
// @Description Create a new election
// @Tags Election
// @Accept  json
// @Produce  json
// @Body  {object} election
// @Success 200 {string} string "Election created"
// @Router /election [post]
func createElection(contract *client.Contract, c *gin.Context) {

	var election election
	if err := c.ShouldBindJSON(&election); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := contract.SubmitTransaction("createElection", election.ElectionName, election.StartDate, election.EndDate, election.ElectionID)
	if err != nil {
		panic(fmt.Errorf("failed to submit transaction: %w", err))
	}

	fmt.Printf("*** Transaction committed successfully\n")

	c.JSON(http.StatusOK, gin.H{
		"message": "Election created. Txn committed successfully.",
	})
}

// @Summary Get Election by id
// @Description Get election by electionID
// @Tags Election
// @Accept  json
// @Produce  json
// @Param electionID path string true "Election ID"
// @Success 200 {string} string "Election created"
// @Router /election/{electionID} [get]
func getElectionById(contract *client.Contract, c *gin.Context) {
	electionID := c.Param("electionID")
	result, err := contract.EvaluateTransaction("getElectionById", electionID)
	if err != nil {
		panic(fmt.Errorf("failed to evaluate transaction: %w", err))
	}

	fmt.Printf("*** Transaction result: %s\n", string(result))

	r := string(result)
	// out, _ := json.Marshal(string(r))

	c.JSON(http.StatusOK, gin.H{
		"message": "Election fetched successfully.",
		"data":    r,
	})
}

// @Summary Get All Elections
// @Description Get all elections
// @Tags Election
// @Accept  json
// @Produce  json
// @Success 200 {json}
// @Router /election [get]
func getAllElections(contract *client.Contract, c *gin.Context) {
	// get all elections using queryByRange function chaincode
	result, err := contract.EvaluateTransaction("queryByRange", "election.", "election.z")
	if err != nil {
		panic(fmt.Errorf("failed to query transaction: %w", err))
	}

	fmt.Printf("*** Transaction result: %s\n", string(result))

	r := string(result)

	c.JSON(http.StatusOK, gin.H{
		"message": "Elections fetched successfully.",
		"data":    r,
	})

}
