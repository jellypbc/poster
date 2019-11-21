# FROM ruby:2.5.7-buster
FROM ruby:2.5.7-slim
# FROM ruby:2.5.7-alpine

ENV GEM_HOME="/usr/local/bundle"
ENV PATH $GEM_HOME/bin:$GEM_HOME/gems/bin:$PATH

# RUN apk add --update --no-cache \
#     build-base \
#     linux-headers \
#     postgresql-dev \
#     git \
#     nodejs \
#     yarn \
#     libc6-compat \
#     libxslt-dev \
#     libxml2-dev \
#     tzdata

RUN apt-get update && \
  apt-get install -qq -y build-essential \
  curl \
  gnupg2 \
  apt-transport-https \
  libpq-dev \
  postgresql-client-11 \
  yarn \
  --fix-missing --no-install-recommends

RUN curl --silent --show-error --location https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add -
RUN echo "deb https://deb.nodesource.com/node_6.x/ stretch main" > /etc/apt/sources.list.d/nodesource.list
RUN apt-get update
RUN apt-get install -y nodejs

# slim yarn
RUN curl --silent --show-error --location https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list
RUN apt-get update
RUN apt-get install -y yarn

ENV APP_HOME /app
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

ADD Gemfile* $APP_HOME/

ENV BUNDLE_GEMFILE=$APP_HOME/Gemfile \
  BUNDLE_JOBS=2 \
  BUNDLE_PATH=/bundle

# RUN bundle config --global frozen 1 \
RUN gem install bundler -v 2.0.2 --force
RUN bundle update --bundler
RUN bundle config --global frozen 1 \
  && bundle install --jobs 20 --retry 3 \
  # Remove unneeded files (cached *.gem, *.o, *.c)
  && rm -rf /usr/local/bundle/cache/*.gem \
  && find /usr/local/bundle/gems/ -name "*.c" -delete \
  && find /usr/local/bundle/gems/ -name "*.o" -delete

# Install yarn packages
COPY package.json yarn.lock /app/
RUN yarn install

# Add the Rails app
ADD . $APP_HOME

# COPY entrypoint.sh /usr/bin/
# RUN chmod +x /usr/bin/entrypoint.sh
# ENTRYPOINT ["entrypoint.sh"]
EXPOSE 3000

CMD ["docker/web-startup.sh"]