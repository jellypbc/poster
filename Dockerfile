FROM ruby:2.5.7-slim

ENV GEM_HOME="/usr/local/bundle"
ENV PATH $GEM_HOME/bin:$GEM_HOME/gems/bin:$PATH

RUN apt-get update && \
  apt-get install -qq -y build-essential \
  curl \
  gnupg2 \
  apt-transport-https \
  libpq-dev \
  postgresql-client-11 \
  yarn \
  --fix-missing --no-install-recommends

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update -qq && apt-get install -qq --no-install-recommends \
    nodejs \
    yarn \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# RUN curl --silent --show-error --location https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add -
# RUN echo "deb https://deb.nodesource.com/node_6.x/ stretch main" > /etc/apt/sources.list.d/nodesource.list
# RUN apt-get update
# RUN apt-get install -y nodejs

# RUN curl --silent --show-error --location https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
# RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list
# RUN apt-get update
# RUN apt-get install -y yarn

ENV APP_HOME /app
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

ADD Gemfile* $APP_HOME/

ENV BUNDLE_GEMFILE=$APP_HOME/Gemfile \
  BUNDLE_JOBS=2 \
  BUNDLE_PATH=/bundle


RUN gem install bundler -v 2.0.2 --force
RUN bundle update --bundler
RUN bundle config --global frozen 1 \
  && bundle install --jobs 20 --retry 3 \
  && rm -rf /usr/local/bundle/cache/*.gem \
  && find /usr/local/bundle/gems/ -name "*.c" -delete \
  && find /usr/local/bundle/gems/ -name "*.o" -delete

COPY package.json yarn.lock /app/
RUN yarn install

ADD . $APP_HOME

EXPOSE 3000

CMD ["docker/web-startup.sh"]