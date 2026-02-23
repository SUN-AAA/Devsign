# Devsign

## Spring Initializr setting

1. Project : `Gradle - Groovy`
2. Language : `Java`
3. Spring Boot : `4.0.2`
4. Project Metadata
   - Group : `kr.co.devsign`
   - Artifact : `devsign-backend`
   - Name : `devsign-backend`
   - Description : `Demo project for Spring Boot`
   - Package name : `kr.co.devsign.devsign-backend`
   - Packaging : `Jar`
   - Configuration : `Properties`
   - Java : `21`

## How to run

### Frontend

**1. 레포 클론 및 경로 설정**

```
git clone https://github.com/SUN-AAA/Devsign
cd frontend
```

**2. 의존성 설치**

```
npm i
```

**3. 개발 서버 실행**

```
npm run dev
```

### Backend

**1. 레포 클론 및 경로 설정**

```
git clone https://github.com/SUN-AAA/Devsign
cd devsign-backend
```

**2. application.properties 설정 (DB 설정)**

- 사전에 MySQL 스키마 생성 필요

```
spring.application.name=devsign-backend

# DATABASE
spring.datasource.driver-class-name: com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/{DB 이름}?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Seoul&zeroDateTimeBehavior=convertToNull&rewriteBatchedStatements=true
spring.datasource.username={유저 이름}
spring.datasource.password={DB 비밀번호}

# JPA
spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.format_sql=true
```

**3. (선택)테스트 파일 실행**

`MemberInsertTest` 실행 (JUnit)

**4. 개발 서버 실행**

`DevsignBackendApplication` 실행

### Discord Bot

**1. 경로 이동**

```
cd discord-bot
```

**2. 의존성 설치**

```
python -m pip install discord.py fastapi "uvicorn[standard]"
```

**3. 봇 설정**

- https://hyungin0505.tistory.com/57 해당 링크의 블로그를 참고해 봇 제작 및 서버 연결
- `discordBot.py`에서 `TOKEN`, `GUILD_ID`, `LOG_CHANNEL_ID`를 실제 값으로 설정
- 여기서 `GUILD_ID`는 서버의ID, `LOG_CHANNEL_ID`는 봇 관련 채팅 채널의 ID로 설정
- `디스코드 설정 -> 고급 -> 개발자모드 ON`을 한 후 서버 또는 채팅 채널을 우클릭하면 "서버 ID 복사하기"가 있습니다. 이를 통해 필요한 ID를 가져오면 됩니다.
- 실제 동아리 서버로 테스트 하려면 형민선배님께 토큰이랑 id 받아서 테스트 하셔야 합니다!

**4. 실행**

```
python discordBot.py
```

## API Guide

- Base URL: `http://localhost:8080`
- Auth header: `Authorization: Bearer {token}`
- Content type: `application/json` (file upload는 `multipart/form-data`)

### Auth / Authorization

#### Public (no token)

- `POST /api/members/login`
- `POST /api/members/signup`
- `POST /api/members/discord-send`
- `POST /api/members/verify-code`
- `POST /api/members/find-discord-by-info`
- `POST /api/members/verify-id-pw`
- `PUT /api/members/reset-password-final`
- `GET /api/members/check/**`

#### Public GET

- `GET /api/posts/**`
- `GET /api/notices/**`
- `GET /api/events/**`

#### Admin only

- `ALL /api/admin/**` (`ROLE_ADMIN`)

#### Others

- 위에 해당하지 않는 API는 인증 필요

### Common Response (`StatusResponse`)

```json
{
  "status": "success|fail|error",
  "message": "optional"
}
```

### Members API (`/api/members`)

