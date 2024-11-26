#!/bin/bash

MY_HOST=${LISTEN_HOST:-0.0.0.0}
MY_PORT=${LISTEN_PORT:-5000}
IFS=',' read -r -a MY_ARRAY <<< "${TARGET_HOST_PORTS}" 

echo "running listener on host: $MY_HOST, port: $MY_PORT"
# first, we listen
nc -l $MY_HOST $MY_PORT &
nc -v -w 2 $MY_HOST $MY_PORT 
echo "Other containers may talk to  me now."
sleep 10
echo "=----------------="


echo "Attempting to talk to other containers for array ${MY_ARRAY[@]}"
# listening in background, we talk
for TARGET in "${MY_ARRAY[@]}"
do
  IFS=':' read -r -a HOST_PORT <<< "${TARGET}" 
  host=${HOST_PORT[0]}
  port=${HOST_PORT[1]}
  echo -e "-------\nAttemping to talk to host $host on port $port"
  result=`nc -v -w 2 $host $port 2>&1`
  echo -e "\t$result"
done