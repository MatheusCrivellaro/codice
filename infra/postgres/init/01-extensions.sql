-- Extensões necessárias pelo Códice

-- Trigram similarity: usado pra busca fuzzy de livros sem ISBN
-- (ver Documento Mestre, Cap. 5 — "Tratamento de livros sem ISBN")
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Vetores: usado pelo RAG do Livro dos Livros (Fase 2)
-- Habilitado desde já pra evitar migration de extensão depois
CREATE EXTENSION IF NOT EXISTS vector;