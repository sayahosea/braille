import { Client } from 'jsr:@db/postgres';

import * as Account from '../database/Account.js';
import * as Session from '../database/Session.js';
import * as Progress from '../database/Progress.js';

let client;

export const init = async() => {
	client = new Client({
		user: Deno.env.get('DB_USER'),
		password: Deno.env.get('DB_PASSWORD'),
		database: Deno.env.get('DB_DATABASE'),
		hostname: Deno.env.get('DB_HOSTNAME'),
		port: Deno.env.get('DB_PORT'),
		tls: {
			enabled: false
		}
	});

	await client.connect();
	console.log('Connecting to database...');

	await createTables(client);

	Deno.addSignalListener('SIGINT', async() => {
		await client.end();
		console.log('Closing database connection...');
		Deno.exit(0);
	});
}

export const get = () => {
	return client;
}

export const account = Account;
export const session = Session;
export const progress = Progress;

async function createTables(client) {
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
}