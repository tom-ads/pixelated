# COMP3006 - Pixelated a Pictionary Game

A party-based pictionary game

# Technology

Pixelated uses yarn workspaces to construct a monorepo.

- React - Build the interactive UI through components
- NodeJs + ExpressJs - Build the API and web socket handling
- MongoDb - Data persistence

# Requirements

- `node` version `16` or above.
- `docker` installed (if you decide to run the MongoDb container over using atlas)
- `yarn` version `1` (recommended) or above.

# Setup

1. Clone the repo and go into the root directory.
2. Run `yarn` to install packages dependencies.
3. Go into `apps/client` and copy the `.env.example` file. Make a `.env` file and copy contents over.
4. Repeat for `apps/server` environment file.
5. If you're using a MongoDb Atlas connection string, then you do not need to provide the other MongoDb variables
6. If you're using the docker file to run Mongo. Do the following:
   1. Ensure you are inside `apps/server` directory.
   2. Ensure `.env` file contains the outlined variables below. `.env.example` has defaults:
      - `MONGO_DB_NAME`
      - `MONGO_DB_USERNAME`
      - `MONGO_DB_PASSWORD`
      - `MONGO_CONNECTION_URL`
   3. Run `docker-compose up -d`
7. Now you should be ready to go! Go back to the root directoy and run `yarn dev` to start the application.
