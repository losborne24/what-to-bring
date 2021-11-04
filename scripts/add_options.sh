#!/bin/bash
# Used to insert options into table
while getopts f:s:i:t: flag
do
    case "${flag}" in
        f) file=${OPTARG};;
        s) stage=${OPTARG};;
        i) index=${OPTARG};;
        t) topic=${OPTARG};;
    esac
done
dos2unix $file
while IFS=, read -r option 
do
    aws dynamodb put-item --table-name wtbOptionTable-$stage \
    --item "{\"topicId\":{\"S\":\"$topic\"},\"optionId\":{\"N\":\"$index\"},\"downvotes\":{\"N\":\"0\"},\"keywords\":{\"S\":\"$option\"},\"optionRank\":{\"N\":\"$index\"},\"optionText\":{\"S\":\"$option\"},\"upvotes\":{\"N\":\"0\"}}"
    index=$[$index+1]
done < $file
