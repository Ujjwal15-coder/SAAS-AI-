import {neon} from '@neondatabase/serverless'

 const sql = neon(`${process.env.DATABASE_URL}`); // Initialize the Neon database connection using the connection string from environment variables

 export default sql; // Export the sql instance for use in other parts of the application
 //to read and write from the database