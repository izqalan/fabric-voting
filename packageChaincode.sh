export PROJECT_ROOT=${PWD}

while getopts v: flag
do
    case "${flag}" in
        v) version=${OPTARG};;
    esac
done

export GO111MODULE=on go mod vendor

export PATH=${PROJECT_ROOT}/bin:$PATH
export FABRIC_CFG_PATH=$PROJECT_ROOT/config/
cd test-network/
export PROJECT_TEST_NETWORK=${PWD}
peer version

peer lifecycle chaincode package basic_$version.tar.gz --path ../chaincode/go/ --lang golang --label basic_${version}

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PROJECT_TEST_NETWORK}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PROJECT_TEST_NETWORK}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051

peer lifecycle chaincode install basic_$version.tar.gz

export CORE_PEER_LOCALMSPID="Org2MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PROJECT_TEST_NETWORK}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PROJECT_TEST_NETWORK}/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
export CORE_PEER_ADDRESS=localhost:9051

peer lifecycle chaincode install basic_$version.tar.gz
