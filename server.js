const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(express.urlencoded({
    extended: true
}))
const MongoClient = require('mongodb').MongoClient;
// app.set('view engine', 'ejs');

var db;
MongoClient.connect('mongodb+srv://admin:1234@cluster0.kbwkd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', function (에러, client) {
    //연결되면 할일
    if(에러) {return console.log(에러)}

    db = client.db('todoapp');
    db.collection('post').insertOne( {이름: 'John', _id : 100} , function(에러, 결과){
        console.log('저장완료');
    });

    app.listen(8080, function(){
        console.log('listening on 8080')
    });
});



app.get('/pet', function (요청, 응답) {
    응답.send('펫 쇼핑 페이지입니다');
});

app.get('/beauty', function (요청, 응답) {
    응답.send('뷰티 페이지입니다');
});

app.get('/', function (요청, 응답) {
    응답.sendFile(__dirname + '/index.html')
});

app.get('/write', function (요청, 응답) {
    응답.sendFile(__dirname + '/write.html')
});

//서버에 ADD 보내는 코드 (예제)
// app.post('경로', function(요청, 응답){
//     응답.send('전송완료')
// });



//숙제
//어떤 사람이 /add 라는 경로로 post 요쳥하면,
//데이터 2개(날짜, 제목)를 보내주는데,
//이 때, 'post'라는 이름을 가진 collection에 데이타 두개를 저장하기
// { 제목: '어쩌구', 날짜 : '어쩌구' }

app.post('/add', function (요청, 응답) {
    응답.send('전송완료');
    db.collection('counter').findOne({ name : '게시물갯수' }, function(에러, 결과){
        console.log(결과.totalPost)
        var 총게시물갯수 = 결과.totalPost;
        
        db.collection('post').insertOne({ _id : 총게시물갯수 + 1, 제목: 요청.body.title, 날짜: 요청.body.date }, function(){
            console.log('저장완료');
            db.collection('counter').updateOne({nane:'게시물갯수'}, { $inc : {totalPost:1}}, function(에러, 결과){
                if(에러){return console.log(에러)}
            })
        });
        
    })
    // console.log(요청.body.date);
    // console.log(요청.body.title);

})

app.get('/list', function(요청, 응답){
    db.collection('post').find().toArray(function(에러, 결과){
        console.log(결과);
        응답.render('list.ejs', { posts : 결과 });
    })
    
})