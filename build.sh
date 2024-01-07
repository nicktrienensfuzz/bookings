#!/bin/bash


# # Check if the .env file exists
# if [ ! -f no.env ]; then
#   echo "Error: no.env file not found."
#   exit 1
# fi

# # Load the variables from the .env file
# while IFS='=' read -r key value; do
#   export "$key"="$value"
# done < no.env

# # Verify that the variables are set
# echo "CALLBACK_URL: $CALLBACK_URL"
# echo "PORT: $PORT"
# echo "CALLBACK_URL: $CALLBACK_URL"
# echo "GOOGLE_CLIENT_ID: $GOOGLE_CLIENT_ID"


# docker kill cal 
docker build -t cal .   
docker run --name cal -p 8080:8080  --env-file no.env cal
