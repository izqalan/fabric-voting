# hyperledger fabric query script

while getopts f:a: flag
do
    case "${flag}" in
        f) function=${OPTARG};;
        # args is an array
        a) args=${OPTARG};;
    esac
done

cd test-network

peer chaincode query -C mychannel -n basic -c `{"function": "$function", "args":[$args]}`