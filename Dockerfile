FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
COPY prisma.config.ts ./
COPY prisma/ ./prisma/

RUN npm ci

COPY . .

ENV DATABASE_URL=file:./dummy.db

RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]
