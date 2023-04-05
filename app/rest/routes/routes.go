package routes

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/hyperledger/fabric-gateway/pkg/client"
)

type candidate struct {
	Name       string `json:"name"`
	StudentID  string `json:"studentID"`
	Faculty    string `json:"faculty"`
	Party      string `json:"party"`
	ElectionID string `json:"electionID"`
	Avatar     string `json:"avatar"`
}

type election struct {
	ElectionID   string `json:"electionID"`
	ElectionName string `json:"electionName"`
	StartDate    string `json:"startDate"`
	EndDate      string `json:"endDate"`
	UpdatedAt    string `json:"updatedAt"`
}

type voter struct {
	StudentID  string `json:"studentID"`
	ElectionID string `json:"electionID"`
	Email      string `json:"email"`
}

type vote struct {
	VoterID     string `json:"voterID"`
	CandidateID string `json:"candidateID"`
}

func SetupRouter(contract *client.Contract) *gin.Engine {
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: false,
		MaxAge:           12 * time.Hour,
	}))

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
		v1.POST("/voter", func(c *gin.Context) {
			createVoter(contract, c)
		})
		v1.POST("/ballot/vote", func(c *gin.Context) {
			castVote(contract, c)
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
// @Body  {object} name, studentID, electionID, faculty, party, avatar
// @Success 200 {string} string "Candidate created"
// @Router /candidate [post]
func createCandidate(contract *client.Contract, c *gin.Context) {

	// get candidate studentName, studentId and electionId from request body
	var candidate candidate
	if err := c.ShouldBindJSON(&candidate); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := contract.SubmitTransaction("createCandidate", candidate.Name, candidate.StudentID, candidate.ElectionID, candidate.Faculty, candidate.Party, candidate.Avatar)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
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
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(fmt.Errorf("failed to evaluate transaction: %w", err))
	}

	fmt.Printf("*** Transaction result: %s\n", string(result))

	var response interface{}
	err = json.Unmarshal(result, &response)
	if err != nil {
		c.JSON(http.StatusRequestTimeout, gin.H{"error": err.Error()})
		panic(fmt.Errorf("failed to unmarshal JSON data: %w", err))
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Candidates fetched",
		"data":    response,
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

	// generate electionID using timestamp
	// eg election.1621234567
	// which translates to election.<timestamp>
	currentTime := time.Now()
	electionID := fmt.Sprintf("election.%d", currentTime.Unix())
	// time in readable utc
	createdAt := currentTime.UTC().String()

	_, err := contract.SubmitTransaction("createElection", election.ElectionName, election.StartDate, election.EndDate, electionID, createdAt)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
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
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
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
// @Success 200 {string} string "Elections fetched"
// @Router /election [get]
func getAllElections(contract *client.Contract, c *gin.Context) {
	// get all elections using queryByRange function chaincode
	result, err := contract.EvaluateTransaction("queryByRange", "election.", "election.z")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(fmt.Errorf("failed to query transaction: %w", err))
	}

	fmt.Printf("*** Transaction result: %s\n", string(result))

	var response interface{}
	err = json.Unmarshal(result, &response)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(fmt.Errorf("failed to unmarshal JSON data: %w", err))
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Elections fetched successfully.",
		"data":    response,
	})

}

// update election
// @Summary Update Election
// @Description Update election by electionID
// @Tags Election
// @Accept  json
// @Produce  json
// @Param electionID path string true "Election ID"
// @Body  {object} election
// @Success 200 {string} string "Election updated"
// @Router /election/{electionID} [put]
func updateElection(contract *client.Contract, c *gin.Context) {
	electionID := c.Param("electionID")

	var election election
	if err := c.ShouldBindJSON(&election); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// the chaincode takes in object of type election
	// so we need to convert the election object to json
	// and then pass it to the chaincode
	electionJSON, err := json.Marshal(election)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(fmt.Errorf("failed to marshal JSON data: %w", err))
	}

	_, err = contract.SubmitTransaction("updateElection", electionID, string(electionJSON))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(fmt.Errorf("failed to submit transaction: %w", err))
	}

	fmt.Printf("*** Transaction committed successfully\n")

	c.JSON(http.StatusOK, gin.H{
		"message": "Election updated. Txn committed successfully.",
	})
}

// @Summary Create Voter
// @Description Create a new voter
// @Tags Voter
// @Accept  json
// @Produce  json
// @Body  {object} name, studentID, electionID
// @Success 200 {string} string "Voter created"
// @Router /voter [post]
func createVoter(contract *client.Contract, c *gin.Context) {

	var voter voter
	if err := c.ShouldBindJSON(&voter); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := contract.SubmitTransaction("createVoter", voter.StudentID, voter.ElectionID, voter.Email)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(fmt.Errorf("failed to submit transaction: %w", err))
	}

	fmt.Printf("*** Transaction committed successfully\n")

	c.JSON(http.StatusOK, gin.H{
		"message": "Voter created. Txn committed successfully.",
	})
}

// @Summary vote
// @Description vote for a candidate
// @Tags Ballot
// @Accept  json
// @Produce  json
// @Body  {object} voterID, candidateID
// @Success 200 {string} string "Vote casted"
// @Router /ballot/vote [post]
func castVote(contract *client.Contract, c *gin.Context) {

	var vote vote
	if err := c.ShouldBindJSON(&vote); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := contract.SubmitTransaction("vote", vote.VoterID, vote.CandidateID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(fmt.Errorf("failed to submit transaction: %w", err))
	}

	fmt.Printf("*** Transaction committed successfully\n")

	c.JSON(http.StatusOK, gin.H{
		"message": "Vote casted. Txn committed successfully.",
	})
}
