FROM node:20-alpine AS build

WORKDIR /app
COPY package.json ./
RUN npm install

COPY tsconfig.json ./
COPY jest.config.js ./
COPY src ./src

# 3) Ejecutamos tests
RUN npm test

# 4) Compilamos
RUN npm run build

FROM node:20-alpine

WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["npm", "start"]