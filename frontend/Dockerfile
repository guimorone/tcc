# Build the React front-end
FROM node:20.16-alpine AS build-step
WORKDIR /frontend

ENV PATH /node_modules/.bin:$PATH
COPY package*.json ./
RUN npm install

ENV VITE_APP_NAME=TCC \
  VITE_BACKEND_URL=http://127.0.0.1:5000
COPY ./ ./
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build-step /frontend/dist /usr/share/nginx/html
COPY /deployment/nginx.default.conf /etc/nginx/conf.d/default.conf