import express from 'express';
import bodyParser from 'body-parser'
import mongoose from 'mongoose';
import cors from 'cors';
import Item from './models/Item';
import authRoutes from './routes/auth-routes';
import cookieSession from 'cookie-session';
import keys from './config/keys';
import passport from 'passport';
const passportSetup = require('./config/passport-setup');
const app: express.Application = express();

const corsOptions = cors({
  origin: 'http://localhost:3000',
  credentials: true
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
app.use(corsOptions);
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [keys.session.cookieKey]
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRoutes);

function auth(req: express.Request, res: any, next: Function) {
  if(!req.user) {
    res.redirect('/auth/google')
  } else {
    next()
  }
}

mongoose
  .connect(
    'mongodb://mongo:27017/docker-node-mongo',
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  Item.find()
    .then(items => res.json({ "items": items }))
    .catch(err => res.status(404).json({ msg: 'No items found' }))
});

app.get('/checkAuth', (req: any, res: express.Response, next: express.NextFunction) => {
  if(!req.user) {
    res.json({user: undefined})
  } else {
    res.json({user: req.user?.username})
  }
});

app.post('/item/add', corsOptions , auth, (req: express.Request, res: express.Response) => {

  const newItem = new Item({
    name: req.body.name
  });

  newItem.save().then(item => res.json({ "name": item }));
});

app.post('/item/delete', auth, (req: express.Request, res: express.Response) => {

  Item.findByIdAndDelete(req.body._id)
    .then(() => res.json({"item": "deleted"}))
    .catch(err => res.status(404).json({msg: 'Item was unable to be deleted'}))
});

app.post('/item/update', auth, (req: express.Request, res: express.Response) => {

  Item.findByIdAndUpdate({_id: req.body._id}, {name: req.body.newName})
    .then(() => res.json({"item": "updated"}))
    .catch(err => res.status(404).json({msg: 'Item was unable to be updated'}));
});

app.listen(5000, () => console.log('Server running on port 5000'))