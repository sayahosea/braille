import { Pool } from 'jsr:@db/postgres';

import * as Account from '../database/Account.js';
import * as Session from '../database/Session.js';
import * as Progress from '../database/Progress.js';

let pool = new Pool({
	user: Deno.env.get('DB_USER'),
	password: Deno.env.get('DB_PASSWORD'),
	database: Deno.env.get('DB_DATABASE'),
	hostname: Deno.env.get('DB_HOSTNAME'),
	port: Deno.env.get('DB_PORT'),
	tls: { enabled: false }
}, 10);



export const getConn = async() => {
	return await pool.connect();
}

export const init = async() => {
	await createTables();

	Deno.addSignalListener('SIGINT', async() => {
		await pool.end();
		console.log('Closing database connections...');
		Deno.exit(0);
	});
}

export const account = Account;
export const session = Session;
export const progress = Progress;

async function createTables() {
	let client;

	try {
		client = await getConn();

		await client.queryArray(`CREATE TABLE IF NOT EXISTS accounts(
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			username VARCHAR(16) NOT NULL,
			password VARCHAR(128) NOT NULL
		);`);

		await client.queryArray(`CREATE TABLE IF NOT EXISTS sessions(
			id CHAR(64) PRIMARY KEY,
			account_id UUID NOT NULL
		);`);

		await client.queryArray(`CREATE TABLE IF NOT EXISTS progress(
			course_id INTEGER,
			course_type TEXT,
			account_id UUID
		);`);
	} catch(err) {
		if (client) client.release();
	} finally {
		client.release();
	}
}
