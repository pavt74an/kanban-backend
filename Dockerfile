# base image
FROM node:21.6.2 AS base

# set working directory
WORKDIR /app

# builder
FROM base AS build

# copy package.json and package-lock.json
COPY package*.json ./

# install dependencies (production only)
RUN npm ci

# copy project to working directory
COPY . .

# build project
RUN npm run build

# production image
FROM base AS production

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json .
COPY --from=build /app/package-lock.json .

RUN npm ci --only=production

# expose port
EXPOSE 3000

# run app
CMD ["node", "dist/main"]
