FROM node:18-alpine

WORKDIR /app

# For development of daftar-properti-sync, clone it under libs/
# COPY libs/ libs/

COPY package*.json .

RUN npm install
COPY synchronizer.ts tsconfig.json ./

RUN npx tsc

CMD ["node", "synchronizer.js"]
