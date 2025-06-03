import {
	getSignedCookie,
	setSignedCookie,
	deleteCookie
} from "npm:hono/cookie";

const secret = Deno.env.get('COOKIE_SECRET');



export const set = async(c, value) => {
	await setSignedCookie(
		c, 'session', value, secret, {
			httpOnly: true,
			sameSite: 'Lax'
		}
	);
}

export const get = async(c) => {
	return await getSignedCookie(c, secret, 'session');
}

export const destroy = async(c) => {
	deleteCookie(c, 'session');
}