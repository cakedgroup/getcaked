# getcaked
Website project used for caking your ignorant coworkers/friends/classmates

- [Non-obvious functionality](#non-obvious-functionality)
- [General Features and Functionality](#general-features-and-functionality)
- [Development](#Development)
- [Deployment](#Deployment)

## Development

To start working on the project install all nessicary dependencies in both projects:

```bash
cd frontend && npm install
cd ../backend && npm install
```

Then run the development servers for the frontend and backend respectively:

```bash
# backend (might require building frontend)
npm run-script dev

# frontend
npm run-script start
```

If you wish to build the frontend and test serving it from node, run:
```bash
npm run-script build
```

## Non-obvious functionality
- Light and darkmode based on user system preferences
- admin/settings pannels for users and groups
- admin closable cakeEvents

## General Features and Functionality

### Core Concept
The core concept for getcaked was to create a platform for our class to "cake" each other (to catch someone with an unattended laptop and to proclaim that said person will bake a cake for the entire class in their name).


### Groups an users
A user of the platform could be added into groups, where they would then be able to be caked.
These groups are devided into: 
- `private` (publically visible but only allows cakes for members)
- `public` (publically visible and allows cakes for non logged in users)
- `private-invisible` (not publically visible or accessible)

Hereby the recomended default is `public`, as both private groups are easily defensible by simply logging out of the platform, thus preventing other people from caking oneself.

### Games
To entice users to remain logged in, logged in users have an additional defense mechanism.
Every time a logged in user is caked, the offender has to first finish playing a round of tic tac toe before they can cake the user.
This additional delay could lead to the offender not being able to cake the user.

Implementation wise, games are handled by the server signing tokens of the various game moves (as to prevent cheating), and the client sending up the sequential game moves.

### Cake Event
If a user is caked, a cake Event is created.
Cake events are visible for everyone inside a certain group in the overview page.
Furtherly, every user can view an updated list of their own cakeEvents across all groups in a cake overview page.

As soon as a user has actually baked a cake and thus deliverd on "their" promise, an admin of a group can close the cakes.

## Deployment

To build our docker image and push it to a registry, run:

```bash
docker build -t getcaked:latest -f ./deployment/Dockerfile .

# optional
docker image tag getcaked some-registry.com/getcaked:latest
docker push some-registry.com/getcaked:latest
```
