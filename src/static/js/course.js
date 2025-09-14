const el = (id) => document.getElementById(id);



document.addEventListener('DOMContentLoaded', async() => {
	loadNavbarBurger();
});

// load navbar burger for mobile
function loadNavbarBurger() {
	const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
	$navbarBurgers.forEach( el => {
		el.addEventListener('click', () => {
			const target = el.dataset.target;
			const $target = document.getElementById(target);

			el.classList.toggle('is-active');
			$target.classList.toggle('is-active');
		});
	});
}



const messages = {
	root: el("messages"),
	info: el("info-msg"),
	error: el("error-msg"),
};

function hide(el) {
	el.classList.add("is-hidden");
}

function show(el) {
	el.classList.remove("is-hidden");
}


const letters = el("quiz");
const quizzesElements = letters.children;
const courseType = letters.getAttribute("data-course-type");

let progress = 0,
totalQuizzes = quizzesElements.length;

quizzesElements[0].classList.remove("is-hidden");

let answers = {};

const options = document.getElementsByClassName("option");
document.addEventListener("click", async(e) => {
	const target = e.target;
	if (target.tagName !== "BUTTON") return;
	if (target.classList.contains("option")) {
		if (progress === totalQuizzes) return;

		progress++;

		const quizId = target.getAttribute("data-quiz-id");
		answers[quizId] = target.innerText;

		el(`options-${quizId}`).style.pointerEvents = "none";

		target.classList.replace("is-dark", "is-light");
		target.classList.add("answer");

		setTimeout(() => {
			if (progress < totalQuizzes) {
				hide(el(quizId));
				show(quizzesElements[progress]);
			}
		}, 1000);

		if (progress === totalQuizzes) {
			const courseId = letters.getAttribute("data-course-id");
			await sendAnswers(courseType, courseId, answers);
		}
	}
});

async function sendAnswers(courseType, courseId, answers) {
	const response = await fetch("/api/quiz/validate", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			courseType, courseId, answers
		})
	});

	if (!response.ok) {
		messages.error.innerHTML = response.json().error;
		show(messages.error);
		show(messages.root);
	} else {
		const result = await response.json();
		updateAnswerButtons(result.result);
	}
}

function updateAnswerButtons(result) {
	const answersList = Object.keys(result);

	for (let answerData of answersList) {

		let answerCorrect = result[answerData].correct;
		let columns = el(`options-${answerData}`).children;

		for (let column of columns) {

			// if the button contains "answer" class
			let button = column.children[0];

			if (button.classList.contains("answer")) {

				// highlights the correct answer if the user answer is correct
				if (answerCorrect) {
					button.classList.replace("is-light", "is-success");
					answerFormatted = true;
					break;
				}

				// highlights the user incorrect answer
				if (!answerCorrect) {
					button.classList.replace("is-light", "is-danger");
					continue;
				}
				
			} else {

				if (button.innerText === result[answerData].correctAnswer) {
					// highlights the correct answer if the user gave the wrong answer
					button.classList.replace("is-dark", "is-success");
				}

			}
		}
	}

	for (let quizElement of quizzesElements) {
		show(quizElement);
	}
	hide(messages.root);
	show( el("finish") );
}