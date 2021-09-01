const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(express.urlencoded({extended: true}));
const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs');

var db;
MongoClient.connect('mongodb+srv://1234:1234@cluster0.tx6l3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', function(에러, client){
    if(에러) return console.log(에러)
    db = client.db('todoapp');
    // db.collection('post').insertOne( {이름 : 'John', _id : 20}, function(에러, 결과){
    //     console.log('저장완료')
    // });

    app.listen(8080, function(){
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
    응답.sendFile(__dirname + '/index.html');
});

app.get('/write', function(요청, 응답){
    응답.sendFile(__dirname + '/write.html');
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

app.get('/list', function(용청, 응답){
    
    db.collection('post').find().toArray(function(에러, 결과){
        console.log(결과);
        응답. render('list.ejs', { posts : 결과 });
    });
    
    
})