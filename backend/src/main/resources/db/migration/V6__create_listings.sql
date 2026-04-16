CREATE TABLE listings (
    id              UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id       UUID           NOT NULL,
    book_id         UUID           NOT NULL,
    price_cents     INTEGER        NOT NULL,
    condition       VARCHAR(20)    NOT NULL,
    condition_notes TEXT,
    description     TEXT,
    status          VARCHAR(20)    NOT NULL DEFAULT 'PENDING_REVIEW',
    published_at    TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

    CONSTRAINT listings_seller_id_fk FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE CASCADE,
    CONSTRAINT listings_book_id_fk FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE RESTRICT,
    CONSTRAINT listings_price_cents_ck CHECK (price_cents > 0),
    CONSTRAINT listings_condition_ck CHECK (condition IN ('NOVO', 'COMO_NOVO', 'MUITO_BOM', 'BOM', 'ACEITAVEL')),
    CONSTRAINT listings_status_ck CHECK (status IN ('PENDING_REVIEW', 'ACTIVE', 'PAUSED', 'SOLD'))
);

CREATE INDEX listings_seller_id_idx ON listings (seller_id);
CREATE INDEX listings_book_id_idx ON listings (book_id);
CREATE INDEX listings_status_idx ON listings (status);
CREATE INDEX listings_status_created_at_idx ON listings (status, created_at DESC);

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON listings
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at();
