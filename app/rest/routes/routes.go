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

func SetupRouter(contract *client.Contract) *gin.Engine {
	r := gin.Default()
	v1 := r.Group("/api/v1")
	{
		v1.GET("/ping", pong)
		v1.GET("/hello", helloWorld)
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
