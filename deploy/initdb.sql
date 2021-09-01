CREATE USER 'scisense'@'%' IDENTIFIED BY 'scisense';
CREATE DATABASE scisense_data;
GRANT ALL PRIVILEGES ON scisense_data.* TO 'scisense'@'%';
FLUSH PRIVILEGES;
