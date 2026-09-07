- Don't use try/catch if you'll just throw the error, it's useless then
- Here:

```javascript

const establishDBConn = async (sql: Sql) => {
  const conn = await sql`Select 1`;
  return conn ? conn : new Error("Database Connection Issue");
}

```

The pattern of returning sth in a function, that can be either undefined/error object or true and then handelling its cases when the func called is not the best, instead, throw error in the case of faliure to stop the system in this case.

The correct one:

```javascript

const establishDBConn = async (sql: Sql) => {
  try {
    const conn = await sql`Select 1`;
    console.log("DB connection established correctly");
  } catch(error) {
    throw new Error("Database Connection Issue: " + error.message);
  }
}

```

- Do not throw error while stopping the server because nothing will handle it because it's already closing! Instead, print the error and exit.

Wrong code:

```javascript
const shutdown = async (server: Server, sql: Sql, signal: string) => {
    console.log(`${signal} signal received: closing HTTP server...`);
    server.close(async () => {
      console.log("HTTP Server is closed");
      try {
        console.log("Closing SQL connection...");
        await sql.end();
        console.log("Database connections closed successfully.");

        process.exit(0);
      } catch (error) {
        throw new Error("Issue while closing the server: " + (error as Error).message)
      }
    });
}
```

Correct code:

```javascript
const shutdown = async (server: Server, sql: Sql, signal: string) => {
    console.log(`${signal} signal received: closing HTTP server...`);
    server.close(async () => {
      console.log("HTTP Server is closed");
      try {
        console.log("Closing SQL connection...");
        await sql.end();
        console.log("Database connections closed successfully.");

        process.exit(0);
      } catch (error) {
        console.error("Issue while closing the database: ", error);
        process.exit(1);      
      }
    });
}
```
