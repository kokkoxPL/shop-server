FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 4000

RUN npx prisma db push