| Method | Path                         | Auth   | Request                     | Response                  |
| ------ | ---------------------------- | ------ | --------------------------- | ------------------------- |
| POST   | `/signup`                    | Public | `SignupRequest`             | `MemberResponse`          |
| GET    | `/all`                       | Auth   | -                           | `List<MemberResponse>`    |
| POST   | `/login`                     | Public | `LoginRequest`              | `LoginResponse`           |
| POST   | `/logout-log`                | Auth   | `LogoutLogRequest`          | `StatusResponse`          |
| PUT    | `/update/{loginId}`          | Auth   | `UpdateMemberRequest`       | `StatusResponse`          |
| PUT    | `/change-password/{loginId}` | Auth   | `ChangePasswordRequest`     | `StatusResponse`          |
| POST   | `/find-discord-by-info`      | Public | `FindDiscordByInfoRequest`  | `DiscordLookupResponse`   |
| POST   | `/verify-id-pw`              | Public | `VerifyIdPwRequest`         | `VerifyIdPwResponse`      |
| PUT    | `/reset-password-final`      | Public | `ResetPasswordFinalRequest` | `StatusResponse`          |
| GET    | `/check/{loginId}`           | Public | -                           | `boolean`                 |
| POST   | `/discord-send`              | Public | `SendDiscordCodeRequest`    | `SendDiscordCodeResponse` |
| POST   | `/verify-code`               | Public | `VerifyCodeRequest`         | `VerifyCodeResponse`      |

### Board API (`/api/posts`)

| Method | Path                                  | Auth   | Request                | Response             |
| ------ | ------------------------------------- | ------ | ---------------------- | -------------------- |
| GET    | `/`                                   | Public | -                      | `List<PostResponse>` |
| POST   | `/`                                   | Auth   | `CreatePostRequest`    | `PostResponse`       |
| GET    | `/{id}`                               | Public | -                      | `PostResponse`       |
| PUT    | `/{id}`                               | Auth   | `UpdatePostRequest`    | `PostResponse`       |
| DELETE | `/{id}`                               | Auth   | -                      | `StatusResponse`     |
| POST   | `/{id}/like`                          | Auth   | -                      | `PostResponse`       |
| POST   | `/{id}/comments`                      | Auth   | `CreateCommentRequest` | `PostResponse`       |
| DELETE | `/{postId}/comments/{commentId}`      | Auth   | -                      | `PostResponse`       |
| POST   | `/{postId}/comments/{commentId}/like` | Auth   | -                      | `PostResponse`       |

### Notice API (`/api/notices`)

| Method | Path        | Auth   | Request         | Response               |
| ------ | ----------- | ------ | --------------- | ---------------------- |
| GET    | `/`         | Public | -               | `List<NoticeResponse>` |
| GET    | `/{id}`     | Public | -               | `NoticeResponse`       |
| POST   | `/`         | Auth   | `NoticeRequest` | `NoticeResponse`       |
| PUT    | `/{id}`     | Auth   | `NoticeRequest` | `NoticeResponse`       |
| DELETE | `/{id}`     | Auth   | -               | `StatusResponse`       |
| PUT    | `/{id}/pin` | Auth   | -               | `NoticePinResponse`    |

### Event API (`/api/events`)

| Method | Path         | Auth   | Request        | Response              |
| ------ | ------------ | ------ | -------------- | --------------------- |
| GET    | `/`          | Public | -              | `List<EventResponse>` |
| GET    | `/{id}`      | Public | -              | `EventDetailResponse` |
| POST   | `/`          | Auth   | `EventRequest` | `EventResponse`       |
| PUT    | `/{id}`      | Auth   | `EventRequest` | `EventResponse`       |
| DELETE | `/{id}`      | Auth   | -              | `StatusResponse`      |
| POST   | `/{id}/like` | Auth   | -              | `EventLikeResponse`   |

### Assembly API (`/api/assembly`)

| Method | Path              | Auth | Request                          | Response                         |
| ------ | ----------------- | ---- | -------------------------------- | -------------------------------- |
| GET    | `/my-submissions` | Auth | query: `loginId, year, semester` | `MySubmissionsResponse`          |
| GET    | `/periods/{year}` | Auth | path: `year`                     | `List<SubmissionPeriodResponse>` |
| GET    | `/download`       | Auth | query: `path`                    | `byte[]`                         |
| POST   | `/project-title`  | Auth | `SaveProjectTitleRequest`        | `StatusResponse`                 |
| POST   | `/submit`         | Auth | `multipart/form-data`            | `SubmitFilesResponse`            |

