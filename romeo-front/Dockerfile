# pull official base image
FROM node:13.12.0

# set working directory
RUN mkdir -p /usr/src/romeo-front
WORKDIR /usr/src/romeo-front

# add `/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/romeo-front/node_modules/.bin:$PATH
ENV PATH /usr/src/romeo-front/build:$PATH

# install app dependencies
COPY ./package.json .
COPY ./yarn.lock .
RUN yarn --silent
RUN yarn add react-scripts@3.4.1 -g --silent
RUN yarn global add less

#Build css
COPY ./src/style ./src/style
RUN lessc src/style/index.less src/assets/index.css --js

#Build dist
COPY . /usr/src/romeo-front
RUN yarn build

RUN yarn global add serve
