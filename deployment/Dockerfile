FROM node:16-alpine AS builder
COPY ./frontend /frontend
WORKDIR /frontend
RUN npm install
RUN npm run-script prod

FROM node:16-alpine
COPY ./backend /opt/getcaked/backend
COPY --from=builder /frontend/dist/ /opt/getcaked/frontend/dist
WORKDIR /opt/getcaked/backend
RUN npm install 

CMD [ "npm", "run-script", "start" ]
