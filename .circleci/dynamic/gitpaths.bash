#!/bin/bash

# git commands to arrive at changed paths from target/base
git checkout master # our target/base
git checkout $CIRCLE_SHA1
MERGE_SHA1=`git merge-base master ${CIRCLE_SHA1}`
if [ "$MERGE_SHA1" == "$CIRCLE_SHA1" ];then
    # we're on the latest commit of smae branch, get to last
    MERGE_SHA1=`git rev-parse HEAD-1`
fi
echo "Comparing $MERGE_SHA1 .. $CIRCLE_SHA1"
git diff --name-only $MERGE_SHA1 $CIRCLE_SHA1 > .circleci/dynamic/changedpaths.txt

cat .circleci/dynamic/changedpaths.txt