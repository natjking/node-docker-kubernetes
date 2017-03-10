# node-docker-kubernetes
Simple example of dockerising a node app, then using kubernetes

## Useful resources:

* Dockerise a node app: https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
* Minikube intro: https://kubernetes.io/docs/tutorials/stateless-application/hello-minikube/


## Instructions

Follow these steps:
*Note*: These instructions were written and tested on OS X.

### 1. Create node app

* Install node
* create a simple node application, for example that returns 'Hello' on port 8080 using express
* include a package.json with dependencies and a 'start' script. (docker will assume these exist and use them by default)

### 2. Create Docker image
*NOTE*: while this image will not be used in the Kubernetes part of this tutorial, it is useful to create and use a docker container as a learning exercise.
* Install Docker for mac
* create a Dockerfile. See: https://github.com/thisisdavidbell/node-docker-kubernetes/blob/master/Dockerfile

* create .dockerignore
* build docker image: `docker build -t <name> .`
* verify image exists: `docker images`
* run the docker image: `docker run -p 8081:8080 -d <name>`
* confirm docker image running: `docker ps`
* if not, confirm it exited: `docker ps -a`
* check app output: docker logs <container id from ps>
* invoke node app, on redirected port (8081)
* log into docker container: `docker exec -it <container id> /bin/bash`

### 3. run node app using kubernetes with MiniKube
Note: this creats a single pod containing a single container - the node app running in docker.
* install homebrew: https://brew.sh/
* install MiniKube: Follow steps in section 'Create a Minikube cluster' here: https://kubernetes.io/docs/tutorials/stateless-application/hello-minikube/
NOTE: if youhave VirtualBox installed already, you may be able to skip the xhyve steps and just use 'minikube start'
* Recreate your docker image of your node app, using the docker in minikube:
```
eval $(minikube docker-env)
docker build -t hello-node:v1 .
```
* run a deployment: `kubectl run hello-node --image=hello-node:v1 --port=8080
`
* view deployments: `kubectl get deployments`
* view pods: `kubectl get pods`
* view cluster events: `kubectl get events`
* view config: `kubectl config view`

* create a service to expose port outside of cluster: `kubectl expose deployment hello-node --type=LoadBalancer`

Note, the eval can be undone later with: `eval $(minikube docker-env -u).`

* view running app: `kubectl service hello-node` and add `/hello` to URL
* alternatively:
  * find ip from from: `kubectl ip`
  * find external port from : `kubectl get services`
  * open browser at: `ip:port/hello`

* Remove deployment and exposed port:
  * `kubectl get deployments`
  * `kubectl get services`
  * `kubectl delete deployment hello-node`
  * `kubectl delete service hello-node`
  * `kubectl get deployments`
  * `kubectl get services`


### 4. Run two containers in the one pods
* create a yaml file describing the deployment: see https://github.com/thisisdavidbell/node-docker-kubernetes/blob/master/hello-deployment.yaml
* create deployment from yaml: `kubectl create -f hello-deployment.yaml`
* expose app with external port: `kubectl expose deployment hello-node --type=LoadBalancer`
* confirm app running: `kubectl service hello-node` and add `/hello` to URL

* create a second node app to run in same pod in new dir
  * create Dockerfile for this app
  * create docker image
  * create new deployment and service just for this app to demo it works correctly in isolation

* create new kubernetes deployment yaml file containing both containers: `multi-apps-deployment.yaml`
* deploy: `kubectl create -f multi-apps-deployment.yaml`
* confirm: `kubectl get deployments`
* expose: `kubectl expose deployment multi-apps-node-from-yaml --type=LoadBalancer`
* view exposed external ports: `kubectl get services`
* Note the 2 mappings, different internal ports to different external ports
* test with curl
