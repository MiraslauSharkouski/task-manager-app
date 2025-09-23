#!/bin/bash

echo "=== Проверка инфраструктуры Task Manager ==="
echo

echo "1. Статус контейнеров:"
docker-compose ps
echo

echo "2. Проверка портов:"
echo "Nginx (80): $(curl -s -o /dev/null -w '%{http_code}' http://localhost || echo 'unreachable')"
echo "MailHog (8025): $(curl -s -o /dev/null -w '%{http_code}' http://localhost:8025 || echo 'unreachable')"
echo "Node.js (3000): $(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000 2>/dev/null || echo 'unreachable')"
echo

echo "3. Проверка соединений:"
echo "PHP -> MySQL: $(docker-compose exec php php -r "try { new PDO('mysql:host=mysql;dbname=taskmanager', 'taskmanager_user', 'secret'); echo 'OK'; } catch (Exception \$e) { echo 'ERROR'; }" 2>/dev/null)"
echo "PHP -> Nginx: $(docker-compose exec php curl -s -o /dev/null -w '%{http_code}' http://nginx 2>/dev/null || echo 'ERROR')"
echo

echo "4. База данных:"
echo "Database exists: $(docker-compose exec mysql mysql -u taskmanager_user -psecret -e "SHOW DATABASES;" 2>/dev/null | grep -q taskmanager && echo 'YES' || echo 'NO')"

# Делаем скрипт исполняемым
chmod +x check-infrastructure.sh