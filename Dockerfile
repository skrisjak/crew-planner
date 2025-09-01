FROM node:20 AS frontend-builder
WORKDIR /app
COPY frontend/ ./frontend
WORKDIR /app/frontend
ARG REACT_APP_URL
ENV REACT_APP_URL=$REACT_APP_URL
RUN npm install && rm -rf build && npm run build

FROM maven:3.9-eclipse-temurin-19 AS backend-builder
WORKDIR /app
COPY backend/ ./backend
COPY --from=frontend-builder /app/frontend/build /app/backend/src/main/resources/static
WORKDIR /app/backend
RUN mvn clean package -DskipTests

FROM eclipse-temurin:19-jre
WORKDIR /app

COPY --from=backend-builder /app/backend/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "-Xmx512m","app.jar"]
