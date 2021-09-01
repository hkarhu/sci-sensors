
# ACQUIRE CODE
cd /opt/
git clone "https://github.com/irah-000/sci-sensors"
cd sci-sensors

# DEVELOP APPLICATION LOCALLY
cd deploy
docker-compose -f db.compose.yml -f backend-devel.compose.yml build --no-cache
docker-compose -f db.compose.yml -f backend-devel.compose.yml up

# DEPLOY APPLICATION
cd deploy
docker-compose -f db.compose.yml -f backend.compose.yml build --no-cache
docker-compose -f db.compose.yml -f backend.compose.yml up -d
