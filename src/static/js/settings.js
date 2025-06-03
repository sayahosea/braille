const el = (id) => document.getElementById(id);

const putMsg = (message) => {
	el("msg").classList.remove("is-hidden");
	el("message").innerHTML = message;
}

el("change-password").onclick = async() => {
	const pass = el("password");
	if (!pass.value) {
		pass.focus();
		return putMsg("Missing new password");
	} else if (pass.value.length < 3 || pass.value.length > 32) {
		pass.focus();
		return putMsg("New Password must be 3 to 32 characters long");
	}

	const response = await fetch("/api/account/change-password", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ password: pass.value })
	});

	const serverMsg = await response.text();
	putMsg(serverMsg);
}

el("delete-account").onclick = async() => {
	const confirm = el("confirm");
	if (!confirm.value || confirm.value !== "YES") {
		confirm.focus();
		return putMsg("You have to type 'YES' on the Delete Account input form to delete your account");
	}

	const res = await fetch("/api/account/delete-account", {
		method: "DELETE"
	});

	const serverMsg = await res.text();
	putMsg(serverMsg);

	if (res.ok) {
		setTimeout(() => {
			window.location.replace("/");
		}, 4000);
	}
}

el("logout-devices").onclick = async() => {
	const res = await fetch("/api/account/logout-devices", {
		method: "DELETE"
	});

	const serverMsg = await res.text();
	putMsg(serverMsg);
}

el("change-username").onclick = async() => {
	const username = el("username");
	if (!username.value) {
		username.focus();
		return putMsg("Missing new username");
	} else if (username.value.length < 3 || username.value.length > 16) {
		username.focus();
		return putMsg("New username must be 3 to 16 characters long");
	}

	const usernameRegex = /^[a-zA-Z0-9_]+$/;
	if (!usernameRegex.test(username.value)) {
		username.focus();
		return putMsg("Username can only use uppercase, lowercase letters, numbers, and underscores");
	}

	const response = await fetch("/api/account/change-username", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ username: username.value })
	});

	const serverMsg = await response.text();
	putMsg(serverMsg);
}