# Jelly Posters

**http://jellypbc.com**

This is a Rails toy application that converts PDFs into XML/JSON with a collaborative editor with JSON, for science.

The app is mainly two main chunks: a Rails server for file uploads and the editor which is built on ProseMirror. It also uses a [Grobid](https://github.com/kermitt2/grobid) server for parsing PDFs into XML/JSON for the editor.

Shrine and Google Cloud Engine are used for file storage.

This app is pre-alpha, so please mind the cracks.


### Development 
To get started with this app, make sure you have Ruby (check out [https://github.com/rbenv/rbenv](rbenv)) and Node/Yarn set up.

```
rbenv install 2.5.7; rbenv local 2.5.7
gem install bundler
bundle install
yarn
rake db:create db:setup
```

To start the server, run:

```
rails server
```

And also run the webpack-dev-server:

```
bin/webpack-dev-server
```

To run Grobid, it helps to use docker.
```
docker pull lfoppiano/grobid:0.6.0     
docker run -t --rm --init -p 8080:8070 -p 8081:8071 lfoppiano/grobid:0.6.0
```


### Docker

If you prefer to use Docker, you can quickly set things up using:
```
docker-compose build
docker-compose run web bundle install
docker-compose run web yarn
docker-compose run web rake db:create db:setup
```

And then to start services, just do `docker-compose up`.

When hacking, it is useful to sometimes recreate the web image:

```
docker-compose up --force-recreate
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
