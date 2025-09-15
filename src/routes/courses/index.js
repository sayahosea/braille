import start from './start.js';
import * as Courses from '../../handlers/Courses.js';

export default async(c, util, db, cookie) => {
	let conn;

	try {
		const course = c.req.param('courseType');
		const courseInfo = Courses.get(course);

		if (!courseInfo) return error(c, util.error, 'Course not found.');

		const courseId = c.req.query('id');
		if (courseId) return await start(c, util, db, courseInfo);

		const accId = c.account.id;

		conn = await db.getConn();
		const lastCourseId = await db.progress.get(conn, course, accId) ?? 0;
		const nextCourseId = Number(lastCourseId) + 1;

		const { courses } = courseInfo;
		let coursesHTML = '';
		for(let i = 0; i < courses.length; i++) {
			let id = courses[i].id;
			coursesHTML += `<div class="column is-one-third">
	<div class="box"><h2 class="is-size-3">${courses[i].title}</h2>
	${id <= nextCourseId ? `<a class="button is-dark is-fullwidth" href=\"/courses/${course}?id=${id}\">Start Course</a>` : "<button class=\"button is-dark is-fullwidth\" disabled>Course Locked</button>"}
	</div></div>`;
		}

		return c.html(util.render('courses', { coursesHTML, pageTitle: Courses.title([course]) }));
	} catch(err) {
		console.error(err);
		if (conn) conn.release();
	} finally {
		if (conn) conn.release();
	}
}

function error(c, renderError, message) {
	return c.html(renderError(message), 404);
}
