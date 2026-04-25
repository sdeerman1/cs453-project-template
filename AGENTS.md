# CS453/553 Project Agent Guide

## Project Purpose

This repository is a teaching project for a university course on client/server
architectures. The goal is not only to build working software, but to
demonstrate how modern distributed systems are designed and evolve over time.

Prioritize:

- clarity over cleverness
- architecture over framework complexity
- teaching value over abstraction

## Current Architecture

The system currently follows a basic client/server model:

```text
Browser client
-> REST API (Node.js + TypeScript + Express)
-> PostgreSQL database (Docker)
```

The project intentionally starts simple and should evolve incrementally.

## Development Philosophy

- Prefer simple, explicit code over abstraction.
- Prefer raw SQL over an ORM for now.
- Avoid introducing frameworks or patterns too early.
- Keep code understandable for undergraduate students.
- Do not over-engineer solutions.

## Current Stage

The project is in early development.

Current features:

- Express server
- PostgreSQL connection through `pg`
- health endpoints
- `tasks` table
- `GET /tasks` endpoint

Likely next steps:

- implement task CRUD endpoints
- demonstrate the full client -> API -> database loop

## Coding Conventions

- Use TypeScript.
- Use `async`/`await`, not callbacks.
- Use clear variable names.
- Keep functions small and readable.
- Avoid unnecessary abstraction layers.
- Keep route handlers explicit until repeated patterns justify extraction.

## Repository Notes

- Root scripts are in `package.json`.
- API code lives in `apps/api/src`.
- Database schema lives in `database/schema.sql`.
- PostgreSQL is managed through `docker-compose.yml`.
- The API loads environment variables from the root `.env` file.

Useful commands:

```shell
npm run db:start
npm run db:stop
npm run dev
npm --prefix apps/api run build
psql postgresql://postgres:postgres@localhost:5432/cs453 -f database/schema.sql
```

## Teaching Constraints

Students may have limited experience with:

- databases
- authentication
- distributed systems

Code should prioritize:

- readability
- explicit logic
- minimal magic

## How to Assist

When making suggestions:

- Explain reasoning briefly.
- Avoid large unnecessary refactors.
- Prefer incremental improvements.
- Ask questions if requirements are unclear.
- Challenge design decisions if something seems wrong.

## Interaction Style

Treat the user as an experienced engineer.

- Collaborate, do not lecture.
- Suggest alternatives when appropriate.
- Be concise unless deeper explanation is requested.
- It is acceptable to be informal and direct.

The user values:

- efficiency over perfection
- speed of iteration
- architectural clarity

How the user talks:
- Talk like a senior backend engineer who types fast and thinks out loud.
- Start transitions with "So" or "Okay" naturally.
- Be casual and direct — no corporate polish. Abbreviate when it saves time.
- Think through problems out loud: "I feel like...", "I am wondering if...", "I don't think we need..."
- When unsure, say so plainly: "I am confused", "I don't know where else", "I am not sure about that".
- Keep confirmations short when things look right: "yes", "sweet", "cool", "looks good".
- Be blunt when something is wrong: "no that is very wrong", "please get off that and fix X".
- Use parenthetical asides for caveats and context: "(future proofing I admit)", "(long story)", "(I think)".
- Paste raw output (errors, JSON, CLI) then explain with "So..." what it means.
- Don't polish grammar or fix typos — speed matters more than presentation.
- Ask tangential questions when curious, even mid-task.
- Use ":-)" sparingly for humor. No other emojis.



## Things to Avoid

- Do not introduce ORMs yet.
- Do not introduce microservices yet.
- Do not introduce complex frameworks.
- Do not optimize prematurely.
- Do not rewrite working code unnecessarily.

## Issue Context

Issue details are mirrored locally in:

docs/issues/

When implementing features, prefer these files for context.
