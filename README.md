# Jelly Posters

**http://jellypbc.com**

This is a Rails toy application that converts PDFs into XML/JSON with a collaborative editor with JSON.

The app is mainly two main chunks: a Rails server for file uploads and the editor which is built on ProseMirror. It also uses a Grobid server for parsing PDFs into XML/JSON for the editor.

Shrine and Google Cloud Engine are used for file storage.


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


### Docker

To set up
```
docker-compose run web bundle install
docker-compose run web yarn
docker-compose run web rake db:create db:setup
```

And then to start everything up, just do `docker-compose up`.

When hacking, it is useful to recreate the web image:

```
docker-compose build
docker-compose up --force-recreate
```


### Deploying

**TBD**


### Development

Check out the [wiki](https://github.com/jellypbc/poster/wiki) and issues to see the current status.


### Running GCE commands

Running Migrations on GCE
```shell
bundle exec rake appengine:exec -- bundle exec rake db:create
```