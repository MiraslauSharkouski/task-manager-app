#!/bin/bash

echo "=== Тестирование Laravel Sanctum ==="

echo "1. Регистрация пользователя..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost/api/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }')

echo "Ответ регистрации:"
echo $REGISTER_RESPONSE | jq .

# Извлекаем токен из ответа
TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.access_token')

echo "2. Вход пользователя..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost/api/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

echo "Ответ входа:"
echo $LOGIN_RESPONSE | jq .

# Извлекаем токен из ответа входа
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')

echo "3. Получение данных пользователя с токеном..."
USER_RESPONSE=$(curl -s -X GET http://localhost/api/user \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json")

echo "Ответ получения пользователя:"
echo $USER_RESPONSE | jq .

echo "4. Выход пользователя..."
LOGOUT_RESPONSE=$(curl -s -X POST http://localhost/api/logout \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json")

echo "Ответ выхода:"
echo $LOGOUT_RESPONSE | jq .

echo "Тестирование Sanctum завершено!"
