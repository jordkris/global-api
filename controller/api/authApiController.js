const dbModel = require("../../model/dbModel");
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const process = require('process');

module.exports = {
    processLogin: async (req, res) => {
        try {
            let results = await new Promise((resolve) => {
                dbModel.get(req.con, res, {
                    table: 'users',
                    select: '*',
                    whereColumn: 'id',
                    whereValue: '1',
                    server: false
                }, (results) => {
                    resolve(results);
                });
            });
            let userId = results[0].id;
            let email = results[0].email;
            let password = results[0].password;
            let name = results[0].name;
            if (email === req.body.email && password === md5(req.body.password)) {
                let accessToken = jwt.sign({userId, name, email}, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: '20s'
                });
                let refreshToken = jwt.sign({userId, name, email}, process.env.REFRESH_TOKEN_SECRET, {
                    expiresIn: '1d'
                });
                dbModel.update(req.con, res, {
                    table: 'users',
                    column: 'refresh_token',
                    value: refreshToken,
                    id: userId,
                    server: false
                });
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000
                });
                // req.flash('accessToken', accessToken);
                // res.redirect('/admin');
                res.status(200).json({
                    ok: true,
                    accessToken: accessToken
                });
            } else {
                // req.flash('message', 'Incorrect email or password');
                // res.redirect('/login');
                res.status(200).json({
                    ok: false,
                    message: 'Incorrect email or password'
                });
            }
        } catch (err) {
            res.status(500).json({
                ok: false,
                message: err.message
            });
        }
    },
    setSession: (req, res) => {

    }
    , checkSession: (req, res) => {
        res.status(200).json(req.cookies);
    }
}
