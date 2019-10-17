var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejsLocals = require('ejs-locals'); // ejs-locals 사용
var session = require('express-session');

var cors = require('cors');

var app = express();

app.use(cors());

// view engine setup
app.engine('ejs', ejsLocals); // view engine 설정
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('aa'));
app.use(session({resave:false,
  saveUninitialized:true,
  secret:'aa',
  cookie: {
    httpOnly: true,
    secure: false,
    // expires:30
  }
}));

app.use('/', require('./routes/index'));
app.use('/user', require('./routes/userRouter'));
app.use('/signup', require('./routes/userRouter'));
app.use('/login', require('./routes/userRouter'));
app.use('/findid', require('./routes/userRouter'));
app.use('/findpw', require('./routes/userRouter'));

app.use('/admin',require('./routes/dopAdmin'));
app.use('/board',require('./routes/boardRouter'));

app.use('/dop', require('./routes/dopRouter')); // .../dop url 접속 처리
app.use('/mission', require('./routes/mission'));
app.use('/app', require('./routes/appRouter'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
