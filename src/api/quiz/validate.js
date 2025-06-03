import letters from '../../handlers/courses/letters.json' with { type: 'json' };
import numbers from '../../handlers/courses/numbers.json' with { type: 'json' };
import numberSign from '../../handlers/courses/number-sign.json' with { type: 'json' };

const required = ['courseType', 'courseId', 'answers'];

export default async(c, util, cookie, db) => {
	try {
		const body = await c.req.json();

		const bodyValid = util.validateBody(required, Object.keys(body));
		if (!bodyValid) return c.text({ error: 'body request is not valid :[' }, 400);

		let { courseType, courseId } = body;
		const submittedAnswers = body.answers;



		// the the submitted answer is not object OR it is an array
		if (typeof submittedAnswers !== 'object' || submittedAnswers[0]) {
			return c.json({ error: 'Invalid body request.' }, 400);
		}

		const answersObjectKeys = Object.keys(submittedAnswers);

		// if object is empty
		if (answersObjectKeys === 0) {
			return c.json({ error: 'Invalid body request.' }, 400);
		}

		if (!util.courses.includes(courseType)) {
			return c.html( util.error('Invalid course type.') , 404);
		}



		let courses;
		if (courseType === 'letters') courses = letters.courses;
		if (courseType === 'numbers') courses = numbers.courses;
		if (courseType === 'number-sign') courses = numberSign.courses;

		courseId = Number(courseId);
		if (isNaN(courseId)) return c.html(util.error('Invalid course id.'), 404);
		if (courseId > courses.length || courseId < 1) {
			return c.html(util.error('Course not found.'), 404);
		}



		// check if the user has access to validate the course
		const accountId = c.account.id;
		const lastCourseId = await db.progress.get(courseType, accountId) ?? 0;
		const nextCourseId = Number(lastCourseId) + 1;

		if (courseId > nextCourseId) {
			return c.html( util.error("You can't validate this course yet.") , 400);
		}



		const prefix = `${courseType}-`;

		let answers = [];
		// remove quiz id prefix from answers
		for(let key of answersObjectKeys) {
			// If the answer object key doesn't start with course type name (example: "letters-").
			// This answer object key counts as invalid.
			if (!key.startsWith(prefix)) {
				answers = [];
				return c.json({ error: "Invalid body request." }, 400);
				break;
			}

			let questionId = key.replace(prefix, "");
			answers.push({ id: questionId, value: submittedAnswers[key] });
		}

		// if the answers array empty because of invalid answer object key
		if (!answers.length) {
			return c.json({ error: "Invalid body request." }, 400);
		}



		// validating the answers
		const course = courses.find(x => x.id === courseId);
		if (!course) return c.json({ error: "Course not found." }, 400);

		let validatedAnswer = {};
		const quizzes = course.quizzes;

		// check if submitted answer has answered all questions or not
		if (answers.length !== quizzes.length) {
			return c.json({ error: "Invalid body request." }, 400);
		}

		for (let answer of answers) {
			const answerId = answer.id;
			const answerValue = answer.value;

			const quiz = quizzes.find(x => x.id === answerId);
			const correctAnswer = quiz.answer.correct;

			validatedAnswer[`${prefix}${answerId}`] = {
				correct: correctAnswer === answerValue,
				correctAnswer
			};
		}

		if (courseId >= lastCourseId) {
			await db.progress.set(courseId, courseType, accountId);
		}

		return c.json({ result: validatedAnswer }, 200);
	} catch(err) {
		console.error(err.stack);
		return c.text('sus', 400);
	}
}