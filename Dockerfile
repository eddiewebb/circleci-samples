FROM circleci/python:2-jessie

MAINTAINER Edward A. Webb <ollitech@gmail.com>

# Add our custom shipit scripts
ENV QUEUE_HOME /home/circleci/circleci-queue
