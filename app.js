const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const agentRoutes = require('./routes/agentRoutes')
const officeRoutes = require('./routes/officeRoutes')
const {connection,options} = require('./connection/connection')
const session = require('express-session');
// var MySQLStore = require('express-mysql-session')(session);
// const sessionstore = new MySQLStore(options, connection)


app.set('view engine' ,'ejs')

app.use(session({ 
    secret: 'my secret',
    resave: false,
    // store: sessionstore,
    saveUninitialized: true,
    cookie: {  maxAge: 30 * 24 * 60 * 60 * 1000 }
  }))
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'public')));



app.use('/agent',agentRoutes);
app.use('/office',officeRoutes);

app.get('/', (req,res) => {
    res.render('home')
})

app.get('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        res.redirect('/');
    })
})


app.listen(3000,() => {
    console.log('server connected')
})