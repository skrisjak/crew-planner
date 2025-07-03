FROM node:20 AS frontend-builder
WORKDIR /app
COPY frontend/ ./frontend
WORKDIR /app/frontend
RUN npm install && npm run build

FROM maven:3.9-eclipse-temurin-19 AS backend-builder
WORKDIR /app
COPY backend/ ./backend
WORKDIR /app/backend
RUN mvn clean package -DskipTests

FROM eclipse-temurin:19-jdk
WORKDIR /app

COPY --from=backend-builder /app/backend/target/*.jar app.jar

COPY --from=frontend-builder /app/frontend/build /app/static

ENTRYPOINT ["java", "-jar", "app.jar"]
