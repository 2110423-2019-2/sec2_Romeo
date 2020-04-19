# pull official base image
FROM node:13.12.0

# set working directory
RUN mkdir -p /usr/src/romeo-front
WORKDIR /usr/src/romeo-front

# Copying src
COPY ./src ./src

# add `/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/romeo-front/node_modules/.bin:$PATH

# install app dependencies
COPY ./package.json .
COPY ./yarn.lock .
RUN yarn --silent
RUN yarn add react-scripts@3.4.1 -g --silent
RUN yarn global add less
RUN lessc src/style/index.less src/assets/index.css --js

COPY . /usr/src/romeo-front

# Build dist
RUN yarn build

RUN yarn global add serve

CMD ["serve", "-s", "romeo-front/build"]doc