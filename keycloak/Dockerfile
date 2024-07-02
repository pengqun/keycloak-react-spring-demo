# Stage 1: Build
FROM quay.io/keycloak/keycloak:latest as builder

# ENV KC_DB=dev-file
ENV KC_DB=dev-mem
ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true

COPY --chown=keycloak:keycloak realm.json /opt/keycloak/data/import/realm.json

RUN /opt/keycloak/bin/kc.sh build

# Stage 2: Runtime
FROM quay.io/keycloak/keycloak:latest

COPY --from=builder /opt/keycloak/ /opt/keycloak/

ENV LANG C.UTF-8
ENV TZ=Asia/Shanghai

ENV KC_CACHE=local
ENV KC_HTTP_ENABLED=true
ENV KC_PROXY_HEADERS=xforwarded
ENV KEYCLOAK_ADMIN=admin
ENV KEYCLOAK_ADMIN_PASSWORD=admin

WORKDIR /opt/keycloak

EXPOSE 8080 9000

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]

CMD ["start", "--optimized", "--import-realm"]