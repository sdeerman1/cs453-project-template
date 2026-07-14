import express from "express";
import { env } from "./config/env";
import { pool } from "./db/pool";
import * as fs from 'fs';
import * as path from 'path';

const app = express();

app.use(express.json());

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

		res.status(200).json(result.rows);
	} catch (error) {
		console.error("Failed to fetch tasks:", error);
		res.status(500).json({
			status: "error",
			message: "Failed to fetch tasks",
		});
	}
});

app.get("/tasks/:id", async (_req, res) => {
  const requestedID = Number(_req.params.id);
	try {
		const result = await pool.query(
			`SELECT id,
              title,
              description,
              status,
              created_at AS "createdAt",
              updated_at AS "updatedAt"
        FROM tasks
        WHERE id = $1`,
        [requestedID]
		);

		res.status(200).json( result.rows );
	} catch (error) {
		console.error("Failed to fetch tasks:", error);
		res.status(500).json({
			status: "error",
			message: "Failed to fetch tasks",
		});
	}
});

app.post("/tasks", async (_req, res) => {
  const title = _req.body?.title?.trim();
  const description = _req.body?.description?.trim();
  const status = _req.body?.status?.trim();
  // FIXME: do something for timestamp
  const created_at = _req.body?.created_at?.trim();
  const updated_at = _req.body?.updated_at?.trim();

  if (!title || !status) {
    return res.status(400).json({
      error: "Bad Request",
      message: "A title and status are required."
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO tasks (title, description, status)
      VALUES ($1, $2, $3)
      RETURNING id, title, description, status, created_at, updated_at`,
      [title, description, status]
    )
    res.status(201).json({ task: result.rows[0] });
  } catch (error) {
    console.error("Failed to add item: ", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to add item."
    });
  }
});

app.patch("/tasks/:id", async (_req, res) => {
  const requestedID = Number(_req.params.id);

  if ("title" in _req.body) {
    const title = _req.body?.title?.trim();
    if (!title) {
      return res.status(400).json({
        error: "Bad Request",
        message: "A title is required."
      });
    }
    try {
      const result = await pool.query(
        `UPDATE tasks
        SET title = $1
        WHERE id = $2`,
        [title, requestedID]
      );

      res.status(200).json({ tasks: result.rows });
    } catch (error) {
      console.error("Failed to load items:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to load items."
      });
    }
  }

  if ("description" in _req.body) {
    const description = _req.body?.description?.trim();
    if (!description) {
      return res.status(400).json({
        error: "Bad Request",
        message: "A description is required."
      });
    }
    try {
      const result = await pool.query(
        `UPDATE tasks
        SET description = $1
        WHERE id = $2`,
        [description, requestedID]
      );

      res.status(200).json({ tasks: result.rows });
    } catch (error) {
      console.error("Failed to load items:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to load items."
      });
    }
  }

  if ("status" in _req.body) {
    const status = _req.body?.status?.trim();
    if (!status) {
      return res.status(400).json({
        error: "Bad Request",
        message: "A status is required."
      });
    }
    try {
      const result = await pool.query(
        `UPDATE tasks
        SET status = $1
        WHERE id = $2`,
        [status, requestedID]
      );

      res.status(200).json({ tasks: result.rows });
    } catch (error) {
      console.error("Failed to load items:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to load items."
      });
    }
  }

  // TODO: update updated time here
});

app.delete("/tasks/:id", async (_req, res) => {
  const requestedID = Number(_req.params.id);
  try {
    const result = await pool.query(
      `DELETE FROM tasks
      WHERE id = $1`,
      [requestedID]
    );

    res.status(204).json({ status: "Successfully deleted" });
  } catch (error) {
    console.error("Failed to load items:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to load items."
    });
  }
});

app.use((_req, res) => {
  res.status(404).json({ error: "Not found." });
});

async function initializeDatabase() {
  try {
    const filePath = path.join("../../database", 'schema.sql');
    const sql = fs.readFileSync(filePath, 'utf8');
    await pool.query(sql);
  } catch (error) {
    console.error("Error initializing database: ", error);
  }
}

initializeDatabase()
  .then(() => {
    app.listen(env.port, () => {
	    console.log(`Server running at http://localhost:${env.port}`);
    });
  })
  .catch((error) => {
    console.error("Server startup failed: ", error);
    process.exit(1);
  });

