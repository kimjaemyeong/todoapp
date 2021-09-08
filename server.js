const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(express.urlencoded({extended: true}));
const MongoClient = require('mongodb').MongoClient;
const methodOverride = require('method-override')
app.use(methodOverride('_method'))
app.set('view engine', 'ejs');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session')
require('dotenv').config()

app.use(session({secret : '비밀코드', resave : true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/public', express.static('public'));

var db;
MongoClient.connect(process.env.DB_URL, function(에러, client){
    if(에러) return console.log(에러)
    db = client.db('todoapp');
    // db.collection('post').insertOne( {이름 : 'John', _id : 20}, function(에러, 결과){
    //     console.log('저장완료')
    // });

    app.listen(process.env.PORT, function(){
        console.log('리스닝 8080')
    });
});


app.get('/pet', function(요청, 응답){
    응답.send('펫용품 입니다');
});

app.get('/beauty', (요청, 응답) =>{
    응답.send('뷰티페이지 입니다');
});

app.get('/', function(요청, 응답){
    응답.render('index.ejs');
});

app.get('/write', function(요청, 응답){
    응답.render('write.ejs')
    응답.redirect('/write')
});

//해석
app.post('/add', function(요청, 응답){ // 누가 폼에다가 /add 로 요청을하면~
    응답.send('전송완료');
    db.collection('counter').findOne({name: '게시물갯수'}, function(에러, 결과){ //db에 있는 카운트라는 파일에서 게시물갯수이라는 이름을 가진 값을~
        console.log(결과.totalPost); // = 총게시물갯수
        var 총게시물갯수 = 결과.totalPost // 총게시물갯수라는 변수에 저장

        //이제 DB.post에 새게시물을 저장
        db.collection('post').insertOne( { _id: 총게시물갯수 + 1, 제목: 요청.body.title, 날짜: 요청.body.date }, function(){
            console.log('저장완료');
            // counter 라는 콜랙션에 있는 토탈포스트라는 항목도 +1 증가시켜야함
            // db.collection('counter').updateOne({ 어떤 데이터를 수정할지? },{수정값},function(){}) 
            db.collection('counter').updateOne({ name: '게시물갯수' },{ $inc: {totalPost:1} },function(에러, 결과){
                if(에러) {return console.log(에러)} // 완료가 되면 DB.conuter라는 총게시물갯수애 +1를 해주세요~
            }) 
            //set = ~바꾸는 명렁어 / inc ~만큼 증가지켜주세요
        });
        
    });
});

app.get('/list', function(요청, 응답){
    
    db.collection('post').find().toArray(function(에러, 결과){
        console.log(결과);
        응답. render('list.ejs', { posts : 결과 });
    });
});

//검색 결과를 찾아주는 코드 (다시 한번 면밀히 살펴보기)
app.get('/search', (요청, 응답) => {
    var 검색조건 = [
        {
            $search: {
                index: 'titleSearch',
                text: {
                query: 요청.query.value,
                path: '제목'
            }
            }
        },
        { $sort : { _id : 1 } }
    ] 
    console.log(요청.query.value)
    db.collection('post').aggregate(검색조건).toArray((에러, 결과)=>{
        console.log(결과)
        응답.render('search.ejs', { posts : 결과})
    });
});




app.delete('/delete', function(요청, 응답){
    console.log(요청.body);
    요청.body._id = parseInt(요청.body._id);
    db.collection('post').deleteOne(요청.body, function(에러, 결과){
        console.log('삭제완료');
        응답.status(200).send({ message : '성공했습니다' });
    })
})

app.get('/detail/:id', function(요청, 응답){
    db.collection('post').findOne({_id : parseInt(요청.params.id)}, function(에러, 결과){
        console.log(결과)
        응답.render('detail.ejs', { data : 결과 })
        응답.status(400).send('Wrong!');
    })
    
})

app.get('/edit/:id', function(요청, 응답){
    db.collection('post').findOne({_id : parseInt(요청.params.id)}, function(에러, 결과){
        console.log(결과);
        응답.render('edit.ejs', { post : 결과 })
    })
    
})

app.put('/edit', function(요청, 응답){
    // 폼에 담긴 제목, 날짜 데이터를 가지고 
    // db.collection 에다가 업데이트함
    db.collection('post').updateOne({ _id : parseInt(요청.body.id) },{ $set : { 제목:요청.body.title, 날짜: 요청.body.date } },function(에러, 결과){
        console.log('수정완료')
        응답.redirect('/list')
    })
});

app.get('/login', function(요청, 응답){
    응답.render('login.ejs')
})

app.get('/fail', function(요청, 응답){
    응답.render('fail.ejs')
})

app.post('/login', passport.authenticate('local', { failureRedirect : '/fail'}), function(요청, 응답){
    응답.redirect('/')
});

//로그인했니 함수는 '미들웨어'로 중간에 넣을 수 있는 함수이다
app.get('/mypage', 로그인했니, function(요청, 응답){
    응답.render('mypage.ejs', {사용자: 요청.user});
})

function 로그인했니(요청, 응답 ,next){
    if (요청.user){
        next()
    } else {
        응답.send('로그인 안됐는데용?')
    }
}


passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'pw',
    session: true,
    passReqToCallback: false,
    }, function (입력한아이디, 입력한비번, done) {
    //console.log(입력한아이디, 입력한비번);
    db.collection('login').findOne({ id: 입력한아이디 }, function (에러, 결과) {
        if (에러) return done(에러)

        if (!결과) return done(null, false, { message: '존재하지않는 아이디요' })
        if (입력한비번 == 결과.pw) {
            return done(null, 결과)
        } else {
            return done(null, false, { message: '비번틀렸어요' })
        }
    })
    }));

passport.serializeUser(function(user, done){
    done(null, user.id)
});

passport.deserializeUser(function(user, done){
    db.collection('login').findOne({ id: 아이디 }, function(에러, 결과){
        done(null, {})
    })
    
})