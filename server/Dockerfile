FROM node:16
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./

RUN npm config set unsafe-perm true

RUN npm i

RUN chown -R node /app/node_modules
USER node

CMD ["node", "index.js"]