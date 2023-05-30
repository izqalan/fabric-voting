# A DLT Based Voting system using Hyperledger Fabric

![archi design](https://github.com/izqalan/fabric-voting/assets/24191952/86124ba7-25fc-4508-a1a9-f7276126907a)


This project combines the power of Hyperledger Fabric, Golang, Gin-gonic, and Next.js to create a blockchain application with a REST API and a client-side user interface. By leveraging these technologies, you can build a secure and decentralized system that allows for transparent and auditable transactions.

## Project Overview

The project consists of three main components:

1. **Hyperledger Fabric Network:** Hyperledger Fabric is a permissioned blockchain framework that provides a modular and scalable platform for developing blockchain applications. In this project, we use Hyperledger Fabric to create the network infrastructure and manage the distributed ledger.

2. **Go Chaincode:** The chaincode is written in Golang, which is the smart contract code that runs on the Hyperledger Fabric network. It defines the business logic and rules for interacting with the ledger. By writing chaincode in Golang, you can take advantage of its performance, reliability, and extensive standard library.

3. **Gin-gonic REST API:** Gin-gonic is a lightweight and flexible web framework for building RESTful APIs in Golang. We use Gin-gonic to develop the REST API that interacts with the Hyperledger Fabric network. The API allows external applications to submit transactions, query the ledger, and perform other blockchain operations.

4. **Next.js Client:** Next.js is a popular React framework for building server-side rendered and static web applications. In this project, we utilize Next.js to develop the client-side user interface. The Next.js client interacts with the REST API to fetch data from the blockchain, display it to users, and enable them to submit transactions.

5. **Postgres database:** Acts as UKM's auth database storing students login credentials. This instance hooked onto Gin REST API.

## Usage

To use this project, follow the steps below:

1. Install the required dependencies as mentioned in the prerequisites required by Hyperledger Fabric.

2. Set up the Hyperledger Fabric network and deploy the chaincode.

3. Start the Golang REST API server using Gin-gonic. cd to `/app/rest` then `go run main.go`

5. Set environment variable for Client app

```
AUTH0_SECRET='xxx'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://xxx.auth0.com'
AUTH0_CLIENT_ID='xxxx'
AUTH0_CLIENT_SECRET='xxxx_xxx-xxxx'
```

6. Launch the Next.js client application. cd to `/app/fabric-voting-client` then `yarn dev`

Once the components are up and running, you can access the client application in a web browser to interact with the blockchain network and perform transactions.

## Deploying test-network and chaincode

1. cd to `test-network` directory then run `./network.sh up createChannel -ca`.
2. to build chaincode, from root, cd to `chaincode/go` then run `go build index.go`
3. from root, run `source packageChaincode.sh`
4. set `CC_PACKAGE_ID=basic_1.0:xxxxxx`
5. from root, run `source validateChaincode.sh`
6. from root, run `source commitChaincode.sh`

## Contributing

No. Just no.

## Acknowledgments

- [Hyperledger Fabric](https://www.hyperledger.org/projects/fabric)
- [Gin-gonic](https://github.com/gin-gonic/gin)
- [Next.js](https://nextjs.org/)
