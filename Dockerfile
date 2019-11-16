FROM ruby:2.5.7-alpine

# ENV BUNDLE_PATH /app
# ENV GEM_PATH /app
# ENV GEM_HOME /app

ENV GEM_HOME="/usr/local/bundle"
ENV PATH $GEM_HOME/bin:$GEM_HOME/gems/bin:$PATH

RUN apk add --update --no-cache \
    build-base \
    linux-headers \
    postgresql-dev \
    git \
    nodejs \
    yarn \
    tzdata

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

# CMD ["rails", "server", "-b", "0.0.0.0"]

CMD ["docker/entrypoint.sh"]