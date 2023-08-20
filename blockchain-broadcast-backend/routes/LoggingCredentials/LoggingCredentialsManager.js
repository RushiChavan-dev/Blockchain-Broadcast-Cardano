import {Router} from 'express';
import {LoggingCredentials} from '../../Controller/Logging Credentials/LoggingCredentials.js';
import {isAuthenticated} from '../../Middlewares/isAuthenticated/isAuthenticated.js';

const router = Router();
const Controller = new LoggingCredentials();

router.post('/api/update-login', isAuthenticated, (request, response) => {
    Controller.UpdateUserInfo(request, response)
})

export default router