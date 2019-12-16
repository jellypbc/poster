# Jelly Poster

**http://poster.jellypbc.com**

[![CircleCI](https://circleci.com/gh/jellypbc/poster/tree/master.svg?style=svg)](https://circleci.com/gh/jellypbc/poster/tree/master)

This is a Rails toy application that converts PDFs into XML/JSON with a collaborative editor with JSON, for science.

The app is mainly two main chunks: a Rails server for file uploads and the editor which is built on ProseMirror. It also uses a [Grobid](https://github.com/kermitt2/grobid) server for parsing PDFs into XML/JSON for the editor.

Shrine and Google Cloud Engine are used for file storage.

This app is pre-alpha, so please mind the cracks.


### Development
To get started with this app, make sure you have Ruby (check out [https://github.com/rbenv/rbenv](rbenv)) and [https://nodejs.org/en/download/](Node)/[https://yarnpkg.com/lang/en/docs/install/#mac-stable](Yarn) set up.

```
rbenv install 2.5.7; rbenv local 2.5.7
gem install bundler
bundle install
yarn
rake db:create db:setup db:seed
```

This will also create a sample post to just for showing the post editor.

To start the server, run:

```
rails server
```

And also run the webpack-dev-server:

```
bin/webpack-dev-server
```

This app requires Grobid, a machine learning PDF parsing library, to run alongside the app. To run Grobid separately, you can do so easily using docker and the public grobid image. Make sure you have docker set up and do:
```
docker pull lfoppiano/grobid:0.6.0
docker run -t --rm --init -p 8080:8070 -p 8081:8071 lfoppiano/grobid:0.6.0
```


### Docker Provisioning

If you prefer to use Docker Compose, you can quickly set things up using:
```
$ docker-compose build
$ docker-compose run backend yarn install
$ docker-compose run backend ./.docker/setup.sh
```

You can run the Rails up using the following command:

```
$ docker-compose up rails
```

If you want to run Webpack Dev server as well:

```
$ docker-compose up rails webpacker
```

### Deploying

**TBD**
*Will need to do some configuration set up for GCE storage*


### Development

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
