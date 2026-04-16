CREATE TABLE sellers (
    id               UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID           NOT NULL,
    seller_type      VARCHAR(32)    NOT NULL,
    public_name      VARCHAR(150)   NOT NULL,
    slug             VARCHAR(120)   NOT NULL,
    description      TEXT,
    banner_image_url VARCHAR(500),
    avatar_image_url VARCHAR(500),
    city             VARCHAR(120),
    state            VARCHAR(2),
    neighborhood     VARCHAR(120),
    created_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

    CONSTRAINT sellers_user_id_uk UNIQUE (user_id),
    CONSTRAINT sellers_slug_uk UNIQUE (slug),
    CONSTRAINT sellers_user_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT sellers_seller_type_ck CHECK (seller_type IN ('BOOKSTORE', 'INDIVIDUAL'))
);

-- Filtros de localizacao
CREATE INDEX sellers_state_city_idx ON sellers (state, city);

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON sellers
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at();
