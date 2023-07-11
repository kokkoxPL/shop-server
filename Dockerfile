FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN npx prisma generate