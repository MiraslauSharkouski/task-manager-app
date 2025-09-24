
echo '=== Настройка тестовой среды ==='

# Установка BCRYPT_ROUNDS для быстрого тестирования
sed -i 's/BCRYPT_ROUNDS=12/BCRYPT_ROUNDS=4/g' .env.testing 2>/dev/null || echo 'BCRYPT_ROUNDS не найден в .env.testing'

# Установка прав на запись для кэша
chmod -R 775 storage
chmod -R 775 bootstrap/cache

# Очистка кэша
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Установка автозагрузки
composer dump-autoload

echo 'Тестовая среда настроена!'
echo 'Для запуска тестов используйте: php artisan test --env=testing'
