# frontend/Dockerfile

FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . ./
RUN npm run build  # builds into /app/dist

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3002
CMD ["nginx", "-g", "daemon off;"]
