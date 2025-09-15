export const create = async(conn, username, hashedPassword) => {
	const result = await conn.queryArray(
		'INSERT INTO accounts(username, password) VALUES($1, $2) RETURNING id;',
		[username, hashedPassword]
	);
	return result.rows[0] ? result.rows[0][0] : undefined;
}

export const get = {

	byId: async(conn, id) => {
		const result = await conn.queryObject(
			'SELECT * FROM accounts WHERE id = $1;',
			[id]
		);
		return result.rows[0] ?? undefined;
	},

	byUsername: async(conn, username) => {
		const result = await conn.queryObject(
			'SELECT * FROM accounts WHERE username = $1;',
			[username]
		);
		return result.rows[0] ?? undefined;
	}

}

export const update = {

	password: async(conn, newPassword, accountId) => {
		await conn.queryArray(
			'UPDATE accounts SET password = $1 WHERE id = $2;',
			[newPassword, accountId]
		);
	},

	username: async(conn, newUsername, accountId) => {
		await conn.queryArray(
			'UPDATE accounts SET username = $1 WHERE id = $2;',
			[newUsername, accountId]
		);
	}

}

export const erase = async(conn, accountId) => {
	await conn.queryArray(
		'DELETE FROM accounts WHERE id = $1;',
		[accountId]
	);
}
