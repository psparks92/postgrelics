CREATE TABLE warframe.relics (
    relic_id SERIAL PRIMARY KEY,
    tier VARCHAR(12) NOT NULL CHECK (tier IN ('Lith', 'Meso', 'Neo', 'Axi')),
    letter CHAR(1) NOT NULL,
    sequence INTEGER NOT NULL CHECK (sequence > 0),
    rewards JSONB NOT NULL,
    name VARCHAR(10) GENERATED ALWAYS AS (tier || ' ' || letter || sequence) STORED
);

-- Optional GIN index for JSONB queries
CREATE INDEX idx_relics_rewards ON warframe.relics USING GIN (rewards);