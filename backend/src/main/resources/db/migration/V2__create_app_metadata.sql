CREATE TABLE app_metadata (
                              key   VARCHAR(100) PRIMARY KEY,
                              value TEXT         NOT NULL
);

INSERT INTO app_metadata (key, value)
VALUES ('schema_version', '0.1.0'),
       ('project_phase', 'fase-0');