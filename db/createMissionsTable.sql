
CREATE TABLE warframe.missions (
    mission_id SERIAL PRIMARY KEY,
    planet VARCHAR(50) NOT NULL,
    node VARCHAR(50) NOT NULL,
    mission_type VARCHAR(50) NOT NULL,
    rotations JSONB NOT NULL,
    mission_name VARCHAR(150) GENERATED ALWAYS AS (
        planet || ': ' || node || ' (' || mission_type || ')'
    ) STORED
);

CREATE INDEX idx_missions_rotations ON warframe.missions USING GIN (rotations);