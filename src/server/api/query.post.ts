import mysql from "mysql2/promise";
import { performance } from "universal-perf-hooks";

function allowQuery(query: string) {
  if (query === null) throw new Error("query cannot be null");

  const forbiddenStatements = [
    "INSERT",
    "UPDATE",
    "DELETE",
    "RENAME",
    "DROP",
    "CREATE",
    "TRUNCATE",
    "ALTER",
    "COMMIT",
    "ROLLBACK",
    "MERGE",
    "CALL",
    "EXPLAIN",
    "LOCK",
    "GRANT",
    "REVOKE",
    "SAVEPOINT",
    "TRANSACTION",
    "SET",
  ];

  const pattern = new RegExp(forbiddenStatements.join("|"), "i");
  const matches = query.match(pattern);

  if (matches !== null) {
    throw new Error(`Forbidden word '${matches[0]}' found in string`);
  }

  return !pattern.test(query);
}

function checkQuery(query: string) {
  if (!/limit/i.test(query)) return query.replace(/[;]$/, "") + " LIMIT 1000";
  return query;
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const query: string = checkQuery(body.query);

    const config = useRuntimeConfig();

    const connection = mysql.createPool({
      ...config.conn,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    if (allowQuery(query)) {
      const start = performance.now();

      const results = await connection.execute(query);

      const end = performance.now();

      return {
        data: results[0],
        runtime: end - start, // runtime in ms
      };
    }
  } catch (err: any) {
    event.node.res.statusCode = 400;
    return { error: Error(err).message };
  }
});
