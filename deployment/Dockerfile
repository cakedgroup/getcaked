FROM node:14.17.6

WORKDIR /usr/src/app
RUN mkdir frontend && mkdir backend
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

RUN cd frontend && npm install
RUN cd backend && npm install
RUN npm i -g @angular/cli

COPY . .

RUN cd frontend && npm run-script build

WORKDIR ./backend
CMD ["npm", "run-script", "start"]