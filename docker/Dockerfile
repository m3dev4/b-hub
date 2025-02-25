FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g pnpm

COPY . .

EXPOSE 8080

CMD ["pnpm", "start"]

