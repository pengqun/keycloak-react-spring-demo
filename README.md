# keycloak-react-spring-demo

Showing how to integrate Keycloak IAM with a React & Spring based Web App.

## Run locally

### Run Keycloak server using Docker Compose

Open a terminal in current directory, and run the following command:

```bash
docker compose up --build
```

Keycloak server will be running at <http://localhost:8080>.

### Run backend Spring app using Gradle

Open another terminal in current directory, and run the following command:

```bash
cd backend
./gradlew bootRun
```

Backend Spring app will be running at <http://localhost:8000>.

### Run frontend React app using NPM

Open a third terminal in current directory, and run the following command:

```bash
cd frontend
npm install
npm run dev
```

Now, visit frontend URL: <http://localhost:3000>, you will be redirected to Keycloak login page.

## Deploy to cloud providers

### Deploy frontend to Cloudflare

### Deploy backend to Google Cloud Run

### Deploy keycloak to Google Cloud Run
