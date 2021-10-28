# getcaked
Website project used for caking your ignorant coworkers/friends/classmates

## Deployment

To build our docker image and push it to our registry, run:
```bash
docker build -t getcaked:latest -f ./deployment/Dockerfile .
docker image tag getcaked some-registry.com/getcaked:latest
docker push some-registry.com/getcaked:latest
```
