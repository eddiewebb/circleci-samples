#!/bin/bash

# git commands to arrive at changed paths from target/base
git checkout master # our target/base
MERGE_SHA1=`git merge-base master ${CIRCLE_SHA1}`
if [ "$MERGE_SHA1" == "$CIRCLE_SHA1" ];then
    # we're on the latest commit of smae branch, get to last
    MERGE_SHA1=`git rev-parse HEAD-1`
fi
echo "Comparing $MERGE_SHA1 .. $CIRCLE_SHA1"
PATHS=`git diff --name-only $MERGE_SHA1 $CIRCLE_SHA1`