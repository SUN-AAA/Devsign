# Devsign_Backend

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
git clone https://github.com/SUN-AAA/Devsign_Backend
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
git clone https://github.com/SUN-AAA/Devsign_Backend
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