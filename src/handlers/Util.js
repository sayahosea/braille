import { Eta } from 'npm:eta';
import { randomBytes, randomUUID } from 'node:crypto';
import { Buffer } from 'node:buffer';
import Argon2id from "jsr:@rabbit-company/argon2id";
import * as path from 'jsr:@std/path/posix';



const eta = new Eta({
	views: path.join(Deno.cwd(), '/src/pages')
});


export const courses = ["letters", "number-sign", "numbers"];

export const render = (fileName, args) => {
	return eta.render(fileName, args);
}

export const html = async(fileName) => {
	const file = await Deno.open(`${Deno.cwd()}/src/pages/${fileName}.html`, { read: true });
	return file.readable;
}

export const error = (message) => {
	return render("error", { message });
}

export const validateBody = (required, body) => {
	if (required.length !== body.length) return false;

	let result = true;

	for (let key of body) {
		if (!required.includes(key)) {
			result = false;
			break;
		}
	}

	return result;
}

export const password = {

	hash: async(plainPassword) => {
		return await Argon2id.hashEncoded(
			plainPassword,
			Argon2id.randomSalt(),
			1,		// Parallelism Factor
			19456,	// Memory Cost
			2		// Iterations
		);
	},

	verify: async(hash, plainPassword) => {
		return await Argon2id.verify(hash, plainPassword);
	}

}

const usernameRegex = /^[a-zA-Z0-9_]+$/;
export const validateValue = {

	username: (str) => {
		if (str.length < 3 || str.length > 16) return false;
		if (!usernameRegex.test(str.value)) return false;
		return true;
	},

	password: (str) => {
		return str.length >= 3 && str.length <= 64;
	}

}

export const generate = {
	sessionId: () => {
		return Buffer.from(randomBytes(32)).toString('hex');
	}
}

export const shuffleArray = (arr) => {
	for (let i = arr.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}

	return arr;
}
