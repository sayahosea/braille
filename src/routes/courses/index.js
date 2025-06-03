import start from './start.js';

import letters from '../../handlers/courses/letters.json' with { type: 'json' };
import numbers from '../../handlers/courses/numbers.json' with { type: 'json' };
import numberSign from '../../handlers/courses/number-sign.json' with { type: 'json' };

const titles = {
	'letters': 'Letters',
	'numbers': 'Numbers',
	'number-sign': 'Number Sign'
}

export default async(c, util, cookie, db) => {
	const course = c.req.param('courseType');
	if (!util.courses.includes(course)) {
		return c.html(util.error('Invalid course type.'), 404);
	}

	const courseId = c.req.query('id');
	if (courseId) return await start(c, util, cookie, db);



	const accId = c.account.id;

	const lastCourseId = await db.progress.get(course, accId) ?? 0;
	const nextCourseId = Number(lastCourseId) + 1;

	let courses;
	if (course === 'letters') courses = letters.courses;
	if (course === 'numbers') courses = numbers.courses;
	if (course === 'number-sign') courses = numberSign.courses;

	let coursesHTML = '';
	for(let i = 0; i < courses.length; i++) {
		let id = courses[i].id;
		coursesHTML += `<div class="column is-one-third">
<div class="box"><h2 class="is-size-3">${courses[i].title}</h2>
${id <= nextCourseId ? `<a class="button is-dark is-fullwidth" href=\"/courses/${course}?id=${id}\">Start Course</a>` : "<button class=\"button is-dark is-fullwidth\" disabled>Course Locked</button>"}
</div></div>`;
	}

	return c.html(util.render('courses', { coursesHTML, pageTitle: titles[course] }));
}