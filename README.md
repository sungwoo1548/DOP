# [ Dop ] project (start : 20190903)

## 업무분장
* back-end : 장희재, 최석준
* front-end : 신준혁, 황병윤, 조우리
* moblie : 김성우, 이재훈

## step 1. dop_zero 개발

### 1.1 개발환경
    1. Node.js + express @ibmcloud
    2. react-native @expo


### 1.2 master version 셋팅
    1. express --view=ejs dop_zero
    2. ibmcloud용 package.json 추가
    3. npm install로 node_modules 설치
    4. ejs-locals 환경 구축
        4.1. /dop 처리용 router 생성 (dop_zero/routes/dopRouter.js)
        4.2. ejs-locals layout 생성 (dop_zero/views/layout)
        4.3. DB read page 생성 (dop_zero/views/showdata.ejs)
    5. 이 셋팅은 각자의 ibmcloud SDK for Node.js에 push 하려면
        manifest.yml 파일의 name을 자신의 ibm app 이름으로 저장해야 가능 (ibmcloud cf push)

### 1.3 git branch 개발 1차 목표 ( ~ 20190905)
* 각 업무별 담담 팀은 master에서 branch를 만들어 작업한다.
* master 를 git clone을 사용하여 복사한다. ( 컴퓨터에 프로젝트 폴더 생성 후 안에서 VS code 실행 후 터미널에 git clone https://github.com/sungwoo1548/DOP.git 입력)
* branch 생성 git branch <branch이름>
* head branch로 이동 ( git checkout <branch이름> ) 
* branch push 하기 ( git push orign <branch이름> )    ****꼭 branch push 요망...

    1. back-end : ibm DB 연동 및 data type결정, table 설계 초안, 경쟁사 분석
    2. front-end : web-map-view api 연동, data visualizing chart
    3. moblie : mobile-map-vie api 연동, background-runnig 구현

### 1.4 ibmcloud 업로드 주의사항

* **.cfignore** 숨겨진 파일을 dop_zero 디렉토리에 넣어줘야한다.
  * Why?? -> 없으면 node_module 까지 한꺼번에 업로드 한다. 그러니 꼭 써주도록.
    (.cfignore을 수정하면 업로드 필터링 할 수 있을 것이다. 자세한 내용은 다음 기회에)

### 1.5 개발결과

* 경쟁사 비교
  ![DOP_Lympo_간단비교](https://user-images.githubusercontent.com/50816203/64240604-1e4f9f00-cf3d-11e9-9fa4-fa1b06052865.jpg)
* 

## step 2. dop_alpha 개발 (추석 이후~)