#!/bin/sh
COMMIT_COUNT=3
FOUR_OLD=$(git log -n$((COMMIT_COUNT+1)) --oneline | tail -1 | cut -f1 -d" ")
BRANCH_NAME=load
git branch -d ${BRANCH_NAME} || echo "No stale branch locally"
git push -d origin ${BRANCH_NAME}|| echo "No stale branch remotely"
git branch ${BRANCH_NAME} ${FOUR_OLD}
git push origin ${BRANCH_NAME}

#Remote branch exists N+1 commits ago, ready to replay.
i=$COMMIT_COUNT
while [[ $i -gt 0 ]] ;
do
  TARGET=$(git log -n$((i)) --oneline | tail -1 | cut -f1 -d" ")
  git checkout ${BRANCH_NAME}
  echo "Replaying $((i)) commits ago (${TARGET})"
  #git merge 
  git checkout master
done;
# i dont think this pushes each one..