import express from 'express';
import passport from 'passport';

const router = express.Router();

// auth Google login
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.redirect('http://localhost:3000/');
})

router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('http://localhost:3000/');
});

export default router;
