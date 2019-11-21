#!/bin/bash

echo "starting webpack dev server" && export NODE_OPTIONS="--max_old_space_size=4096" && yarn && rm -rf /opt/jellyposter/public/packs && bin/webpack-dev-server