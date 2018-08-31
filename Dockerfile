FROM node:10-alpine

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

# Set a working directory
WORKDIR /app

COPY .npmrc package.json yarn.lock ./
# Install Node.js dependencies
RUN yarn

# Run the container under "node" user by default
# USER node

CMD [ "yarn", "start" ]
