import { Hono } from 'npm:hono';

import * as util from '../handlers/Util.js';
import * as cookie from '../handlers/Cookie.js';
import * as db from '../handlers/Database.js';

import index from '../routes/courses/index.js';

export default new Hono()
.get('/:courseType', (c) => index(c, util, db, cookie))
