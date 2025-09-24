#!/bin/bash

echo "=== Running Integration Tests ==="

# Запускаем integration тесты
npm run test:integration -- --watchAll=false --passWithNoTests

# Проверяем покрытие кода для integration тестов
echo "Checking Integration Test Coverage..."
npm run test:coverage:integration

echo "=== Integration Tests Completed ==="
