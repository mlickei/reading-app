ALTER TABLE app_user ADD COLUMN userType VARCHAR(255) NOT NULL, ADD COLUMN joinDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
UPDATE app_user SET joinDate = CURRENT_TIMESTAMP;
UPDATE app_user SET userType = 'BASIC_USER';