-- Função reutilizável para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tabela de livros (catálogo compartilhado)
CREATE TABLE books (
    id               UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    slug             VARCHAR(200)   NOT NULL,
    title            VARCHAR(300)   NOT NULL,
    authors          TEXT           NOT NULL,
    publisher        VARCHAR(200),
    publication_year SMALLINT,
    edition          VARCHAR(50),
    language         VARCHAR(10)    NOT NULL DEFAULT 'pt-BR',
    isbn             VARCHAR(20),
    translator       VARCHAR(200),
    academic_areas   TEXT[]         NOT NULL DEFAULT '{}',
    synopsis         TEXT,
    cover_image_url  VARCHAR(500),
    created_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

    CONSTRAINT books_slug_uk UNIQUE (slug),
    CONSTRAINT books_publication_year_ck CHECK (publication_year IS NULL OR (publication_year > 1400 AND publication_year < 2200))
);

-- ISBN unico apenas quando preenchido
CREATE UNIQUE INDEX books_isbn_uk ON books (isbn) WHERE isbn IS NOT NULL;

-- Fuzzy matching no titulo (pg_trgm)
CREATE INDEX books_title_trgm_idx ON books USING gin (title gin_trgm_ops);

-- Filtros por area academica
CREATE INDEX books_academic_areas_idx ON books USING gin (academic_areas);

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON books
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at();
