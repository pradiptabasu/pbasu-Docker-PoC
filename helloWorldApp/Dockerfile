FROM node
LABEL version="1.0"
LABEL description="Docker Nodejs HelloWorldApp"
RUN mkdir -p /root/helloworldapp
WORKDIR /root/helloworldapp
COPY . /root/helloworldapp
ENTRYPOINT ["npm", "start"]
