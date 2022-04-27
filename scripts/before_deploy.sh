#!/bin/bash
REPOSITORY=/home/ec2-user/backend-test/
cd $REPOSITORY

sudo pm2 kill
sudo rm -rf ssag
