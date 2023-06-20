// basic chain code
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric-chaincode-go/shim"
	pb "github.com/hyperledger/fabric-protos-go/peer"
)

type VotingChaincode struct {
}

// init ledger with 4 voting cadidates
type candidate struct {
	Name      string         `json:"name"`
	StudentID string         `json:"studentID"`
	Faculty   string         `json:"faculty"`
	Party     string         `json:"party"`
	Avatar    string         `json:"avatar"`
	Elections []electionInfo `json:"elections"`
}

type electionInfo struct {
	ElectionID string `json:"electionID"`
	Votes      int    `json:"votes"`
}

// voter struct
type voter struct {
	StudentID  string `json:"studentID"`
	HasVoted   bool   `json:"hasVoted"`
	ElectionID string `json:"electionID"`
	Email      string `json:"email"`
}

type voterV2 struct {
	ID                  string                `json:"id"`
	ElectionEligibility []ElectionEligibility `json:"electionEligibility"`
}

type ElectionEligibility struct {
	ElectionID string `json:"electionID"`
	HasVoted   bool   `json:"hasVoted"`
}

type election struct {
	ElectionID   string  `json:"electionID"`
	ElectionName string  `json:"electionName"`
	StartDate    string  `json:"startDate"`
	EndDate      string  `json:"endDate"`
	CreatedAt    string  `json:"createdAt"`
	UpdatedAt    *string `json:"updatedAt"`
}

type electionResults struct {
	Candidates []candidate `json:"candidates"`
	Winner     candidate   `json:"winner"`
}

func main() {
	err := shim.Start(new(VotingChaincode))
	if err != nil {
		fmt.Printf("Error starting Voting chaincode: %s", err)
	}
}

func (t *VotingChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {

	return shim.Success(nil)
}

// https://kctheservant.medium.com/chaincode-invoke-and-query-fabbe2757db0
// Invoke function
func (t *VotingChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	function, args := stub.GetFunctionAndParameters()

	if function == "initLedger" {
		return t.Init(stub)
	} else if function == "vote" {
		return t.vote(stub, args)
	} else if function == "voteV2" {
		return t.voteV2(stub, args)
	} else if function == "createElection" {
		return t.createElection(stub, args)
	} else if function == "createVoter" {
		return t.createVoter(stub, args)
	} else if function == "createCandidate" {
		return t.createCandidate(stub, args)
	} else if function == "getElectionById" {
		return t.getElectionById(stub, args)
	} else if function == "getAllElections" {
		return t.getAllElections(stub)
	} else if function == "updateElection" {
		return t.updateElection(stub, args)
	} else if function == "getCandidatesById" {
		return t.getCandidatesById(stub, args)
	} else if function == "queryByRange" {
		return t.queryByRange(stub, args)
	}
	fmt.Println("invoke did not find func: " + function) //error
	return shim.Error("Received unknown function invocation")
}

// query function
func (t *VotingChaincode) Query(stub shim.ChaincodeStubInterface) pb.Response {
	function, args := stub.GetFunctionAndParameters()
	if function == "getElectionById" {
		return t.getElectionById(stub, args)
	} else if function == "getAllElections" {
		return t.getAllElections(stub)
	} else if function == "getCandidatesById" {
		return t.getCandidatesById(stub, args)
	} else if function == "queryByRange" {
		return t.queryByRange(stub, args)
	}

	fmt.Println("invoke did not find func: " + function)
	return shim.Error("Received unknown function invocation")
}

// create voter function
func (t *VotingChaincode) createVoter(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}
	studentId := "voter." + args[0]
	electionId := args[1]
	email := args[2]

	var newVoter = voter{StudentID: studentId, HasVoted: false, ElectionID: electionId, Email: email}

	// find voter in ledger
	dupeVoterAsBytes, err := stub.GetState(studentId)
	if err != nil {
		return shim.Error("Failed to get voter: " + studentId)
	}
	dupeVoter := voter{}
	// if voter exists, return error
	if dupeVoterAsBytes != nil {
		json.Unmarshal(dupeVoterAsBytes, &dupeVoter)
		if dupeVoter.StudentID == studentId {
			return shim.Error("Voter already exists")
		}
	}

	newVoterAsBytes, _ := json.Marshal(newVoter)
	err = stub.PutState(args[0], newVoterAsBytes)

	if err != nil {
		fmt.Println("Error creating voter")
		return shim.Error(err.Error())
	}
	fmt.Println("Voter created")
	return shim.Success(nil)

}

