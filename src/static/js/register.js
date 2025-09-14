const el = (name) => document.getElementById(name);



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



const error = (message) => {
	el("error").classList.remove("is-hidden");
	el("error-message").innerHTML = message;
}

el("main").addEventListener("keyup", async(event) => {
	if (event.key === "Enter") {
		await start();
	}
});

el("submit").onclick = async() => {
	await start();
}

async function start() {
	const name = el("username");

	if (!name.value) {
		name.focus();
		return error("Missing username");
	} else if (name.value.length < 3 || name.value.length > 16) {
		name.focus();
		return error("Username must be 3 to 16 characters long");
	}

	const usernameRegex = /^[a-zA-Z0-9_]+$/;
	if (!usernameRegex.test(name.value)) {
		name.focus();
		return error("Username can only use uppercase, lowercase letters, numbers, and underscores");
	}


	const pass = el("password");

	if (!pass.value) {
		pass.focus();
		return error("Missing password");
	} else if (pass.value.length < 3 || pass.value.length > 32) {
		pass.focus();
		return error("Password must be 3 to 32 characters long");
	}

	const response = await fetch("/api/account/register", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ username: name.value, password: pass.value })
	});

	if (!response.ok) {
		const errorMessage = await response.text();
		error("Error: " + errorMessage);
	} else {
		window.location.href = "/dashboard";
	}
}