#### Upload Rules (`/submit`)

- `presentation`: `.ppt`, `.pptx`만 허용
- `pdf`: `.pdf`만 허용
- `other`: 확장자 제한 없음
- `presentation/pdf/other` 중 최소 1개는 신규 업로드하거나 기존 저장 파일이 있어야 제출 가능

### Admin API (`/api/admin`, ROLE_ADMIN)

| Method | Path                    | Request                        | Response                              |
| ------ | ----------------------- | ------------------------------ | ------------------------------------- |
| GET    | `/members`              | -                              | `List<AdminMemberResponse>`           |
| GET    | `/members/deleted`      | -                              | `List<AdminMemberResponse>`           |
| GET    | `/logs`                 | -                              | `List<AccessLogResponse>`             |
| GET    | `/settings`             | -                              | `HeroSettingsResponse`                |
| POST   | `/settings`             | `HeroSettingsRequest`          | `StatusResponse`                      |
| GET    | `/periods/{year}`       | path: `year`                   | `List<AdminPeriodResponse>`           |
| GET    | `/periods/submissions`  | query: `year, semester, month` | `List<AdminPeriodSubmissionResponse>` |
| POST   | `/periods/save-all`     | `List<AdminPeriodSaveRequest>` | `StatusResponse`                      |
| POST   | `/periods/download-zip` | `AdminPeriodZipRequest`        | `byte[] (zip)`                        |
| GET    | `/sync-discord`         | -                              | `SyncDiscordResponse`                 |
| PUT    | `/members/{id}/suspend` | path: `id`                     | `StatusResponse`                      |
| POST   | `/members/restore`      | `RestoreMemberRequest`         | `StatusResponse`                      |
| DELETE | `/members/{id}`         | query: `hard=false`            | `StatusResponse`                      |
| POST   | `/verify-password`      | `AdminPasswordVerifyRequest`   | `StatusResponse`                      |

## Directory Structure

```text
Devsign_Backend/
├─ .idea/
├─ devsign-backend/
│  ├─ src/
│  │  ├─ main/
│  │  │  ├─ java/kr/co/devsign/devsign_backend/
│  │  │  │  ├─ config/
│  │  │  │  ├─ controller/
│  │  │  │  ├─ dto/
│  │  │  │  │  ├─ admin/
│  │  │  │  │  ├─ assembly/
│  │  │  │  │  ├─ board/
│  │  │  │  │  ├─ common/
│  │  │  │  │  ├─ event/
│  │  │  │  │  ├─ member/
│  │  │  │  │  └─ notice/
│  │  │  │  ├─ entity/
│  │  │  │  ├─ repository/
│  │  │  │  ├─ service/
│  │  │  │  └─ util/
│  │  │  └─ resources/
│  │  │     └─ application.properties
│  │  └─ test/
│  ├─ gradle/
│  ├─ build.gradle
│  ├─ settings.gradle
│  ├─ Dockerfile
│  ├─ gradlew
│  └─ gradlew.bat
├─ discord-bot/
│  └─ discordBot.py
├─ frontend/
│  ├─ src/
│  │  ├─ api/
│  │  ├─ assets/
│  │  ├─ components/
│  │  │  ├─ layout/
│  │  │  └─ ui/
│  │  ├─ hooks/
│  │  ├─ pages/
│  │  │  ├─ admin/
│  │  │  ├─ assembly/
│  │  │  ├─ auth/
│  │  │  ├─ board/
│  │  │  ├─ event/
│  │  │  ├─ home/
│  │  │  ├─ notice/
│  │  │  └─ profile/
│  │  ├─ store/
│  │  └─ utils/
│  ├─ .env
│  ├─ .env.production
│  └─ Dockerfile
├─ Caddyfile
├─ docker-compose.yml
└─ README.md
```

### Notes

- 업로드 파일은 `APP_UPLOAD_BASE_DIR` 설정값 기준 경로에 저장됩니다.
