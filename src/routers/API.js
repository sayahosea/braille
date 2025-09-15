import { Hono } from 'npm:hono';

import * as util from '../handlers/Util.js';
import * as cookie from '../handlers/Cookie.js';
import * as db from '../handlers/Database.js';

import register from '../api/account/register.js'
import login from '../api/account/login.js'
import changePassword from '../api/account/change-password.js'
import changeUsername from '../api/account/change-username.js'
import deleteAccount from '../api/account/delete-account.js'
import logoutDevices from '../api/account/logout-devices.js'

import validate from '../api/quiz/validate.js'

export default new Hono()
.post('/account/register', (c) => register(c, util, db, cookie))
.post('/account/login', (c) => login(c, util, db, cookie))
.put('/account/change-password', (c) => changePassword(c, util, db))
.put('/account/change-username', (c) => changeUsername(c, util, db))
.delete('/account/delete-account', (c) => deleteAccount(c, util, db, cookie))
.delete('/account/logout-devices', (c) => logoutDevices(c, util, db, cookie))

.post('/quiz/validate', (c) => validate(c, util, db))
