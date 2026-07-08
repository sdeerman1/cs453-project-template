import express from "express";
import { env } from "./config/env";
import { pool } from "./db/pool";

const app = express();

app.use(express.json());

// Starter data. This data is stored in memory and will reset when the
  // server restarts.
  let nextId = 3;
  const tasks = [
    { id: 1, title: "Clone repository", status: "todo" },
    { id: 2, title: "Create task API", status: "todo" }
  ];

app.get("/health", (_req, res) => {
	res.json({
		status: "ok",
		service: "cs453-api",
	});
});

app.get("/db-health", async (_req, res) => {
	try {
		const result = await pool.query("SELECT NOW() AS current_time");
		res.json({
			status: "ok",
			database: "connected",
			currentTime: result.rows[0].current_time,
		});
	} catch (error) {
		console.error("Database health check failed:", error);
		res.status(500).json({
			status: "error",
			database: "disconnected",
		});
	}
});

app.get("/tasks", async (_req, res) => {
	try {
		const result = await pool.query(
			`SELECT id,
                    title,
                    description,
                    status,
                    created_at AS "createdAt",
                    updated_at AS "updatedAt"
             FROM tasks
             ORDER BY id `,
		);

		res.json(result.rows);
	} catch (error) {
		console.error("Failed to fetch tasks:", error);
		res.status(500).json({
			status: "error",
			message: "Failed to fetch tasks",
		});
	}
});

app.get("/tasks", (req, res) => {
    res.json(tasks);
});

app.get("/tasks/:id", (req, res) => {
	const requestedID = Number(req.params.id);
    const requestedItem = tasks.find(task => task.id === requestedID);
    if (requestedItem) {
      res.json(requestedItem);
    }
    else {
      res.status(404).json({ error: "Item not found."})
    }
});

app.post("/tasks", (req, res) => {
    const itemTitle = req.body.title;
    const itemStatus = req.body.status;
    if ( itemTitle.trim().length > 0 ) {
      const newTask = { id: nextId, title: itemTitle, status: itemStatus };
      tasks.push(newTask);
      nextId = nextId + 1;
      res.status(201).json(newTask);
    }
    else {
      res.status(400).json({ error: "Invalid or missing data." });
    }
});

app.patch("/tasks/:id", (req, res) => {
    const requestedID = Number(req.params.id);
    const requestedTask = tasks.find(task => task.id == requestedID);
    if (requestedTask) {
      const itemTitle = req.body.name;
      const itemStatus = req.body.quantity;
      if (itemTitle.trim().length > 0 ) {
        requestedTask.title = itemTitle;
        requestedTask.status = itemStatus;
        res.json(requestedTask);
      }
      else {
        res.status(400).json({ error: "Invalid or missing data." });
      }
    }
    else {
      res.status(404).json({ error: "Item not found."})
    }
});

app.delete("/tasks/:id", (req, res) => {
    const requestedID = Number(req.params.id);
    const requestedTask = tasks.find(task => task.id == requestedID);
    if (requestedTask) {
      const index = tasks.indexOf(requestedTask);
      if (index > -1) {
        tasks.splice(index, 1);
      }
      res.status(204).json({});
    }
    else {
      res.status(404).json({ error: "Item not found."})
    }
});


app.listen(env.port, () => {
	console.log(`Server running at http://localhost:${env.port}`);
});
