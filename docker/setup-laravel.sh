#!/bin/bash

echo "=== Установка Laravel ==="

# Установка Laravel
echo "Установка Laravel..."
docker-compose exec php composer create-project laravel/laravel .

# Настройка .env
echo "Настройка .env..."
docker-compose exec php cp .env.example .env

# Редактирование .env для подключения к MySQL
docker-compose exec php sh -c "
cat > .env << 'EOL'
APP_NAME=TaskManager
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=taskmanager
DB_USERNAME=taskmanager_user
DB_PASSWORD=secret

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESESSION_DRIVER=file
SESSION_LIFETIME=120
MEMCACHED_HOST=127.0.0.1

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=\"hello@example.com\"
MAIL_FROM_NAME=\"\${APP_NAME}\"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_HOST=
PUSHER_PORT=443
PUSHER_SCHEME=https
PUSHER_APP_CLUSTER=mt1

VITE_PUSHER_APP_KEY=\"\${PUSHER_APP_KEY}\"
VITE_PUSHER_HOST=\"\${PUSHER_HOST}\"
VITE_PUSHER_PORT=\"\${PUSHER_PORT}\"
VITE_PUSHER_SCHEME=\"\${PUSHER_SCHEME}\"
VITE_PUSHER_APP_CLUSTER=\"\${PUSHER_APP_CLUSTER}\"
EOL
"

# Генерация ключа приложения
echo "Генерация APP_KEY..."
docker-compose exec php php artisan key:generate

# Настройка прав доступа
echo "Настройка прав доступа..."
docker-compose exec php sh -c "
chmod -R 775 storage
chmod -R 775 bootstrap/cache
chown -R www-data:www-data storage
chown -R www-data:www-data bootstrap/cache
"

# Запуск миграций
echo "Запуск миграций..."
docker-compose exec php php artisan migrate

# Создание симлинка для storage
echo "Создание симлинка для storage..."
docker-compose exec php php artisan storage:link

echo "Laravel успешно установлен!"
