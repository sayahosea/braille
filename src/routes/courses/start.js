export default async({ c, util, db, courseInfo }) => {
	let conn;

	try {
		const courseType = c.req.param('courseType');
		const { courses } = courseInfo;

		const courseId = Number(c.req.query('id'));
		if (isNaN(courseId)) return error(c, util.error, 'Invalid course id.');
		if (courseId > courses.length || courseId < 1) {
			return error(c, util.error, 'Course not found.');
		}

		const accountId = c.account.id;
		conn = await db.getConn();

		const lastCompletedCourseId = await db.progress.get(conn, courseType, accountId) ?? 0;
		const nextCourseId = Number(lastCompletedCourseId) + 1;

		if (courseId > nextCourseId) {
			return error(c, util.error, 'You can\'t access this course yet.');
		}

		const course = courses.find(x => x.id === courseId);
		if (!course) return error(c, util.error, 'Course not found.');

		let quizzes = course.quizzes;
		for (let quiz of quizzes) {
			quiz.answer.options = util.shuffleArray(quiz.answer.options);
			quiz.explanation = quiz.explanation.replace(/\n/g, '<br>');
		}

		let quizzesInHTML = '';
		for (let quiz of quizzes) {
			let columnSize = quiz.explanation.length > 24 ? 'is-half' : 'is-one-third';
			let explanationTextStyle = quiz.explanation.length > 24 ? 'is-size-5' : 'is-size-2 has-text-centered';


			// coded by a clown (that's me)

			let quizHtml = `
	<div id="${courseType}-${quiz.id}" class="column ${columnSize} is-hidden">
		<div class="box">
			<h1 class="${explanationTextStyle}">${quiz.explanation}</h1>
			<figure class="image is-1by1">
				<img src="/static/img/${quiz.id}.svg">
			</figure>
			<p class="is-size-4 has-text-centered">${quiz.question}</p>
	`

			if (quiz.answer.tooLong) {
				quizHtml += `<p class="is-size-5 mb-2">${quiz.answer.formatted.replace(/\n/g, "<br>")}</p>`;
			}

			let answerOptionsButtonSize = quiz.answer.options.length === 3 ? "is-full" : "is-half";
			quizHtml += `
			<div id="options-${courseType}-${quiz.id}" class="columns is-multiline is-centered is-1">`;

			for(let option of quiz.answer.options) {
				quizHtml += `
				<div class="column ${answerOptionsButtonSize} option">
					<button data-quiz-id="${courseType}-${quiz.id}" class="option button is-dark is-fullwidth">${option}</button>
				</div>`;
			}

			quizHtml += `
			</div>
		</div>
	</div>`;

			quizHtml = quizHtml.replace(/\t/, '').replace(/\n/, '');

			quizzesInHTML += quizHtml;
		}

		let nextCourse;
		if (!courses[courseId]) {
			nextCourse = null
		} else {
			nextCourse = courseId + 1;
		}

		return c.html(util.render('course',
			{ title: course.title, type: courseType, courseId, quizzesInHTML, nextCourse }
		));
	} catch(err) {
		console.error(err);
		if (conn) conn.release();
	} finally {
		if (conn) conn.release();
	}
}

function error(c, renderError, message) {
	return c.html(renderError(message), 400);
}
