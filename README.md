# Task Manager Application

## Описание

REST API приложение с авторизацией и CRUD для задач, с React SPA фронтендом.

## Структура проекта

- `backend/` - Laravel приложение
- `frontend/` - React SPA
- `docker/` - Docker конфигурации

## Запуск приложения

### Запуск через Docker

```bash
# Запуск всех сервисов
cd docker
docker-compose up -d

# Проверка статуса контейнеров
docker-compose ps

# Остановка всех сервисов
docker-compose down
```
