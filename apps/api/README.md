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
The server does this automatically through the function ```initializeDatabase()```. There are no special steps for the user to take.  

## How to start the server  
```bash
npm run dev
```
The server runs on ```http://localhost:3000```.   

## How to run tests  
In a different terminal also pointing to ```cs453-project-template/apps/api```
```bash
npm test
```

## What routes your API supports  

| Method | Route | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/db-health` | Check database connection status |
| GET | `/tasks` | Return all tasks |
| GET | `/tasks/:id` | Return an existing task |
| POST | `/tasks` | Create a new task |
| PATCH | `/tasks/:id` | Update an existing task  |
| DELETE | `/tasks/:id` | Delete an existing task  |

## Example curl commands  
GET /health:  
```bash
curl http://localhost:3000/health
```
Output:  
```{"status":"ok", "service":"cs453-api"}```
<br><br><br>
GET /db-health:  
```bash
curl http://localhost:3000/db-health
```
Output:  
```{"status":"ok","database":"connected","currentTime":"2026-07-14T23:21:33.897Z"}```
<br><br><br>
POST /tasks:  
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Complete lab 03", "description": "Rest API", "status": "todo"}'
```
Output:  
```{"task":{"id":1,"title":"Complete lab 03","description1":"Rest API","status1":"todo","created_at":"2026-07-14T23:54:22.215Z","updated_at":"2026-07-14T23:54:22.215Z"}}```
<br><br><br>
GET /tasks:  
```bash
curl http://localhost:3000/tasks
```
Output:  
```[{"id":1,"title":"Complete lab 03","description1":"Rest API","status1":"todo","created_at":"2026-07-14T23:54:22.215Z","updated_at":"2026-07-14T23:54:22.215Z"}]```
<br><br><br>
GET /tasks/:id:  
```bash
curl http://localhost:3000/tasks/1
```
Output:  
```[{"id":1,"title":"Complete lab 03","description1":"Rest API","status1":"todo","createdAt":"2026-07-14T23:54:22.215Z","updatedAt":"2026-07-14T23:54:22.215Z"}]```
<br><br><br>
PATCH /tasks/:id:  
```bash
curl -X PATCH http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Final exam"}'
```
Output:  
```{"task":{"id":1,"title":"Final exam","description1":"Rest API","status1":"todo","created_at":"2026-07-14T23:54:22.215Z","updated_at":"2026-07-15T00:02:48.932Z"}}```
<br><br><br>
PATCH /tasks/:id:  
```bash
curl -X PATCH http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"description": "Cumulative final exam"}'
```
Output:  
```{"task":{"id":1,"title":"Final exam","description1":"Cumulative final exam","status1":"todo","created_at":"2026-07-14T23:54:22.215Z","updated_at":"2026-07-15T00:03:13.758Z"}}```
<br><br><br>
PATCH /tasks/:id:  
```bash
curl -X PATCH http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```
Output: 
```{"task":{"id":1,"title":"Final exam","description1":"Cumulative final exam","status1":"completed","created_at":"2026-07-14T23:54:22.215Z","updated_at":"2026-07-15T00:03:37.967Z"}}```
<br><br><br>
DELETE /tasks/:id:  
```bash
curl -X DELETE http://localhost:3000/tasks/1
```
GET /tasks:
```bash
curl http://localhost:3000/tasks
```
Output:  
```[]```  

## Reflection Questions

**1. What is the difference between an in-memory API and a database-backed API?**  
A database-backed API is persistent. When the server session is concluded, the state of the data is saved in the database so that if another server session is started, a user can continue to work on the data. An in-memory API will reset each time the program is run, meaning it is not persistent. 
Real-world applications will always be database-backed, as there is no point in making changes if they are not integrated to become part of the system. It is also crucial to have a database in the case of a crash or other server fail. Whatever work the user completed before the crash will be saved 
in the database and the state can be restored upon server restart.  

**2. Why is it useful to separate routes, services, and database logic?**  
This aligns with the computer science principle the Separation of Concerns. Separating each segment of the application is best practice as it makes future updates and changes much easier to make. Software Engineering is a cyclical process, and the lifecycle does not stop after the first release. 
Applications are constantly being changed or updated and separating the logic allows for much easier maintenance. It also makes the application more scalable, and allows for easier testing as well.  

**3. What HTTP status codes did you use, and why?**  
200: OK  
201: Item created  
204: Successful deletion  
400: Bad Request (information they entered was incorrect)  
404: Not found (the request they entered was not a valid route)  
500: Database connection failed  
These are standard HTTP status codes that are universally understood to mean what I used them for. I used 200 for GET /tasks, GET /tasks/:id, and PATCH /tasks/:id.  
I used 201 for POST /tasks.  
I used 204 for DELETE /tasks/:id.  
I used 400 for POST and PATCH requests if the data the user entered was insufficient.  
I used 404 for if the ID that was entered was an invalid ID or if the route was incorrect.  
I used 500 for any request that the database failed for.  

**4. What happens when a client requests a task ID that does not exist?**  
The client will send a fetch GET/http://localhost:3000/api/tasks/id. This tells the server to run the get() function. Using id = what the user input, the server runs an SQL query "SELECT * FROM tasks WHERE id = $1", [requestedID] which means we will select all columns from the tasks table where the ID matches
the one the user entered. We then return the row[s] that correspond with the requested ID. If the ID does not exist, the function will return 0 rows. The client will try to display the rows, but there will be nothing to display. The client then, correctly, displays nothing for a task ID that does not exist. 
CHECK AND SEE WHAT HAPPENS, WHAT CODE IS RETURNED, ETC.  

**5. What was the hardest part of connecting the API to PostgreSQL?**  
I ran into an issue with the keywords "description" and "status" in schema.sql. They were showing up as red text in my IDE, and I thought SQL was reading them in as special keywords. I changed them to "description1" and "status1", but ended up changing them back once I realized they were being read correctly. 

## Notes  
I did not end up moving my logic out of the main server file. I was already having some issues with the file structure, and I did not feel I had the time or resources to complete this successfully. If we have an example of separation of concerns in class that shows what logic should go where, I will feel confident enough to separate my server.ts file for the subsequent checkpoints. For now, all the server logic is in ```cs453-project-template/apps/api/src/server.ts```.   
