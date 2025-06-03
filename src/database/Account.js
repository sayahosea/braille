import { get as client } from '../handlers/Database.js';

export const create = async(username, hashedPassword) => {
	const result = await client().queryArray(
		'INSERT INTO accounts(username, password) VALUES($1, $2) RETURNING id;',
		[username, hashedPassword]
	);
	return result.rows[0] ? result.rows[0][0] : undefined;
}

export const get = {

	byId: async(id) => {
		const result = await client().queryObject(
			'SELECT * FROM accounts WHERE id = $1;',
			[id]
		);
		return result.rows[0] ?? undefined;
	},

	byUsername: async(username) => {
		const result = await client().queryObject(
			'SELECT * FROM accounts WHERE username = $1;',
			[username]
		);
		return result.rows[0] ?? undefined;
	}

}

export const update = {

	password: async(newPassword, accountId) => {
		await client().queryArray(
			'UPDATE accounts SET password = $1 WHERE id = $2;',
			[newPassword, accountId]
		);
	},

	username: async(newUsername, accountId) => {
		await client().queryArray(
			'UPDATE accounts SET username = $1 WHERE id = $2;',
			[newUsername, accountId]
		);
	}

}

export const erase = async(accountId) => {
	await client().queryArray(
		'DELETE FROM accounts WHERE id = $1;',
		[accountId]
	);
}
