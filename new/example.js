const dalmeum = require('kkbot.js')(BotManager.getCurrentBot());
const T = dalmeum.command.Type;

const { Int, Fraction } = require('numbers.js');

//////////////////////////////

// 1. 기본적인 타입 작성법
    //  - primitive type에 대해서는 이미 정의되어있음
    dalmeum.command(T.Array)
    dalmeum.command(T.String)
    dalmeum.command(T.Number)
    //  - custom type에 대해서는 직접 정의해야함 (생성자 함수인지 확인할거임, type(arg) instanceof type 로 확인할 예정)
    dalmeum.command(T(Int))
    dalmeum.command(T(Fraction))

    T.Fraction = T(Fraction) 
    dalmeum.command(T.Fraction) // 이렇게 해도 됨
    //  - 편의를 위해 그냥 넣어도 됨
    dalmeum.command(Array)
    dalmeum.command(String)
    dalmeum.command(Int)
    dalmeum.command(Fraction)

// 2. 가변 인자 `.many`
    //  - primitive type에 대해서는 이미 정의되어있음
    dalmeum.command(T.many.Number)
    dalmeum.command(T.many.String)

    Ts = T.many
    dalmeum.command(Ts.Number)    // 이렇게 해도 됨
    //  - custom type에 대해서는 직접 정의해야함 (생성자 함수인지 확인할거임, type(arg) instanceof type 로 확인할 예정)
    dalmeum.command(T.many(Int))
    dalmeum.command(T.many(Fraction))

    Ts = T.many
    dalmeum.command(Ts(Int))    // 이렇게 해도 됨

//  3. 선택 인자 `.option`
    //  - primitive type에 대해서는 이미 정의되어있음
    dalmeum.command(T.option.Number(3))   // 3이 기본값, 기본값이 타입에 안 맞으면 오류
    dalmeum.command(T.option.String('hello'))

    To = T.option
    dalmeum.command(To.Number(3))    // 이렇게 해도 됨
    //  - custom type에 대해서는 직접 정의해야함 (생성자 함수인지 확인할거임, type(arg) instanceof type 로 확인할 예정)
    dalmeum.command(T.option(Int)(new Int(345)))
    dalmeum.command(T.option(Fraction)(new Fraction(3, 4)))

    To = T.option
    dalmeum.command(To(Int)(new Int(345)))    // 이렇게 해도 됨

// 4. 타입 조합
    dalmeum.command(T(Number, String))  // Number | String
    dalmeum.command(T(Number, String, String))  // 타입 배열은 set로 할거라서 중복된 타입은 무시됨
    dalmeum.command(T(Int, Fraction))
    
    dalmeum.command(T.many(Number, String))  // (Number | String)[]

    dalmeum.command(T.option(Number, String)(3))  // Number | String, 3이 기본값, 기본값이 타입에 안 맞으면 오류

//////////////////////////////

// 1. 커맨드 그룹
meal = dalmeum.command.group('급식')

meal.command(T.many.String)
(
    function today() {
        this.send('오늘 급식');
    }
)

// 2. 커맨드 속성

//////////////////////////////

// 예외 편의 사항
dalmeum.command(T.many.String)
(
    function cmd1(content) {
        // 이 때 content는 알아서 dataSeparator로 join된 문자열로 나옴
    }
)

//////////////////////////////

Ts = T.many
To = T.option

dalmeum.command()
(
    function ping() {
        this.send('pong');
    }
)

dalmeum.command(T.String)
(
    function echo(content) {
        this.send(content);
    }
)

function Username(content) {
    if (!(content instanceof String && content.startsWith('@'))) {
        throw new TypeError('content must be started with @');
    }
    this.name = content.substring(1);
}
dalmeum.command(T(Username), To.String('그냥'))
(
    function (username, reason) {
        this.send(`@${username}를 강퇴합니다. 사유: ${reason}`);
    }
);

dalmeum.command(Ts(String))
(
    function (code) {
        if (this.author.name == 'rhs') {
            this.send(eval(code));
        }
    }
);


math = dalmeum.command.group('math')

math.command(T(Int, Fraction))
(
    function add(numbers) {
        this.send(numbers.reduce((a, b) => a.add(b)));
    }
);

dalmeum.command.group.set(math);

dalmeum.setCommandOption('/', ' ', '[run]');
dalmeum.on.command(intr => {
    // 명령어 출력 후 post_init 같은 개념으로 실행됨
});