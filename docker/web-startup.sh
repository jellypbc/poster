#! /bin/bash

rm -f tmp/pids/server.pid && bundle exec rails s -b 0.0.0.0


#!/bin/bash

# set -e

# # Remove a potentially pre-existing server.pid for Rails.
# rm -f /app/tmp/pids/server.pid

# # Then exec the container's main process (what's set as CMD in the Dockerfile).
# exec "$@"

# echo ">> From Entrypoint.sh"
# bundle exec puma -C config/puma.rb