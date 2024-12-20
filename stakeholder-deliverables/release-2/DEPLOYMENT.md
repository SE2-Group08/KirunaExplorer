# Kiruna Explorer - Deployment Guide

This guide provides instructions for deploying and running the Kiruna Explorer application using Docker. All required
configurations are included in the provided `docker-compose.yml` and `.env` files.

## Prerequisites

### 1. Install Docker

Download and install Docker from [Docker's official website](https://www.docker.com/).

### 2. Files You Need

* `docker-compose.yml`: Defines the services for the application (database, backend, and frontend).
* `.env`: Contains environment variables needed for configuration. You will create this file using the provided
  `.env.example` as a template.

### 3. Create the `.env` File

1. Copy the provided `.env.example` file:

  ```bash
  cp .env.example .env
  ```

2. Open the `.env` file and fill in the database credentials.

### 4. Set [JWT](https://jwt.io/) Configuration

To configure JWT, you need to set the following environment variables in the .env file:

- `JWT_KEY`: This is the secret key used to sign the JWT tokens. You can generate a random string for this value. For
  example, you can use an online tool or a command like `openssl rand -base64 -hex 64` to generate a secure key.
- `JWT_EXPIRY`: This is the maximum duration for a user session, specified in milliseconds. For example, to set the
  session duration to 1 hour, you can use the value `3600000`.

## Starting the Application

1. Open a terminal and navigate to the directory containing the `docker-compose.yml` and `.env` files.

2. Run the following command to start the application:

```bash
docker compose up -d
```

3. Once the containers are running, you can access the application at `http://localhost:5173`.

## Stopping the Application

To stop and remove all running containers, run the following command:

```bash
docker compose down
```
