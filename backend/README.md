# Códice — Backend

API REST em Spring Boot 3 + Java 21 + PostgreSQL 16.

## Pré-requisitos

- Java 21
- Postgres rodando (ver `../infra/README.md`)

## Como rodar

```bash
./mvnw spring-boot:run
```

API sobe em http://localhost:8080

## Healthcheck

```bash
curl http://localhost:8080/actuator/health
```

## Migrations

Flyway aplica automaticamente ao subir. Arquivos em `src/main/resources/db/migration/`.