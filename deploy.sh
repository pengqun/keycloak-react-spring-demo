#!/usr/bin/env bash

GCLOUD_PROJECT_ID=github-demos-427608                                                                                                              
GCLOUD_REGION=us-central1

FRONTEND_URL=https://keycloak-react-spring-demo.pages.dev
BACKEND_URL=https://spring-backend-lta4azdwga-uc.a.run.app

KEYCLOAK_HOST=keycloak-lta4azdwga-uc.a.run.app
KEYCLOAK_BASE_URL=https://${KEYCLOAK_HOST}
KEYCLOAK_REALM_URL=${KEYCLOAK_BASE_URL}/realms/myrealm

DEPLOY_VERSION=$(date "+%Y%m%d%H%M%S")

if [[ $1 == '' ]]; then
  echo "Please specify the service to deploy" && exit 1
fi

if [[ $1 == 'frontend' ]]; then
  echo "Start deploying frontend with version ${DEPLOY_VERSION}" && cd frontend

  cat <<EOL > .env.production
VITE_KEYCLOAK_CLIENT_ID=react-client-prod
VITE_KEYCLOAK_REALM_URL=${KEYCLOAK_REALM_URL}
VITE_BACKEND_BASE_URL=${BACKEND_URL}
VITE_DEPLOY_VERSION=${DEPLOY_VERSION}
EOL

  git add .env.production
  git commit -m "build: update version to $DEPLOY_VERSION"
  git push

  echo "Done Deploying frontend" && cd ..
fi

if [[ $1 == 'backend' ]]; then
  echo "Start deploying backend with version ${DEPLOY_VERSION}" && cd backend 

  gcloud run deploy spring-backend \
    --source . \
    --platform=managed \
    --region=${GCLOUD_REGION} \
    --allow-unauthenticated \
    --memory=512Mi \
    --cpu=2 \
    --min-instances=0 \
    --max-instances=1 \
    --set-env-vars KEYCLOAK_REALM_URL=${KEYCLOAK_REALM_URL},CORS_ALLOWED_ORIGINS=${FRONTEND_URL},DEPLOY_VERSION=${DEPLOY_VERSION}

  echo "Done Deploying backend" && cd ..
fi

if [[ $1 == 'keycloak' ]]; then
  echo "Start deploying keycloak with version ${DEPLOY_VERSION}" && cd keycloak
  
  docker buildx build --platform=linux/amd64 . -t mykeycloak
  docker tag mykeycloak gcr.io/${GCLOUD_PROJECT_ID}/keycloak:latest
  docker push gcr.io/${GCLOUD_PROJECT_ID}/keycloak:latest

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
    --args=start-dev,--import-realm \
    --set-env-vars KC_HOSTNAME=${KEYCLOAK_HOST},DEPLOY_VERSION=${DEPLOY_VERSION}

  echo "Done Deploying keycloak" && cd ..
fi