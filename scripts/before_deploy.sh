#!/bin/bash
cd /home/ec2-user

sudo pm2 kill
sudo rm -rf ssag

mkdir ssag
