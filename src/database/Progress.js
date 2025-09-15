export const set = async(conn, courseId, courseType, accountId) => {
	let query = 'UPDATE progress SET course_id = $1 WHERE course_type = $2 AND account_id = $3;';
	if (courseId < 2) {
		query = 'INSERT INTO progress(course_id, course_type, account_id) VALUES($1, $2, $3);';
	}

	await conn.queryArray(
		query,
		[courseId, courseType, accountId]
	);
}

export const get = async(conn, courseType, accountId) => {
	const result = await conn.queryObject(
		'SELECT course_id FROM progress WHERE course_type = $1 AND account_id = $2;',
		[courseType, accountId]
	);
	return result.rows[0]?.course_id ?? undefined;
}