FROM node:23-alpine3.19 AS build

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install -g @angular/cli
COPY . .
RUN npm run build --prod

FROM nginx:latest

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
RUN ls 
# Copy the build output to replace the default nginx contents.
COPY --from=build /usr/src/app/dist/todoapp/browser /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]

# Expose port 80
EXPOSE 80