# keycloak-react-spring-demo

Showing how to integrate Keycloak IAM with React frontend and Spring backend.

Online demo: <https://keycloak-react-spring-demo.pages.dev>

Main techical stack and depdendency versions:

- **Keycloak**: 25.0.1
- **Frontend**
  - **React**: 18.20
  - **react-oidc-context**:
- **Backend**
  - **Spring Boot**:

## Run everything locally

### 1. Run Keycloak server using Docker Compose

Open a terminal in current directory, and run the following command:

```bash
docker compose up --build
```

Keycloak server will be running at <http://localhost:8080>.

### 2. Run backend Spring app using Gradle

Open another terminal in current directory, and run the following command:

```bash
cd backend
./gradlew bootRun
```

Backend Spring app will be running at <http://localhost:8000>.

### 3. Run frontend React app using NPM

Open a third terminal in current directory, and run the following command:

```bash
cd frontend
npm install
npm run dev
```

Now, visit frontend URL: <http://localhost:3000>, you will be redirected to Keycloak login page.

## Deploy to cloud providers

In this demo, I will use Google Cloud Run and Cloudflare Pages as examples.

### 1. Deploy Keycloak server to Google Cloud Run

First, setup your Google Cloud project ID and region:

```bash
export GCLOUD_PROJECT_ID=<YOUR_PROJECT_ID>
export GCLOUD_REGION=<YOUR_REGION>
```

Build Docker image and push to Google Container Registry:

```bash
cd keycloak
docker build . -t mykeycloak
docker tag mykeycloak gcr.io/${GCLOUD_PROJECT_ID}/keycloak:latest
docker push gcr.io/${GCLOUD_PROJECT_ID}/keycloak:latest
```

**Note**: if you're using Mac with M-series chip, you should build Docker image using following cross-compile command:

```bash
docker buildx build --platform=linux/amd64 . -t mykeycloak
```

Then, deploy to Google Cloud Run using following command:

```bash
gcloud run deploy keycloak \
    --image=gcr.io/${GCLOUD_PROJECT_ID}/keycloak:latest \
    --platform=managed \
    --region=${GCLOUD_REGION} \
    --allow-unauthenticated \
    --port=8080 \
    --memory=1024Mi \
    --cpu=2 \
    --min-instances=0 \
    --max-instances=1 \
    --args=start,--import-realm,--cache=local
    --set-env-vars KEYCLOAK_ADMIN=admin,KEYCLOAK_ADMIN_PASSWORD=admin,KC_HTTP_ENABLED=true,KC_PROXY_HEADERS=xforwarded,KC_HOSTNAME=keycloak-lta4azdwga-uc.a.run.app
```

**Note**: KC_HOSTNAME should be set to the domain of your deployed instance, which may only be able to obtain after deployment:

```bash
gcloud run services describe keycloak --platform=managed --region=${GCLOUD_REGION}
```

You can first ignore KC_HOSTNAME, and then update it after deployment.

### 2. Deploy backend Spring app to Google Cloud Run

Instead of building Docker image yourself, we can leverage gcloud CLI's source-to-image

```bash
cd backend

gcloud run deploy spring-backend \
    --source . \
    --platform=managed \
    --region=${GCLOUD_REGION} \
    --allow-unauthenticated \
    --memory=256Mi \
    --cpu=1 \
    --min-instances=0 \
    --max-instances=1 \
    --set-env-vars KEYCLOAK_REALM_URL=https://keycloak-lta4azdwga-uc.a.run.app/realms/myrealm
```

### 3. Deploy frontend React app to Cloudflare Pages

```bash

```

## Credits

This demo is inspired by the following projects:

- [authts/sample-keycloak-react-oidc-context](https://github.com/authts/sample-keycloak-react-oidc-context?tab=readme-ov-file>)
- [ivangfr/springboot-react-keycloak](https://github.com/ivangfr/springboot-react-keycloak)
