FROM node:16.0.0

WORKDIR /app

COPY ./package*.json .

RUN npm install

COPY . .

ENV BACKEND_PORT ${PORT}

EXPOSE $BACKEND_PORT

CMD ["npm", "start"]
