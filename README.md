# keycloak-react-spring-demo

A simple demo and useful playground for integrating **Keycloak** with **React** frontend and **Spring** backend, using standard [OpenID Connect](https://openid.net/) protocol.

![Online Demo Showcase](./assets/online-demo.gif)

Main technical stack involved (with exact depencency versions):

- **Keycloak**: v25.0.1
- **React**: v18.3.1
  - [react-oidc-context](https://github.com/authts/react-oidc-context): v3.2.0 (**which interact with Keycloak to auth user and get OIDC tokens**)
  - [oidc-client-ts](https://github.com/authts/oidc-client-ts): v3.1.0
  - [react-router](https://github.com/remix-run/react-router): v6.29.0
  - [react-query](https://github.com/tanstack/query): v5.66.9
  - [react-toastify](https://github.com/fkhadra/react-toastify): v10.0.6
  - [react18-json-view](https://github.com/YYsuni/react18-json-view): v0.2.9
  - [tailwindcss](https://tailwindcss.com/): v3.4.17
  - [daisyui](https://daisyui.com/): v4.12.23
  - [heroicons](https://github.com/tailwindlabs/heroicons): v2.2.0
  - [typescript](https://www.typescriptlang.org/): v5.7.3
  - [vite](https://vitejs.dev/): v5.4.14
- **Spring Boot**: v3.3.1
  - [spring-boot-starter-oauth2-resource-server](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/index.html): bundled (**which interact with Keycloak to validate OIDC tokens and get user info**)
  - [spring-boot-starter-webflux](https://docs.spring.io/spring-framework/reference/web/webflux.html): bundled
  - [kotlin](https://kotlinlang.org/docs/home.html): v2.0.0
  - [gradle](https://docs.gradle.org/): v8.7

## Online Demo

Link: <https://keycloak-react-spring-demo.pages.dev>

- After redirecting to Keycloak login page, enter username `test` and password `test`.
- You can also access the Keycloak [admin console](https://keycloak-lta4azdwga-uc.a.run.app/admin), with username `admin` and password `admin`.

### Homepage

Showing what you'll get (that is, a `AuthContextProps` object) in frontend after login:

![alt text](./assets/homepage-1.png)

![alt text](./assets/homepage-2.png)

### API Playground

Sending request (with or without token) to backend, and get response with decoded JWT:

![alt text](./assets/playground-1.png)

![alt text](./assets/homepage-2.png)

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
    --memory=2Gi \
    --cpu=4 \
    --min-instances=0 \
    --max-instances=1 \
    --set-env-vars KC_HOSTNAME=keycloak-lta4azdwga-uc.a.run.app
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
    --memory=512Mi \
    --cpu=2 \
    --min-instances=0 \
    --max-instances=1 \
    --set-env-vars KEYCLOAK_REALM_URL=https://keycloak-lta4azdwga-uc.a.run.app/realms/myrealm,CORS_ALLOWED_ORIGINS=https://keycloak-react-spring-demo.pages.dev
```

### 3. Deploy frontend React app to Cloudflare Pages

You can deploy a Cloudflare Pages project using CLI, direct upload, or Git integration, see [docs](https://developers.cloudflare.com/pages/get-started/).

In this demo, I used Git integration to integration this GitHub repo with Cloudflare Pages. After configured, you can deploy the front app by running the following command:

```bash
./deploy.sh frontend
```

## Credits

This demo is inspired by the following projects:

- [authts/sample-keycloak-react-oidc-context](https://github.com/authts/sample-keycloak-react-oidc-context?tab=readme-ov-file>)
- [ivangfr/springboot-react-keycloak](https://github.com/ivangfr/springboot-react-keycloak)
