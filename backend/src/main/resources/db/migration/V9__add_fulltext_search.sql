-- Coluna tsvector materializada pra busca full-text
ALTER TABLE books ADD COLUMN search_vector tsvector;

-- Popula com dados existentes
UPDATE books SET search_vector =
    setweight(to_tsvector('portuguese', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('portuguese', coalesce(authors, '')), 'B') ||
    setweight(to_tsvector('portuguese', coalesce(synopsis, '')), 'C') ||
    setweight(to_tsvector('portuguese', coalesce(publisher, '')), 'D');

-- Indice GIN pra busca rapida
CREATE INDEX idx_books_search_vector ON books USING GIN (search_vector);

-- Trigger pra manter atualizado
CREATE OR REPLACE FUNCTION books_search_vector_update() RETURNS trigger AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('portuguese', coalesce(NEW.title, '')), 'A') ||
        setweight(to_tsvector('portuguese', coalesce(NEW.authors, '')), 'B') ||
        setweight(to_tsvector('portuguese', coalesce(NEW.synopsis, '')), 'C') ||
        setweight(to_tsvector('portuguese', coalesce(NEW.publisher, '')), 'D');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_books_search_vector
    BEFORE INSERT OR UPDATE ON books
    FOR EACH ROW
    EXECUTE FUNCTION books_search_vector_update();
