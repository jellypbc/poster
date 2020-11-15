# Deploying

Before getting deploying, follow the [setup guide in the wiki](https://github.com/jellypbc/poster/wiki/Setup) to install `rbenv`, `bundler`, and `yarn`

Deployment is set up for easy use on Heroku, however you could run it on whichever platform you choose.

Here is a checklist of things to be done:

1. Domain
Just the hostname, e.g. jellypbc.com
```
HOSTNAME=
```

2. Shrine storage
Defaults to using Google Cloud Storage, assuming you have buckets created with your hostname, e.g. jellyposter-cache, jellyposter-store.  Set in your environment variables:
```
GCS_BUCKET=
GOOGLE_CLOUD_PROJECT=
GOOGLE_CLOUD_KEYFILE=
```

3. Redis
Make sure you have redis available on port 6379, or a url set by:
```
REDIS_URL=
```

4. Mail Server
Mailer configuration can be changed in `production.rb`.
```
SMTP_PORT=
SMTP_SERVER=
SMTP_DOMAIN=
SMTP_LOGIN=
SMTP_PASSWORD=
```

5. Grobid Service
```
GROBID_HOST=
```

6. Figure Extraction Service
```
FIGURE_HOST=
```

7. ElasticSearch (optional)
Search runs through the searchkick gem, which relies on Elasticsearch. Refer to the [searchkick documentation](https://github.com/ankane/searchkick) for setting up Elasticsearch.
```
ELASTICSEARCH_URL=
```