// vote function
func (t *VotingChaincode) vote(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	// check if voter has already voted
	voterId := args[0]
	candidateId := args[1]
	electionId := args[2]

	voterAsBytes, err := stub.GetState(voterId)
	if err != nil {
		return shim.Error("Failed to get voter: " + voterId)
	}
	voter := voter{}
	json.Unmarshal(voterAsBytes, &voter)
	if voter.HasVoted {
		return shim.Error("Voter has already voted")
	}

	// update candidate votes
	candidateAsBytes, err := stub.GetState(candidateId)
	if err != nil {
		return shim.Error("Failed to get candidate: " + candidateId)
	}
	candidate := candidate{}
	json.Unmarshal(candidateAsBytes, &candidate)
	contestedElection := candidate.Elections
	for i := 0; i < len(contestedElection); i++ {
		if contestedElection[i].ElectionID == electionId {
			contestedElection[i].Votes++
		}
	}
	candidate.Elections = contestedElection
	candidateAsBytes, _ = json.Marshal(candidate)

	stub.PutState(candidateId, candidateAsBytes)

	voter.HasVoted = true
	voterAsBytes, _ = json.Marshal(voter)
	stub.PutState(voterId, voterAsBytes)

	return shim.Success(nil)
}

// TODO: vote function v2, takes in generated id and email from pg, and CandidateID and ElectionID
// when vote is casted, the generated id is stored in the ledger
// if the generated id is found in the ledger, chek if election id exist (this means the voter has voted for this election
// if generated id is not found in the ledger, create new voter and store in ledger
// if generated id is found in the ledger, but election id is not found, update the voter and store in ledger
// this means we need a new voter model, the current can only store one election id
// and its checked using hasVoted flag.
func (t *VotingChaincode) voteV2(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	Id := args[0]
	CandidateID := args[1]
	ElectionID := args[2]

	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}
	VoterID := "voter." + Id
	// find voter in ledger
	voterAsBytes, err := stub.GetState(VoterID)
	if err != nil {
		return shim.Error("Failed to get voter: " + VoterID)
	}

	// if voter exists, check if election id exist
	if voterAsBytes != nil {
		voter := voterV2{}
		json.Unmarshal(voterAsBytes, &voter)

		// if election id exist, return error
		for i := 0; i < len(voter.ElectionEligibility); i++ {
			if voter.ElectionEligibility[i].ElectionID == ElectionID && voter.ElectionEligibility[i].HasVoted {
				fmt.Printf("Voter has already voted for this election")
				return shim.Error("Voter has already voted")
			}
		}
	}

	// get election
	electionAsBytes, err := stub.GetState(ElectionID)
	election := election{}
	json.Unmarshal(electionAsBytes, &election)
	if err != nil {
		return shim.Error("Failed to get election: " + ElectionID)
	}
	// parse election end date to datetime
	electionEndDate, err := time.Parse(time.RFC3339, election.EndDate)
	if err != nil {
		return shim.Error("Failed to parse election end date: " + election.EndDate)
	}
	// check if election has ended
	if time.Now().After(electionEndDate) {
		return shim.Error("Election has ended")
	}

	// update candidate votes
	candidateAsBytes, err := stub.GetState(CandidateID)
	if err != nil {
		return shim.Error("Failed to get candidate: " + CandidateID)
	}
	candidate := candidate{}
	json.Unmarshal(candidateAsBytes, &candidate)
	contestedElection := candidate.Elections
	for i := 0; i < len(contestedElection); i++ {
		fmt.Println(contestedElection[i].ElectionID)
		if contestedElection[i].ElectionID == ElectionID {
			contestedElection[i].Votes++
		}
	}
	candidate.Elections = contestedElection
	candidateAsBytes, _ = json.Marshal(candidate)
	stub.PutState(CandidateID, candidateAsBytes)
	// candidate votes ledger updated when

	electionEligibility := ElectionEligibility{ElectionID: ElectionID, HasVoted: true}
	// update voter ledger
	// if voter does not exist, create new voter
	if voterAsBytes == nil {
		voter := voterV2{}
		voter.ID = Id
		voter.ElectionEligibility = append(voter.ElectionEligibility, electionEligibility)
		voterAsBytes, _ = json.Marshal(voter)
		stub.PutState(VoterID, voterAsBytes)
	} else {
		// if voter exist, update voter
		voter := voterV2{}
		json.Unmarshal(voterAsBytes, &voter)
		voter.ElectionEligibility = append(voter.ElectionEligibility, electionEligibility)
		voterAsBytes, _ = json.Marshal(voter)
		stub.PutState(VoterID, voterAsBytes)
	}
	return shim.Success(nil)
}

