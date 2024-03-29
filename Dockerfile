# Check out https://hub.docker.com/_/node to select a new base image
FROM node:slim

# Create app directory (with user `node`)
RUN mkdir /app; chown node:node /app

# Set to a non-root built-in user `node`
USER node

WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node package*.json ./

RUN npm install

# Bundle app source code
COPY --chown=node . .

ENV PATH="${PATH}:/app/node_modules/.bin/"

RUN npm run build

# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0 PORT=3000

EXPOSE ${PORT}
CMD [ "node", "." ]
