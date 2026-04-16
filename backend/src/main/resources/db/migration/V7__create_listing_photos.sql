CREATE TABLE listing_photos (
    id          UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id  UUID           NOT NULL,
    url         VARCHAR(500)   NOT NULL,
    position    SMALLINT       NOT NULL,
    photo_type  VARCHAR(20)    NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

    CONSTRAINT listing_photos_listing_id_fk FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
    CONSTRAINT listing_photos_listing_id_position_uk UNIQUE (listing_id, position),
    CONSTRAINT listing_photos_photo_type_ck CHECK (photo_type IN ('COVER_FRONT', 'SPINE_BACK', 'INNER_DETAIL', 'DEFECT', 'TITLE_PAGE', 'OTHER'))
);

CREATE INDEX listing_photos_listing_id_idx ON listing_photos (listing_id);