// get election by id function
func (t *VotingChaincode) getElectionById(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}
	electionId := args[0]
	electionAsBytes, err := stub.GetState(electionId)
	if err != nil {
		return shim.Error("Failed to get election: " + electionId)
	}
	return shim.Success(electionAsBytes)
}

// get all created elections function
func (t *VotingChaincode) getAllElections(stub shim.ChaincodeStubInterface) pb.Response {
	elections := []election{}
	electionsAsBytes, err := stub.GetState("elections")
	if err != nil {
		return shim.Error("Failed to get elections")
	}
	json.Unmarshal(electionsAsBytes, &elections)
	electionsAsBytes, _ = json.Marshal(elections)
	return shim.Success(electionsAsBytes)
}

// create election function
func (t *VotingChaincode) createElection(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}
	electionName := args[0]
	startDate := args[1]
	endDate := args[2]
	// electionID is pecified in the REST API server
	// hence all peers will have the same electionID

	electionID := args[3]
	createdAt := args[4]

	// check if election name is provided

	// creating Id using current time broke the block
	// when smart contract is issued by REST API not all peers run the contract at the same time
	// this means peer01 will have a different electionID than peer02
	// hence endorsement will fail becase of key and value mismatch between peers
	// to circumvent this issue we need to specify the electionID in the REST API call
	// electionID := "election." + strconv.Itoa(time.Now().Nanosecond())
	// createdAt := time.Now().String()

	if startDate > endDate {
		return shim.Error("Invalid election dates")
	}

	// generate unique election id
	var election = &election{electionID, electionName, startDate, endDate, createdAt, nil}
	electionAsBytes, _ := json.Marshal(election)
	err := stub.PutState(electionID, electionAsBytes)
	if err != nil {
		fmt.Println("Error creating election")
		return shim.Error(err.Error())
	}

	fmt.Println("election creation successful %s", electionID)
	return shim.Success(nil)
}

