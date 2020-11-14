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
Defaults to using Google Cloud Storage, so set:
```
GCS_BUCKET=
GOOGLE_CLOUD_PROJECT=
STORAGE_CRENDENTIALS=
```

3. Redis
```
REDIS_URL=
```

4. Mail Server

5. Grobid Service (optional)
```
GROBID_URL
```

6. Figure Extraction Service (optional)
```
FIGURE_URL
```

7. ElasticSearch (optional)
Search runs through the searchkick gem, which relies on Elasticsearch. Refer to the [searchkick documentation](https://github.com/ankane/searchkick) for setting up Elasticsearch.
```
ELASTICSEARCH_URL=
```