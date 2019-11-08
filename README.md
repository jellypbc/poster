# Jelly Posters
This is a Rails toy app demo for turning files (PDFs, PPTXs, DOCS, etc) into a collaborative editor with JSON (ideally MobileDoc). 

The app is mainly two main chunks: server for parsing documents into serialized JSON, and the editor.


### Files
This app uses Shrine for files.


### Running GCE commands

Running Migraitons on GCE
```shell
bundle exec rake appengine:exec -- bundle exec rake db:migrate
```