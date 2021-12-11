FROM node:16

# set working directory
WORKDIR /app

# copy package & package-lock files
COPY package.json ./
COPY package-lock.json ./

# copy app
COPY ./ ./

# install dependencies
RUN npm config set unsafe-perm true
RUN npm i

RUN chown -R node /app/node_modules
USER node

# start server
CMD ["node", "index.js"]