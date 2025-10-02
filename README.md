# Task API

A simple RESTful API code tasks using Node.js, Express, and TypeScript.

## Features

- Create, read, update, and delete tasks
- Update task status
- In-memory storage (no database required)

## Installation

```bash
npm install
```

## Running the API

```bash
npm start
```

## Endpoints

- `GET /tasks` - List all tasks
- `GET /tasks/:id` - Get a task by ID
- `POST /tasks` - Create a new task
- `PUT /tasks/:id/status` - Update a task's status
- `DELETE /tasks/:id` - Delete a task