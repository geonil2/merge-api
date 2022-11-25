## Merge-api

* Description
* Specs
* Types
* APIs

### Description
> Merge API documentation

### Specs
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=JavaScript&logoColor=white"/>
<img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white"/>
<img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=Express&logoColor=white"/>
<img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=MongoDB&logoColor=white"/>

- Node 16.14.2
- NPM 8.5.0

### Types
```
Owner : {
 _id: string,
 name: string,
 email: string,
 image: string,
 emailVerified: null,
 updatedAt: string
}

Board : {
 _id: string,
 owner: Owner,
 title: string,
 description: string,
 category: "question" | "info" | "community" | "recruit",
 likes: string[],
 createdAt: string,
 updatedAt: string
}

Comment : {
  _id: string,
  owner: string,
  board: string,
  contents: string,
  createdAt: string,
  updatedAt: string,
}
```

### APIs
#### Search
#### GET /api/search?p={}&offset={}&limit={}  
전체에서 제목, 내용에 포함되는 리스트를 검색합니다.
- Query parameter

| Key    | Value  |
|--------|--------|
| p      | string |
| offset | number |
| limit  | number |

- Request example
```
GET /api/search?p=내용&offset=0&limit=20
```
- Response example
```
{
  "data": {
    "total": number,
    "list": board[]
  }
}
```
&nbsp;
#### Boards
#### GET /api/boards?category={}&offset={}&limit={}
해당 category 리스트를 반환합니다. offset, limit을 통해 pagination을 가능하게 합니다.
- Query parameter

| Key      | Value  |
|----------|--------|
| category | string |
| offset   | number |
| limit    | number |

- Request example
```
GET /api/boards?category=notice&offset=0&limit=3
```
- Response example
```
{
  "data": {
    "total": number,
    "list": board[]
  }
}
```
&nbsp;
#### GET /api/boards/:boardId
해당 boardId와 일치하는 리스트의 정보를 반환합니다.
- Path variable

| Key      | Value  |
|----------|--------|
| boardId  | string |

- Request example
```
GET api/boards/634321b5f7ca0ed123ac5ed3
```
- Response example
```
{
  "data": board
  }
}
```
&nbsp;
#### GET /:category/count
해당 category 리스트의 전체 개수를 반환합니다.
- Path variable

| Key      | Value    |
|----------|----------|
| category | Category |

- Request example
```
GET /api/board/question/count
```
- Response example
```
{
  "data": number
}
```
&nbsp;
#### GET /api/all/best
좋아요가 많은 인기글을 반환합니다.
- Request example
```
GET /api/all/best
```
- Response example
```
{
  "data": board[]
}
```
&nbsp;
#### POST /api/board
새로운 리스트를 추가합니다.
- Request example
```
Headers
{
  "Authorization" : string
}

Body
{
  title: string,
  description: string,
  category: string,
}
```
- Response example
```
{
  "data": board
}
```
&nbsp;
#### POST /api/board/upload/image
이미즈를 업로드합니다.
- Request example
```
Headers
{
  "Authorization" : string,
  'Content-Type': 'multipart/form-data'
}

Body
{
  formData: FormData
}
```
- Response example
```
{
  url: string
}
```
&nbsp;
#### PUT /api/board/:boardId
해당 boardId를 수정합니다. 리스트는 본인이 소유하고 있어야합니다.
- Path variable

| Key      | Value  |
|----------|--------|
| boardId  | string |

- Request example
```
Headers
{
  "Authorization" : string
}

Body
{
  title: string,
  description: string,
}
```
- Response example
```
{
  data: Board
}
```
&nbsp;
#### DELETE /api/board/:boardId
자신이 작성한 리스트를 삭제합니다. 리스트는 본인이 소유하고 있어야합니다.
- Path variable

| Key      | Value  |
|----------|--------|
| boardId  | string |

- Request example
```
Headers
{
  "Authorization" : string
}
```
- Response example
```
{ message: "Delete successfully" }
```
&nbsp;
#### Comments
#### GET /api/comments/:boardId
해당 boardId의 댓글들을 가져옵니다.
- Path variable

| Key     | Value  |
|---------|--------|
| boardId | string |

- Request example
```
GET /api/comments/634321b5f7ca0ed123ac5ed3
```
- Response example
```
{
  "data": Comment[]
}
```
&nbsp;
#### POST /api/comment/:boardId
해당 boardId의 댓글을 추가합니다.
- Path variable

| Key     | Value  |
|---------|--------|
| boardId | string |

- Request example
```
Headers
{
	"Authorization" : string
}

Body
{
	"userId": string,
	"contents": "sry, I don`t know."
}
```
- Response example
```
{
  "data": Comment
}
```
&nbsp;
#### PUT /api/comment/:boardId/:commentId
해당 boardId의 댓글을 수정합니다.
- Path variable

| Key       | Value  |
|-----------|--------|
| boardId   | string |
| commentId | string |

- Request example
```
Headers
{
	"Authorization" : string
}

Body
{
	"userId": string,
	"contents": "sry, I don`t know."
}
```
- Response example
```
{
  "data": Comment
}
```
&nbsp;
#### DELETE /api/comment/:boardId/:commentId
해당 boardId의 댓글을 수정합니다.
- Path variable

| Key       | Value  |
|-----------|--------|
| boardId   | string |
| commentId | string |

- Request example
```
Headers
{
	"Authorization" : string
}
```
- Response example
```
{
  message: "Delete successfully"
}
```
&nbsp;
#### Likes
#### POST /:boardId
해당 boardId의 좋아요를 추가합니다..
- Path variable

| Key     | Value  |
|---------|--------|
| boardId | string |

- Request example
```
POST /api/likes/634321b5f7ca0ed123ac5ed3
```
- Response example
```
{
  "data": Boolean
}
```