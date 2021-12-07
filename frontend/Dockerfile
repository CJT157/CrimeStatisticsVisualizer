FROM node:16
WORKDIR /app

COPY package.json .
COPY --chown=node:node package.json .
RUN npm install

COPY --chown=node:node . .
USER node
COPY . .

CMD ["npm", "run", "start"]