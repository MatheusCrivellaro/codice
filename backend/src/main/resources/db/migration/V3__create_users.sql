CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
    id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    email          VARCHAR(255) NOT NULL,
    password_hash  VARCHAR(255) NOT NULL,
    name           VARCHAR(120) NOT NULL,
    profile_type   VARCHAR(32)  NOT NULL,
    consented_privacy_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

    CONSTRAINT users_email_uk UNIQUE (email),
    CONSTRAINT users_profile_type_ck CHECK (profile_type IN ('BUYER', 'BOOKSTORE', 'INDIVIDUAL_SELLER'))
);

CREATE INDEX users_email_idx ON users (email);
