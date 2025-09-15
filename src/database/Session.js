export const create = async(conn, sessionId, accountId) => {
	const res = await conn.queryArray(
		'INSERT INTO sessions(id, account_id) VALUES($1, $2);',
		[sessionId, accountId]
	);
}

export const get = async(conn, sessionId) => {
	const result = await conn.queryArray(
		'SELECT account_id FROM sessions WHERE id = $1;',
		[sessionId]
	);
	return result.rows[0] ? result.rows[0][0] : undefined;
}

export const erase = {

	thisDevice: async(conn, sessionId) => {
		await conn.queryArray(
			'DELETE FROM sessions WHERE id = $1;',
			[sessionId]
		);
	},

	allDevices: async(conn, accountId, sessionId) => {
		await conn.queryArray(
			'DELETE FROM sessions WHERE account_id = $1 AND id != $2',
			[accountId, sessionId]
		);
	}

}
