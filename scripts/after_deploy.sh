#!/bin/bash
REPOSITORY=/home/ec2-user/ssag/
cd $REPOSITORY

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash -y
source ~/.bashrc
nvm install v16.10.0 -y

npm i -g yarn

# nvm 환경변수 등록
# export NVM_DIR="/home/ec2-user/.nvm"
# [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
# [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# cd secret
# sudo mv .env.development ../
# cd ..
fuser -k -n tcp 3000

# nohup yarn start &
yarn start
