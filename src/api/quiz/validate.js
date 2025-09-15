import * as Courses from '../../handlers/Courses.js';

const required = ['courseType', 'courseId', 'answers'];

export default async(c, util, db) => {
	let conn;

	try {
		const body = await c.req.json();

		if (!util.validate.body(required, Object.keys(body))) {
			return error(c, 'Invalid body request.');
		}

		let { courseType, courseId } = body;
		const submittedAnswers = body.answers;

		// the the submitted answer is not object OR it is an array
		if (typeof submittedAnswers !== 'object' || submittedAnswers[0]) {
			return error(c, { error: 'Invalid body request.' });
		}

		const answersObjectKeys = Object.keys(submittedAnswers);

		// if object is empty
		if (answersObjectKeys === 0) {
			return error(c, { error: 'Invalid body request.' });
		}

		const courseInfo = Courses.get(courseType);
		if (!courseInfo) return error(c, { error: 'Invalid course type.' });

		const { courses } = courseInfo;

		courseId = Number(courseId);
		if (isNaN(courseId)) return error(c, { error: 'Invalid course id.' });
		if (courseId > courses.length || courseId < 1) return error(c, { error: 'Course not found.' });

		// check if the user has access to validate the course
		const accountId = c.account.id;
		conn = await db.getConn();

		const lastCourseId = await db.progress.get(conn, courseType, accountId) ?? 0;
		const nextCourseId = Number(lastCourseId) + 1;

		if (courseId > nextCourseId) {
			return error(c, { error: 'You don\'t have access to this course yet.' });
		}



		const prefix = `${courseType}-`;

		let answers = [];
		// remove quiz id prefix from answers
		for(let key of answersObjectKeys) {
			// If the answer object key doesn't start with course type name (example: "letters-").
			// This answer object key counts as invalid.
			if (!key.startsWith(prefix)) {
				answers = [];
				return error(c, { error: 'Invalid body request.' });
				break;
			}

			let questionId = key.replace(prefix, '');
			answers.push({ id: questionId, value: submittedAnswers[key] });
		}

		// if the answers array empty because of invalid answer object key
		if (!answers.length) {
			return error(c, { error: 'Invalid body request.' });
		}



		// validating the answers
		const course = courses.find(x => x.id === courseId);
		if (!course) return error(c, { error: 'Course not found.' });

		let validatedAnswer = {};
		const quizzes = course.quizzes;

		// check if submitted answer has answered all questions or not
		if (answers.length !== quizzes.length) {
			return error(c, { error: 'Invalid body request.' });
		}

		for (let answer of answers) {
			const answerId = answer.id;
			const answerValue = answer.value;

			const quiz = quizzes.find(x => x.id === answerId);
			const correctAnswer = quiz.answer.correct;

			const isAnswerCorrect = correctAnswer === answerValue;
			const props = { correct: isAnswerCorrect }
			if (!isAnswerCorrect) props.correctAnswer = correctAnswer;

			validatedAnswer[`${prefix}${answerId}`] = props;
		}

		if (courseId >= lastCourseId) {
			await db.progress.set(conn, courseId, courseType, accountId);
		}

		return c.json({ result: validatedAnswer }, 200);
	} catch(err) {
		console.error(err);
		if (conn) conn.release();
		return error(c, { message: 'sus.' });
	} finally {
		if (conn) conn.release();
	}
}

function error(c, body) {
	return c.json(body, 400);
}