// TODO: if cadidate exists, update candidate and append electionId to candidate.Elections
// else create candidate
// create candidate function
func (t *VotingChaincode) createCandidate(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 6 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	candidateName := args[0]
	// create a special ID for candidate by concatenating C_ and studentId
	studentId := "candidate." + args[1]
	electionId := args[2]
	faculty := args[3]
	party := args[4]
	avatar := args[5]

	// check if cadidate exist
	candidateAsBytes, err := stub.GetState(studentId)
	if err != nil {
		return shim.Error("Failed to get candidate: " + studentId)
	}
	if candidateAsBytes != nil {
		// if candidate exists, update candidate and append electionId to candidate.Elections
		candidate := candidate{}
		json.Unmarshal(candidateAsBytes, &candidate)
		info := electionInfo{ElectionID: electionId, Votes: 0}
		candidate.Elections = append(candidate.Elections, info)
		candidateAsBytes, _ := json.Marshal(candidate)
		err := stub.PutState(studentId, candidateAsBytes)
		if err != nil {
			fmt.Println("Error updating candidate")
			return shim.Error(err.Error())
		}
		fmt.Println("candidate update successful %s", studentId)
		return shim.Success(nil)
	} else {
		// else create candidate
		info := electionInfo{ElectionID: electionId, Votes: 0}
		candidate := candidate{
			StudentID: studentId,
			Name:      candidateName,
			Faculty:   faculty,
			Party:     party,
			Avatar:    avatar,
			Elections: []electionInfo{info}}
		candidateAsBytes, _ := json.Marshal(candidate)
		err := stub.PutState(studentId, candidateAsBytes)
		if err != nil {
			fmt.Println("Error creating candidate")
			return shim.Error(err.Error())
		}
		fmt.Println("candidate creation successful %s", studentId)
		return shim.Success(nil)
	}

}

func (t *VotingChaincode) updateElection(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	electionId := args[0]
	target := args[1]
	value := args[2]

	electionAsBytes, err := stub.GetState(electionId)
	if err != nil {
		return shim.Error("Failed to get election: " + electionId)
	}

	election := election{}
	json.Unmarshal(electionAsBytes, &election)

	if target == "name" {
		election.ElectionName = value
	} else if target == "startDate" {
		election.StartDate = value
	} else if target == "endDate" {
		election.EndDate = value
	} else {
		return shim.Error("Invalid target")
	}

	electionAsBytes, _ = json.Marshal(election)
	err = stub.PutState(electionId, electionAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

// get candidates by id
func (t *VotingChaincode) getCandidatesById(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}
	electionId := args[0]

	// get candidates for election by id
	// electionid is stored in the candidate object
	// so you need to get all candidateId keys and get the candidate object
	// that match the electionId
	studentIdsAsBytes, err := stub.GetStateByRange("candidate.", "candidate.z")
	if err != nil {
		return shim.Error("Failed to get candidate: " + electionId)
	}
	defer studentIdsAsBytes.Close()
	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")
	bArrayMemberAlreadyWritten := false
	for studentIdsAsBytes.HasNext() {
		queryResponse, err := studentIdsAsBytes.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		candidateAsBytes, err := stub.GetState(queryResponse.Key)
		if err != nil {
			return shim.Error(err.Error())
		}
		candidate := candidate{}
		json.Unmarshal(candidateAsBytes, &candidate)
		for _, election := range candidate.Elections {
			if election.ElectionID == electionId {
				if bArrayMemberAlreadyWritten {
					buffer.WriteString(",")
				}
				buffer.WriteString("{\"Key\":")
				buffer.WriteString("\"")
				buffer.WriteString(queryResponse.Key)
				buffer.WriteString("\"")

				buffer.WriteString(", \"Record\":")
				// Record is a JSON object, so we write as-is
				buffer.WriteString(string(candidateAsBytes))
				buffer.WriteString("}")
				bArrayMemberAlreadyWritten = true
			}
		}
	}
	buffer.WriteString("]")
	return shim.Success(buffer.Bytes())
}

// query by range function
func (t *VotingChaincode) queryByRange(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}
	startKey := args[0]
	endKey := args[1]
	resultsIterator, err := stub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()
	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")
	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")
	fmt.Printf("- queryByRange queryResult:\n%s\n", buffer.String())
	return shim.Success(buffer.Bytes())
}

// ===========================================================================================
// constructQueryResponseFromIterator constructs a JSON array containing query results from
// a given result iterator
// ===========================================================================================
func constructQueryResponseFromIterator(resultsIterator shim.StateQueryIteratorInterface) (*bytes.Buffer, error) {
	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	return &buffer, nil
}
