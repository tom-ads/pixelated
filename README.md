# COMP3017 - Pixeled (Pictionary)

A party-based pictionary game

# Technology

Pixelated uses yarn workspaces to construct a monorepo.

- React - Build the interactive UI through components
- NodeJs + Express - NodeJs framework for building RESTful APIs
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
