const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(express.urlencoded({
    extended: true
}))
const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs');

var db
MongoClient.connect('mongodb+srv://wogud541:1234@cluster0.kbwkd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', function(에러, client){
    if(에러) return console.log(에러)
    db = client.db('todoapp'); // db를 todoapp에 연결시키는 명령어
    db.collection('post').insertOne( {이름 : 'John', _id : 20}, function(에러, 결과){
        console.log('저장완료')
    });

    app.listen(8080, function(){
        console.log('listening on 8080')
    });
})


app.post('/add', function(요청, 응답) {
    응답.send('전송완료');
    console.log(요청.body.date);
    console.log(요청.body.title);
    db.collection('post').insertOne({ 제목 : 요청.body.title , 날짜 : 요청.body.date}, function(에러, 결과){
        console.log('저장완료');
    })
})


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

app.get('/list', function(요청, 응답){
    db.collection('post').find().toArray(function(에러, 결과){
        console.log(결과);
        응답.render('list.ejs', { posts : 결과 });
    });

    

});