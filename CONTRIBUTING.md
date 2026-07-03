# Contributing to Audiora

Thanks for taking the time to contribute. This document covers how to set up
the project locally, the conventions the codebase follows, and how to submit
changes.

## Table of Contents

- [Getting set up](#getting-set-up)
- [Project conventions](#project-conventions)
- [Making a change](#making-a-change)
- [Commit messages](#commit-messages)
- [Submitting a pull request](#submitting-a-pull-request)
- [Reporting bugs](#reporting-bugs)
- [Suggesting features](#suggesting-features)

## Getting set up

1. Fork the repository and clone your fork:
   ```bash
   git clone https://github.com/nitin864/Audiora
   cd Audiora
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the project root (see [`README.md`](README.md#installation)
   for the required variables — you'll need a MongoDB URI, a JWT secret, and
   an ImageKit private key).
4. Start the dev server:
   ```bash
   npm run dev
   ```
   This runs on nodemon, so it restarts automatically as you edit files.

There's no seed script yet — register a user through `POST /api/auth/register`
(set `"role": "artist"` in the body if you need to test uploads) to get
started.

## Project conventions

The codebase is intentionally small and flat. When adding to it, follow the
existing layering rather than introducing a new pattern:

- **Routes** (`src/routes/`) only wire a path + HTTP verb to middleware and a
  controller function. No business logic here.
- **Middleware** (`src/middlewares/`) handles cross-cutting concerns —
  currently just JWT verification and role checks. `authUser` allows any
  logged-in account; `authTokenArtistCheck` restricts to `role: "artist"`.
- **Controllers** (`src/controllers/`) contain the actual logic: reading
  `req.body` / `req.files`, talking to Mongoose models, calling
  `storage.service.js` for file uploads, and shaping the JSON response.
  Controllers are the only layer that should import a model directly.
- **Models** (`src/models/`) are plain Mongoose schemas. Keep validation
  (`required`, `enum`, etc.) in the schema rather than re-checking it in the
  controller.
- **Services** (`src/services/`) wrap third-party integrations behind a small
  function surface — see `filesUpload(buffer, { fileName, folder })` in
  `storage.service.js`. If you add another external dependency (email,
  payments, etc.), follow the same pattern rather than calling the SDK
  directly from a controller.

Other things to keep in mind:

- Every route that reads or writes user data should go through one of the
  two auth middlewares — don't roll a one-off `jwt.verify` call inside a
  controller.
- Multipart uploads use `multer`'s memory storage (`multer.memoryStorage()`),
  so files arrive as in-memory buffers (`req.file` / `req.files`), never
  written to disk. Keep it that way — don't add `diskStorage` for one route
  and memory storage for another.
- There's no linter or formatter configured yet. Match the existing style in
  the file you're editing (spacing, quote style, etc.) rather than
  reformatting unrelated code in the same PR.
- There's no test suite yet either. If you're fixing a bug, a small
  reproduction in the PR description (a `curl` command or Postman
  screenshot) is very helpful in place of an automated test. PRs that add a
  test setup (Jest, Supertest, etc.) are welcome.

## Making a change

1. Create a branch off `main`:
   ```bash
   git checkout -b fix/short-description
   ```
   Prefix with `fix/`, `feat/`, `docs/`, or `chore/` depending on the change.
2. Make your change, following the conventions above.
3. Test it manually against a running instance (Postman, `curl`, or the
   frontend if you have it running) — include what you tested in the PR
   description.
4. Update `README.md` if you changed a route's request/response shape, added
   an environment variable, or changed setup steps.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/) style:

```
<type>(<scope>): <short summary>

<optional body explaining why, not just what>
```

Examples:

```
fix(album): normalize musics field to avoid CastError on create
feat(music): support optional thumbnail upload for tracks
docs(readme): add sequence diagrams for auth and upload flows
```

Common types: `feat`, `fix`, `docs`, `refactor`, `chore`.

## Submitting a pull request

- Keep PRs focused on one change — separate unrelated fixes into separate
  PRs so they're easy to review and revert independently.
- Describe what changed and why in the PR description, not just what files
  were touched.
- Link any related issue with `Closes #<issue-number>`.
- Be responsive to review feedback; small follow-up commits are fine, no
  need to force-push and rewrite history mid-review unless asked.

## Reporting bugs

Open an issue with:

- The endpoint and request you made (method, path, body/headers — redact
  real credentials).
- What you expected to happen vs. what actually happened.
- The full error message or stack trace, if there was one.
- Your Node.js version and OS.

## Suggesting features

Open an issue describing the use case first, before writing code — for a
project this size it's easy to align on approach in a short discussion
rather than in a large PR diff.
