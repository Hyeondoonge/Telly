# Day-13

# Single Page Application

## 구현사항

```
일정, 작업관리 프로젝트를 clone합니다.
ex) github project, jira, trello

페이지는 index.html 하나로 처리가 됩니다.
서버 사이드가 아닌 클라이언트 사이드 렌더링 방식을 사용합니다.

최소 3개의 페이지를 가집니다.
1. 로그인
2. 프로젝트 선택 페이지
3. 해당 프로젝트의 일정 관리

jQuery를 사용해도 좋습니다.
```

## 필수 구현 목록

- ✔사용자 개념이 필요합니다.
- 프로젝트는 private, public로 구분이 되며, private는 다른 사용자에게 보이지 않습니다.
- 다른 사용자는 public 일정이어도 수정은 불가능합니다.
- ✔일정은 다른 task로 이동이 가능합니다.
- ✔같은 task 내의 일정은 순서가 유지되며, 재접속에도 유지가 되어야 합니다.

## 선택 구현 목록

- ✔새로고침을해도 로그인이 풀리지 않습니다.
- 다른 사용자의 일정을 확인할 수 있습니다.
- 일정 권한을 읽기 / 수정까지 포함합니다.

## 선택 사항

- IE11 에서도 동일하게 작동합니다.
- ‍✔jQuery를 사용하지 않고 구현합니다.
- team 접근권한과, team을 구현합니다. team 멤버는 team 일정까지 열람이 가능합니다.
- ✔Drag & Drop으로 일정의 이동이 가능합니다.
- 이동 애니메이션을 적용합니다.
- ✔webpack을 적용합니다.

## 목적

- SPA에 대해 학습합니다.
- jQuery를 익혀보고, 장단점에 대해 고민해봅니다.

## 공부할 내용

- SPA: 링크 -> Ajax -> Hash -> PJax로 발전 되어져 왔음.
- what is trello?
- drop & drop ?
- webpack?
- jQuery 장단점

## 학습한 내용

- Front end Build Tools
  {Jake, Brunch, Gulp, Webpack , ...}
- ✅webpack : Package bundler.
  ⓐ 의존 모듈이 하나의 파일로 번들링 되어 별도의 모듈 로더가 필요 없음.
  ⓑ html파일에서 script태그로 다수의 자바스크립트 파일로 로드해야하는 번거로움 해소
  ⓒ 종속성 가진 애플리케이션 모듈을 정적인 소스로 재생산
  ⓓ 1. 모듈 시스템 관리, 2. 로더 사용, 3. 빠른 컴파일

- ✅Koa

- ✅hash routing: CSR 방식 O / history 관리 O
- ✅pJax: history 관리 O / 약간의 SSR (실제 Trello 구현을 따라 pJax 사용) 하려했지만,,
  hash로 구현

- ✅Backend - Frontend 서버 분리

  - Backend's role: REST API를 서비스 및 DB에 접근 (koa)
  - Frontend's role: Web server. 정적인 파일들을 제공하며 Back에 데이터 요청 (Go Live)

🛠서버관리 도구
nodemon, pm2
