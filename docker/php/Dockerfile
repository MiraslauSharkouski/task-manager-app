FROM php:8.2-fpm

# Установка зависимостей системы
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    mariadb-client \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Установка Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Установка Node.js (для Laravel Mix если понадобится)
RUN curl -sL https://deb.nodesource.com/setup_22.x | bash -
RUN apt-get install -y nodejs

# Создание рабочей директории
WORKDIR /var/www/backend

# Создание пользователя www-data
RUN chown -R www-data:www-data /var/www/backend

# Переключение на пользователя www-data
USER www-data

# Экспорт порта
EXPOSE 9000