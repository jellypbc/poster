# Jelly Poster

**http://poster.jellypbc.com**

[![CircleCI](https://circleci.com/gh/jellypbc/poster/tree/master.svg?style=svg)](https://circleci.com/gh/jellypbc/poster/tree/master)

This is a Rails toy application that converts PDFs into XML/JSON with a collaborative editor with JSON, for science.

The app is mainly two main chunks: a Rails server for file uploads and the editor which is built on ProseMirror. It also uses a [Grobid](https://github.com/kermitt2/grobid) server for parsing PDFs into XML/JSON for the editor.

Shrine and Google Cloud Engine are used for file storage.

This app is pre-alpha, so please mind the cracks.


### Development

To get this app up and running, follow the [instructions for getting started](https://github.com/jellypbc/poster/wiki/Setup).


### Deploying

This app depends on Grobid running as a separate service, which you'll want to set a production env variable `GROBID_URL`.

To do so, you'll want to pull the docker image and start it on port 80.
```
docker pull lfoppiano/grobid:{version}
docker run -t --rm --init -p 80:8070 -p 8080:8080 lfoppiano/grobid:{version}
```


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
