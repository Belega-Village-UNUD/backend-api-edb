FROM node:16.0.0 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY src src

FROM gcr.io/distroless/nodejs16 as environment

COPY --from=build /app /app

WORKDIR /app

ENV BACKEND_PORT ${PORT}

EXPOSE $BACKEND_PORT

CMD ["src/app.js"]
