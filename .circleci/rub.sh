#!/bin/bash
echo "Provide inputs:"
until [[ "$message" = "three" ]]; do
    echo -ne "> "
    read -e message
    myArray+=($message) #Input added to array for later processing
done