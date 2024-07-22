# Build the React front-end
FROM node:20.15-alpine as build-step
WORKDIR /frontend

ENV PATH /node_modules/.bin:$PATH
COPY package*.json ./
RUN npm install
COPY ./ ./
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build-step /frontend/dist /usr/share/nginx/html
COPY deployment/nginx.default.conf /etc/nginx/conf.d/default.conf