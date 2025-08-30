# ---- build (Node) ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
ARG VITE_API_BASE=/api
ENV VITE_API_BASE=${VITE_API_BASE}
COPY . .
RUN npm run build

# ---- runtime (Nginx) ----
FROM nginx:1.27-alpine
# petite conf par défaut (optionnelle) pour single-page app
# COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
