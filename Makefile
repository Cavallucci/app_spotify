DOCKER_ENV_FILE = ./env/docker.env

all: build

build:
	docker-compose --env-file $(DOCKER_ENV_FILE) up -d --build

clean:
	docker-compose --env-file $(DOCKER_ENV_FILE) down
	docker container prune -f
	docker image prune -f