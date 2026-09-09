# High Performance Job Board API
I'm refining my backend and system design skills through building a well-built, high performance, and secure API.

## Table of Contents

- [Technical Choices](#technical-choices)
  - [1. How the Server Starts](#1-how-the-server-starts)
  - [2. Graceful Shutdown](#2-graceful-shutdown)
  - [3. DB Schema Design](#3-db-schema-design)
    - [1. Enum vs Check + Text Type](#1-enum-vs-check--text-type)
    - [2. Using `ON DELETE CASCADE` on `jobs.company_id` and `job_skills`](#2-using-on-delete-cascade-on-jobscompany_id-and-job_skills)
  - [4. Choosing postgres.js and Writing Raw SQL](#4-choosing-postgresjs-and-writing-raw-sql)


## Technical Choices

Here I'll discuss the technical choices I made in this project, some design choices, database design, how I implemented indexes and how I proved their effectiveness, and every important technical decision I made in this project in order for it to be high performance, secure, reliable, and scalable.

N.B. I'm focusing more in this project on performance, security, and reliability. But if I have time, I'll consider scalability.

### 1. How the server starts

* **What I did**: I chose a "Fail-fast" approach, where I first make sure that the database connection is established, then start the server.

* **Justification** is simply that, because of the asynchronous nature of Node.js, the server may start listening on the port and getting requests even before the database connection is established. In production, there might be a delay where the database starts after the server by almost 200-300 ms, which will lead to system failure if it is requested during this time in production.

### 2. Graceful Shutdown

* **What I did**: I handled the two signals "SIGINT" and "SIGTERM" in a function that runs right before the server startup and waits for these signals. When it catches any of them, I close the server and then I close the database connection, and if any of these closing operations fail, it throws an error and closes with 'process.exit(1)'.

* **Justification**: To ensure in-flight requests complete before the database connection closes, preventing dropped queries or dangling connections that could exhaust the connection pool.

### 3. DB Schema Design

* Here there are many decisions that are worth mentioning:

#### 1. Enum Vs Check + text type

* **What I did**: I enforced specific types for columns: jobs.status, jobs.remote_type instead of making them of type text and having a constraint on their values.
* **Justification**: While using a check with text would make it easier if I wanted to change the allowed values, in this case this is not needed, because 'status' and 'remote_type' values will not need to be changed. So this choice is the most suitable for this case.

#### 2. Using `ON DELETE CASCADE` on `jobs.company_id` and `job_skills`

* **Justification**: If a company is deleted, it makes no sense to have its jobs in the jobs table; the same applies to job_id and skill_id in the job_skills table. When a skill or a job is deleted, it makes more sense to delete its rows from job_skills, because they no longer exist.

### 4. Choosing postgres.js and writing raw SQL

* **Justification**: I wanted to have full control of the query. In the benchmarking, I'll be measuring the query time before and after putting the indexes, and I have to know exactly how the query executes to do that. And as I've mentioned earlier, my main focus in this project is to develop my skills and sharpen my backend basics.