# Jelly Poster

**http://poster.jellypbc.com**

[![CircleCI](https://circleci.com/gh/jellypbc/poster/tree/master.svg?style=svg)](https://circleci.com/gh/jellypbc/poster/tree/master)

This is a Rails toy application that converts PDFs into XML/JSON with a collaborative editor with JSON, for science.

This app is pre-alpha, so please mind the cracks.

## Development

### Local Development

To get this app up and running locally, follow these steps:

- Follow the [setup guide in the wiki](https://github.com/jellypbc/poster/wiki/Setup) to install `rbenv`, `bundler`, and `yarn`
- Install `docker` and `docker-compose` from Brew or through [Docker Desktop](https://www.docker.com/products/docker-desktop)
  - Make sure to give Docker several GB of memory for the Grobid server

#### Startup

```sh
# 1. Install packages
bundle install
# 2. Set up database
bundle exec rails rails db:schema:load
```

```sh
# Start server on default port localhost:3000
bundle exec rails server
```

Or you can use docker to run the rails server and other services together, using:

```sh
docker-compose build
docker-compose run app .docker/startup
docker-compose up
```

#### Teardown

To rebuild the docker environment (for example after changing the service configuration):

```sh
# Stop services
docker-compose down
# Pull to rerun init scripts
docker-compose pull
# Then follow startup steps again
```

#### Creating Users

- Start the services
- Go to http://localhost:3000/users/sign_up
- Create an account
- Look at Rails logs for confirmation email html
- Click confirmaton link
- Sign in

### Deploying

This app depends on Grobid running as a separate service, which you'll want to set a production env variable `GROBID_URL`.

To do so, you'll want to pull the docker image and start it on port 80.

```

docker pull lfoppiano/grobid:{version}
docker run -t --rm --init -p 80:8070 -p 8080:8080 lfoppiano/grobid:{version}

```

### Wiki

Check out the [wiki](https://github.com/jellypbc/poster/wiki) and issues to see the current status.

### Running GCE commands

Running Migrations on GCE

```shell
bundle exec rake appengine:exec -- bundle exec rake db:create
```

## Roadmap / Product Horizons

Here are some of the things we will playing around with in this toy app, kind of like a list of to-do's.

- multiplayer RT-crdt based syncing
- render inline react components
  - inline comments
  - footnotes
  - @ hyperlinks for posts, users, projects
- biblioglutton for automagically grabbing referenced citations
- lab note templates
- encryption
- activitypub / federation
- full data export
- offline
- mobile support
- gRPC/xml-rpc for code remote eval
- mobileDoc

## License

The jellypbc project is dual-licensed under [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0) and [MIT](https://opensource.org/licenses/MIT) terms.
