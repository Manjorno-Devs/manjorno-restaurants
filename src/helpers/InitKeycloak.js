import session from "express-session";
import Keycloak from "keycloak-connect";

let keycloak = undefined;

const config = {
    "realm": "Manjorno",
    "bearer-only": true,
    "auth-server-url": "http://localhost:8080/auth/",
    "ssl-required": "external",
    "resource": "express-microservice",
    "confidential-port": 0
  }

export default function KeycloakInit() {
    if (keycloak) {
        return keycloak;
    } else {
        keycloak = new Keycloak({
            store: new session.MemoryStore(),
            secret: 's3cr3t'
        }, config);
        return keycloak;
    }
};