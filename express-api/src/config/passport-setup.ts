import passport from 'passport';
import { Strategy as googleStrategy} from 'passport-google-oauth20';
import User from '../models/User'
import keys from './keys';

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
    .then((user) => {
        done(undefined, user ? user : false);
    });
})

passport.use(new googleStrategy({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: '/auth/google/redirect'
}, (accessToken, refreshToken, profile, done) => {

    User.findOne({googleId: profile.id})
    .then((currentUser) => {
        if(currentUser) {
            done(undefined, currentUser);
        } else {
            new User({
                username: profile.displayName,
                googleId: profile.id
            })
            .save()
            .then((newUser) => {
                done(undefined, newUser);
            });
        }
    });
    
}));