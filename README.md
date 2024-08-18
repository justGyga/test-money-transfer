# About project
This system is implemented as a money transfer service.
## The following entities exist in the system:
- Transaction:
    - id UUID
    - from UUID
    - to UUID
    - amount FLOAT
    - createdAt DATE
- User:
    - id UUID
    - login STRING
    - password STRING
    - balance FLOAT
    - currencyId STRING
    - createdAt DATE
    - telegramId INTEGER
    - telegramName STRING
- Currency:
    - code STRING
    - name STRING

## Already was realized this modules:
- [x] Seeders:
    - [x] User creating seed
    - [x] Feel currencies table seed
- [x] Currency:
    - [x] Convert money from one to another currency
    - [x] Get rates
- [x] User:
    - [x] Sign in\up service
    - [x] Attach telegram bot to account
    - [x] Get users list with pagination and filtered by currencies
    - [x] Get user self info
    - [x] Get user info by id
- [x] Transaction:
    - [x] Create transaction
    - [x] Get transactions list with pagination
- [x] Telegram bot:
    - [x] Start command
    - [x] Get rates
    - [x] Send transaction aggregation for hour
- [ ] Tests
Unfortunately I was not able to implement the testing due to my inexperience.

# Commands
## Start
- `npm start`: run server at docker
- `npm run local`: run server for develop

## Migrations
- `npm run migrate:create <YOUR_MIGRATION_NAME>`: create migration
- `npm run migrate:up`: up migration
- `npm run migrate:undo`: undo migration

## Seeds
- `npm run seed:create <YOUR_SEED_NAME>`: create seed
- `npm run seed:up`: up all seeds
- `npm run seed:undo`: undo recent seed
- `npm run seed:undo:all`: undo all seeds

## Other
- `npm run lint`: lint all project
- `docker-compose up --build`: Build docker containers