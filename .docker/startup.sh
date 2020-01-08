#! /bin/bash
echo ">>>> waiting for services"
.docker/wait.sh
# echo ">>>> preparing db"
# .docker/preparedb.sh
mkdir -p ./tmp/pids
echo ">>>> starting server"
# bundle exec puma -C config/puma.rb
bundle exec rails server -b 0.0.0.0
