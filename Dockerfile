FROM node:alpine

# Create app directory
WORKDIR /usr/src/itribe

# Install app dependencies
COPY package.json .

# COPY package.json package-lock.json .

RUN npm install

# Bundle app source
COPY . .

EXPOSE 9000

CMD [ "node", "server" ]