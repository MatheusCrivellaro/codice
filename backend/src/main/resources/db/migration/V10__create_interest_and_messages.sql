-- Threads de interesse (comprador → listing)
CREATE TABLE interest_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED', 'SOLD')),
    last_message_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT uq_thread_listing_buyer UNIQUE (listing_id, buyer_id)
);

CREATE INDEX idx_interest_threads_buyer_id ON interest_threads (buyer_id);
CREATE INDEX idx_interest_threads_listing_id ON interest_threads (listing_id);

-- Mensagens
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID NOT NULL REFERENCES interest_threads(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    content TEXT NOT NULL CHECK (length(content) > 0 AND length(content) <= 2000),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_thread_created ON messages (thread_id, created_at ASC);

-- Status de leitura por participante
CREATE TABLE thread_read_status (
    thread_id UUID NOT NULL REFERENCES interest_threads(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    last_read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    PRIMARY KEY (thread_id, user_id)
);

-- Trigger de updated_at em interest_threads
CREATE OR REPLACE FUNCTION update_interest_threads_updated_at() RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_interest_threads_updated_at
    BEFORE UPDATE ON interest_threads
    FOR EACH ROW
    EXECUTE FUNCTION update_interest_threads_updated_at();
