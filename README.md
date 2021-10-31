# getcaked
Website project used for caking your ignorant coworkers/friends/classmates

## Development

To start working on the project install all nessicary dependencies in both projects:

```bash
cd frontend && npm install
cd ../backend && npm install
```

Then run the development servers for the frontend and backend respectively:

```bash
# frontend
npm run-script start

# backend (might require building frontend)
npm run-script start
```

If you wish to build the frontend and test serving it from node, run:
```bash
npm run-script build
```

## Deployment

To build our docker image and push it to a registry, run:

```bash
docker build -t getcaked:latest -f ./deployment/Dockerfile .

# optional
docker image tag getcaked some-registry.com/getcaked:latest
docker push some-registry.com/getcaked:latest
```
