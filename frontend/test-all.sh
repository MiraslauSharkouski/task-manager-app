#!/bin/bash

echo "=== Running All Tests ==="

# Запускаем unit тесты
echo "Running Unit Tests..."
npm test -- --watchAll=false --passWithNoTests

# Проверяем покрытие кода
echo "Checking Code Coverage..."
npm run test:coverage

# Запускаем linting
echo "Running Linting..."
npm run lint

echo "=== All Tests Completed ==="
