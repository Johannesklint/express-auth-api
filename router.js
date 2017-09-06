const Authenication = require('./controllers/authentication');
const passportService = require('./servces/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignIn = passport.authenticate('local', { session: false });

module.exports = function (app) {
    app.get('/', requireAuth, function (req, res) {
        res.send({ hi: 'there' });
    });

    app.post('/signin', requireSignIn, Authenication.signin);

    app.post('/signup', Authenication.signup);
}