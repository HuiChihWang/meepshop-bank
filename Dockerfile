FROM node:18-alpine

RUN npm install -g @nestjs/cli

RUN npm install -g pnpm

WORKDIR /app
COPY . .

RUN pnpm install

RUN pnpm run build

CMD [ "npm", "run", "start:prod" ]

EXPOSE 3000