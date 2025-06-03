import { get as client } from '../handlers/Database.js';

export const create = async(sessionId, accountId) => {
	const res = await client().queryArray(
		'INSERT INTO sessions(id, account_id) VALUES($1, $2);',
		[sessionId, accountId]
	);
}

export const get = async(sessionId) => {
	const result = await client().queryArray(
		'SELECT account_id FROM sessions WHERE id = $1;',
		[sessionId]
	);
	return result.rows[0] ? result.rows[0][0] : undefined;
}

export const erase = {

	thisDevice: async(sessionId) => {
		await client().queryArray(
			'DELETE FROM sessions WHERE id = $1;',
			[sessionId]
		);
	},

	allDevices: async(accountId, sessionId) => {
		await client().queryArray(
			'DELETE FROM sessions WHERE account_id = $1 AND id != $2',
			[accountId, sessionId]
		);
	}

}
