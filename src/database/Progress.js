import { get as client } from '../handlers/Database.js';

export const set = async(courseId, courseType, accountId) => {
	let query = 'UPDATE progress SET course_id = $1 WHERE course_type = $2 AND account_id = $3;';
	if (courseId < 2) {
		query = 'INSERT INTO progress(course_id, course_type, account_id) VALUES($1, $2, $3);';
	}

	await client().queryArray(
		query,
		[courseId, courseType, accountId]
	);
}

export const get = async(courseType, accountId) => {
	const result = await client().queryObject(
		'SELECT course_id FROM progress WHERE course_type = $1 AND account_id = $2;',
		[courseType, accountId]
	);
	return result.rows[0]?.course_id ?? undefined;
}