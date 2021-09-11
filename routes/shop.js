var router = require('express').Router();

function 로그인했니(요청, 응답 ,next){
    if (요청.user){
        next()
    } else {
        응답.send('로그인 안됐는데용?')
    }
}

//아래 라우터에 함수를 하나식 다 넣을 수는 없으니 router.use를 통해 각 라우터에 미들웨어를 자동으로 추가시켜 줌
router.use(로그인했니);

router.get('/shirts', function (요청, 응답) {
    응답.send('셔츠 파는 페이지입니다.');
});

router.get('/pants',  function (요청, 응답) {
    응답.send('바지 파는 페이지입니다.');
});

module.exports = router;