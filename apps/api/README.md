# Checkpoint 1: Core API Structure

This checkpoint covers:  
Milestone 1 — Basic Task API  
Milestone 2 — Full Task CRUD  
Milestone 3 — Database Integration  

## How to install dependencies  
```bash
cd cs453-project-template/apps/api
npm install
```

## How to configure the database connection  
With docker running on your machine:
```bash
docker-compose up -d
```

## How to create the database tables  
Run the schema file against the local database after PostgreSQL is running:  
```bash
psql postgresql://postgres:postgres@localhost:5432/cs453 -f database/schema.sql
```

## How to start the server  
```bash
npm run dev
```
The server runs on 

## How to run tests  
```bash
npm test ?????
```

## What routes your API supports  
GET /health: Check server status  
GET /db-health: Check database connection status  
GET /tasks: Return all tasks  
GET /tasks/:id: Return an existing task  
POST /tasks: Create a new task  
PATCH /tasks/:id: update an existing task  
DELETE /tasks/:id: Delete an existing task  

## Example curl commands  
GET /health:  
```bash
curl http://localhost:3000/health
```
Output:  
```{"status":"ok"}```
<br><br><br>
GET /db-health:  
```bash
curl http://localhost:3000/db-health
```
Output:  
```{???}```
<br><br><br>
POST /tasks:  
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Complete lab 03", "description": "Rest API", "status": "todo"}'
```
Output:  
```{"id":2,"title":"Complete lab 03","description":"Rest API","status":"todo"}```
<br><br><br>
GET /tasks:  
```bash
curl http://localhost:3000/tasks
```
Output:  
```{"id":2,"title":"Complete lab 03","description":"Rest API","status":"todo"}```
<br><br><br>
GET /tasks/:id:  
```bash
curl http://localhost:3000/tasks/2
```
Output:  
```{"id":2,"title":"Complete lab 03","description":"Rest API","status":"todo"}```
<br><br><br>
PATCH /tasks/:id:  
```bash
curl -X PATCH http://localhost:3000/tasks/2 \
  -H "Content-Type: application/json" \
  -d '{"title": "Final exam"}'
```
Output:  
```{"id":2,"title":"Final exam","description":"Rest API","status":"todo"}```
<br><br><br>
PATCH /tasks/:id:  
```bash
curl -X PATCH http://localhost:3000/tasks/2 \
  -H "Content-Type: application/json" \
  -d '{"description": "Cumulative final exam"}'
```
Output:  
```{"id":2,"title":"Final exam","description":"Cumulative final exam","status":"todo"}```
<br><br><br>
PATCH /tasks/:id:  
```bash
curl -X PATCH http://localhost:3000/tasks/2 \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```
Output: 
```{"id":2,"title":"Final exam","description":"Cumulative final exam","status":"completed"}```
<br><br><br>
PATCH /tasks/:id:  
```bash
curl -X PATCH http://localhost:3000/tasks/2 \
  -H "Content-Type: application/json" \
  -d '{"title": "Midterm", "description": "Midterm exam covering modules 1-3"}'
```
Output:  
```{"id":2,"title":"Midterm","description":"Midterm exam covering modules 1-3","status":"completed"}```
<br><br><br>
DELETE /tasks/:id:  
```bash
curl -X DELETE http://localhost:3000/tasks/2
```

## Reflection Questions

**1. What is the difference between an in-memory API and a database-backed API?**  
A database-backed API is persistent. When the server session is concluded, the state of the data is saved in the database so that if another server session is started, a user can continue to work on the data. An in-memory API will reset each time the program is run, meaning it is not persistent. 
Real-world applications will always be database-backed, as there is no point in making changes if they are not integrated to become part of the system. It is also crucial to have a database in the case of a crash or other server fail. Whatever work the user completed before the crash will be saved 
in the database and the state can be restored upon server restart.  

**2. Why is it useful to separate routes, services, and database logic?**  
This aligns with the computer science principle the Separation of Concerns. Separating each segment of the application is best practice as it makes future updates and changes much easier to make. Software Engineering is a cyclical process, and the lifecycle does not stop after the first release. 
Applications are constantly being changed or updated and separating the logic allows for much easier maintenance. It also makes the application more scalable, and allows for easier testing as well.  

**3. What HTTP status codes did you use, and why?**  
200:  
201: Item created  
204: Successful deletion  
400: Bad Request (information they entered was incorrect)  
404: Not found (the request they entered was not a valid route)  
500: database connection failed  

**4. What happens when a client requests a task ID that does not exist?**  
The client will send a fetch GET/http://localhost:3000/api/tasks/id. This tells the server to run the get() function. Usint id = what the user input, the server runs an SQL query "SELECT * FROM tasks WHERE id = $1", [requestedID] which means we will select all columns from the tasks table where the ID matches
the one the user entered. We then return the row[s] that correspond with the requested ID. If the ID does not exist, the function will return 0 rows. The client will try to display the rows, but there will be nothing to display. The client then, correctly, displays nothing for a task ID that does not exist. 
CHECK AND SEE WHAT HAPPENS, WHAT CODE IS RETURNED, ETC.  

**5. What was the hardest part of connecting the API to PostgreSQL?**  
