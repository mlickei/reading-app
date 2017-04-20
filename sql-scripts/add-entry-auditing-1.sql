ALTER TABLE reading_entry ADD COLUMN createdOn TIMESTAMP NOT NULL DEFAULT NOW(), ADD COLUMN lastModified TIMESTAMP;
UPDATE reading_entry SET createdOn = NOW(), lastModified = NOW();