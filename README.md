# Jarvix 

This is a backend task management API built with NestJS, PostgreSQL, and Redis. The app can be started using Docker or run without Docker by setting up the environment manually.

## Table of Contents

- [Getting Started](#getting-started)
  - [Running with Docker](#running-with-docker)
  - [Running without Docker](#running-without-docker)
- [API Usage](#api-usage)
- [Running Tests](#running-tests)

## Getting Started

### Running with Docker

1. **Install Docker**: Ensure that Docker is installed on your system.

2. **Clone the Repository**:
   ```bash
   git clone <repository-url>

3. **Start the Application**
   ```
   docker-compose up --build

4. **Access the Application**
   The NestJS app will be available at http://localhost:3000.

### Running without Docker

1. **Install Dependencies**: Ensure Node.js , PostgreSQL and Redis are installed on your system.

2. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd jarvix-be

3. **Install Node.js Dependencies**
   ```
   npm install

4. **Set Up the Database**

   Create a PostgreSQL database named nestdb.Or put whatever name you like , just make sure you use the correct database connection string later when setting up .env

5. **Set Up the Redis**
  
6. **Set Up the .env**

   Update your .env file with the correct database connection string ,redis host and port.

7. **Prepare the database**
   Generate prisma client and run migration

   ```
   npx prisma generate
   npx prisma migrate deploy

8. **Start the Application**
   ```
   npm run dev
   ```
   The NestJS app will be available at http://localhost:3000.

## API Usage

### Index:
**Endpoint**:  
`GET http://localhost:3000/task`

**Description**:  
This endpoint allows you to retrieve a list of tasks.

### Get:
**Endpoint**:  
`GET http://localhost:3000/task/{id}`

**Description**:  
This endpoint makes an HTTP GET request to retrieve details of a specific task.

### Create:
**Endpoint**:  
`POST http://localhost:3000/task`

**Description**:  
This endpoint allows you to add a new task.

**Request Body**:

`title` (string, required): The title of the task.

`description` (string, required): The description of the task.

`comment` (string, optional): The comment of the task.

### Update:
**Endpoint**:  
`PATCH http://localhost:3000/task/{id}`

**Description**:  
This endpoint allows you to update a specific task 

**Request Body**:

`title` (string, optional): The title of the task.

`description` (string, optional): The description of the task.

`comment` (string, optional): The comment of the task.


### Delete:
**Endpoint**:  
`DEL http://localhost:3000/task/{id}`

**Description**:  
The endpoint allows you to delete a specific task 


## Running tests

Use the command to run unit test
```
npm run test
```
