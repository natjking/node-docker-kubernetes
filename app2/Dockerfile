FROM node:boron
EXPOSE 8081

# create a working dir
RUN mkdir /usr/app2
WORKDIR /usr/app2

# Copy over files (ignoring those in .dockerignore)
COPY . .

# Install dependencies
RUN npm install

CMD [ "npm", "run", "start" ]
