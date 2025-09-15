import letters from './courses/letters.json' with { type: 'json' }
import numbers from './courses/numbers.json' with { type: 'json' }
import numberSign from './courses/number-sign.json' with { type: 'json' }

const courses = {
	letters, numbers, numberSign
}

const titles = {
	'letters': 'Letters',
	'numbers': 'Numbers',
	'number-sign': 'Number Sign'
}

export const all = () => courses;

export const title = (courseType) => titles[courseType];

export const get = (courseType) => {
	if (courseType === 'letters') return letters;
	if (courseType === 'numbers') return numbers;
	if (courseType === 'number-sign') return numberSign;
	return null;
}
