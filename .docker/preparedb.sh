#! /bin/bash

# If database exists, migrate. Otherweise setup (create and seed)
echo ">>>>>>>> preparing db"
bundle exec rake db:prepare && echo "Database is ready!"