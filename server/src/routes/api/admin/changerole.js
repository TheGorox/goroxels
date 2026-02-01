const express = require('express');
const {User} = require('../../../db/models/User')

const logger = require('../../../logger')('API', 'debug');
const adminLogger = require('../../../logger')('admin');

const router = express.Router();

const roleRequired = require('../../../utils/roleRequired');

const {
    ROLE
} = require('../../../constants');
const Server = require('../../../WebsocketServer');
const { body, validationResult } = require('express-validator');

function error(res, error) {
    res.json({
        errors: [error]
    })
}

router.use(roleRequired.admin);

router.post(
    '/',
    [
        body('id')
            .isInt({ min: 1 }).withMessage('wrong user id'),

        body('role')
            .custom(value => {
                if (!ROLE[value] || value === 'BANNED') {
                    throw new Error('wrong role');
                }
                return true;
            })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({ errors: errors.array() });
        }

        const targetUserId = +req.body.id;
        const targetUserRole = req.body.role;

        if (req.user.id !== 1 && targetUserId === req.user.id) {
            return error(res, 'you can\'t change your role');
        }

        if (targetUserRole === 'ADMIN' && req.user.id !== 1) {
            return error(res, 'wrong role');
        }

        const user = await User.findOne({ where: { id: targetUserId } });
        if (!user) return error(res, 'no such user');

        if (ROLE[user.role] === ROLE.ADMIN && req.user.id !== 1) {
            return error(res, 'you can\'t change admin\'s role');
        }

        user.role = targetUserRole;

        user.save()
            .then(() => {
                res.json({ errors: [] });

                adminLogger.info(`Set ${user.name}'s role to ${targetUserRole} by ${req.user.name}`);
                Server.getInstance().closeByUser(user);
            })
            .catch(e => {
                logger.error(e);
                return error(res, 'unknown database error');
            });
    }
);

module.exports = router