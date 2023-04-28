package routes

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/go-pg/pg/v10"
	"github.com/hyperledger/fabric-gateway/pkg/client"
)

type newElectionValue struct {
	Target string `json:"target"`
	Value  string `json:"value"`
}

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
	ElectionID  string `json:"electionID"`
}

type voteV2 struct {
	Email       string `json:"email"`
	Password    string `json:"password"`
	CandidateID string `json:"candidateID"`
	ElectionID  string `json:"electionID"`
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
		v1.GET("/candidate", func(c *gin.Context) {
			getAllCandidates(contract, c)
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
		v1.PUT("/election/:electionID", func(c *gin.Context) {
			updateElection(contract, c)
		})
		v1.GET("/election", func(c *gin.Context) {
			getAllElections(contract, c)
		})
		v1.POST("/voter", func(c *gin.Context) {
			createVoter(contract, c)
		})
		v1.GET("/voters", func(c *gin.Context) {
			getAllVoters(contract, c)
		})
		v1.POST("/ballot/vote", func(c *gin.Context) {
			castVote(contract, c)
		})

	}
	v2 := r.Group("/api/v2")
	{
		v2.POST("/ballot/vote", func(c *gin.Context) {
			castVoteV2(contract, c)
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
		"status":  http.StatusOK,
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
	c.JSON(http.StatusCreated, gin.H{
		"message": "Candidate created. Txn committed successfully.",
		"status":  http.StatusCreated,
	})
}

// @Summary Get all Candidates
// @Description Get all candidates
// @Tags Candidate
// @Accept  json
// @Produce  json
// @Success 200 {string} string "Candidates fetched"
// @Router /candidate [get]
func getAllCandidates(contract *client.Contract, c *gin.Context) {
	result, err := contract.EvaluateTransaction("queryByRange", "candidate.", "candidate.z")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(fmt.Errorf("failed to evaluate transaction: %w", err))
	}

	fmt.Printf("*** Transaction result: %s\n", string(result))

	var response interface{}
	err = json.Unmarshal(result, &response)
	if err != nil {
		c.JSON(http.StatusRequestTimeout, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Candidates fetched",
		"status":  http.StatusOK,
		"data":    response,
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
		"status":  http.StatusOK,
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

	c.JSON(http.StatusCreated, gin.H{
		"message": "Election created. Txn committed successfully.",
		"status":  http.StatusCreated,
		"data": gin.H{
			"electionID": electionID,
		},
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

	var response interface{}
	err = json.Unmarshal(result, &response)
	if err != nil {
		c.JSON(http.StatusRequestTimeout, gin.H{"error": err.Error()})
		panic(fmt.Errorf("failed to unmarshal JSON data: %w", err))
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Election fetched",
		"data":    response,
		"status":  http.StatusOK,
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
		"status":  http.StatusOK,
	})

}

// @Summary Get All Voters
// @Description Get all voters
// @Tags Election
// @Accept  json
// @Produce  json
// @Success 200 {string} string "Elections fetched"
// @Router /voters [get]
func getAllVoters(contract *client.Contract, c *gin.Context) {
	// get all elections using queryByRange function chaincode
	result, err := contract.EvaluateTransaction("queryByRange", "voter.", "voter.z")
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
		"status":  http.StatusOK,
	})

}

// update election
// @Summary Update Election
// @Description Update election by electionID
// @Tags Election
// @Accept  json
// @Produce  json
// @Param electionID path string true "Election ID"
// @Body  {object} target, value
// @Success 200 {string} string "Election updated"
// @Router /election/{electionID} [put]
func updateElection(contract *client.Contract, c *gin.Context) {
	electionID := c.Param("electionID")

	// the chaincode takes electionID, target field and new value
	// eg updateElection(electionID, "electionName", "new election name")

	var newElectionValue newElectionValue
	if err := c.ShouldBindJSON(&newElectionValue); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := contract.SubmitTransaction("updateElection", electionID, newElectionValue.Target, newElectionValue.Value)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(fmt.Errorf("failed to submit transaction: %w", err))
	}

	fmt.Printf("*** Transaction committed successfully\n")

	c.JSON(http.StatusOK, gin.H{
		"message": "Election updated. Txn committed successfully.",
		"status":  http.StatusOK,
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

	c.JSON(http.StatusCreated, gin.H{
		"message": "Voter created. Txn committed successfully.",
		"status":  http.StatusCreated,
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
	_, err := contract.SubmitTransaction("vote", vote.VoterID, vote.CandidateID, vote.ElectionID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(fmt.Errorf("failed to submit transaction: %w", err))
	}

	fmt.Printf("*** Transaction committed successfully\n")

	c.JSON(http.StatusOK, gin.H{
		"message": "Vote casted. Txn committed successfully.",
		"status":  http.StatusOK,
	})
}

// @Summary vote v2
// @Description vote for a candidate
// @Tags Ballot
// @Accept  json
// @Produce  json
// @Body  {object} voterEmail, password, candidateID, ElectionID
// @Success 200 {string} string "Vote casted"
func castVoteV2(contract *client.Contract, c *gin.Context) {

	var voteV2 voteV2
	if err := c.ShouldBindJSON(&voteV2); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// connect pgsql
	db := pg.Connect(&pg.Options{
		Addr:     ":5432",
		User:     "postgres",
		Password: "admin",
		Database: "fabric-voting-users",
	})

	// if connection fails
	if db == nil {
		fmt.Println("Error connecting to database")
	}

	// get user with email and salted password
	type user struct {
		tableName struct{} `pg:"auth.users"`
		Email     string
		Password  string
		Id        int
		Faculty   string
	}

	// unsalt password using pgcrypto
	var u user
	err := db.Model(&u).
		Where("email = ?", voteV2.Email).
		Where("password = crypt(?, password)", voteV2.Password).
		Select()

	if err != nil {
		// return error message wrong email or password
		c.JSON(http.StatusBadRequest, gin.H{
			"error":  "Wrong email or password.",
			"status": http.StatusBadRequest,
		})
		return
	}

	userID := strconv.Itoa(u.Id)
	fmt.Println(voteV2.CandidateID, voteV2.ElectionID, userID)

	// run chaincode ballot v2 here
	_, err = contract.SubmitTransaction("voteV2", userID, voteV2.CandidateID, voteV2.ElectionID)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(fmt.Errorf("failed to submit transaction: %w", err))
	}

	fmt.Printf("*** Transaction committed successfully\n")

	c.JSON(http.StatusOK, gin.H{
		"message": "Vote casted. Txn committed successfully.",
		"status":  http.StatusOK,
	})

}
