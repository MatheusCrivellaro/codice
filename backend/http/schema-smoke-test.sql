-- Smoke test para schema do catalogo (M09)
-- Executar contra o banco local apos rodar as migrations

-- ============================================================
-- 1. Caminho feliz
-- ============================================================

-- 1.1 Inserir um livro
INSERT INTO books (id, slug, title, authors, publisher, publication_year, isbn, academic_areas)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'dom-casmurro-machado-de-assis',
    'Dom Casmurro',
    'Machado de Assis',
    'Garnier',
    1899,
    '9788525406699',
    ARRAY['Literatura Brasileira', 'Letras']
);

-- 1.2 Criar um user de teste (necessario para seller)
INSERT INTO users (id, email, password_hash, name, profile_type, consented_privacy_at)
VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'vendedor@teste.com',
    '$2a$10$dummyhashparasmoketestapenasXXXXXXXXXXXXXX',
    'Livraria Teste',
    'BOOKSTORE',
    now()
);

-- 1.3 Promover user a seller
INSERT INTO sellers (id, user_id, seller_type, public_name, slug, city, state)
VALUES (
    'c0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'BOOKSTORE',
    'Livraria Teste',
    'livraria-teste',
    'Sao Paulo',
    'SP'
);

-- 1.4 Criar listing
INSERT INTO listings (id, seller_id, book_id, price_cents, condition, status)
VALUES (
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    3500,
    'MUITO_BOM',
    'ACTIVE'
);

-- 1.5 Adicionar 3 fotos ao listing
INSERT INTO listing_photos (listing_id, url, position, photo_type) VALUES
    ('d0000000-0000-0000-0000-000000000001', 'https://r2.codice.com.br/photos/001-capa.jpg', 0, 'COVER_FRONT'),
    ('d0000000-0000-0000-0000-000000000001', 'https://r2.codice.com.br/photos/001-lombada.jpg', 1, 'SPINE_BACK'),
    ('d0000000-0000-0000-0000-000000000001', 'https://r2.codice.com.br/photos/001-detalhe.jpg', 2, 'INNER_DETAIL');

-- 1.6 Testar trigger updated_at
-- Guardar o updated_at atual e atualizar
SELECT updated_at AS antes FROM listings WHERE id = 'd0000000-0000-0000-0000-000000000001';

UPDATE listings SET price_cents = 2900 WHERE id = 'd0000000-0000-0000-0000-000000000001';

SELECT updated_at AS depois FROM listings WHERE id = 'd0000000-0000-0000-0000-000000000001';
-- "depois" deve ser maior que "antes"

-- ============================================================
-- 2. Testes de constraint (todos devem falhar)
-- ============================================================

-- 2.1 Preco zero -> deve falhar (listings_price_cents_ck)
INSERT INTO listings (seller_id, book_id, price_cents, condition)
VALUES (
    'c0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    0,
    'BOM'
);

-- 2.2 Condition invalido -> deve falhar (listings_condition_ck)
INSERT INTO listings (seller_id, book_id, price_cents, condition)
VALUES (
    'c0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    1500,
    'PERFEITO'
);

-- 2.3 Seller duplicado para mesmo user -> deve falhar (sellers_user_id_uk)
INSERT INTO sellers (user_id, seller_type, public_name, slug)
VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'INDIVIDUAL',
    'Outro nome',
    'outro-slug'
);

-- ============================================================
-- 3. Limpeza (ordem inversa por causa das FKs)
-- ============================================================
DELETE FROM listing_photos WHERE listing_id = 'd0000000-0000-0000-0000-000000000001';
DELETE FROM listings WHERE id = 'd0000000-0000-0000-0000-000000000001';
DELETE FROM sellers WHERE id = 'c0000000-0000-0000-0000-000000000001';
DELETE FROM users WHERE id = 'b0000000-0000-0000-0000-000000000001';
DELETE FROM books WHERE id = 'a0000000-0000-0000-0000-000000000001';
