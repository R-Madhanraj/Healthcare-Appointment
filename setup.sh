
#!/bin/bash

# Define variables
PROJECT_DIR="/home/coder/project/workspace/question_generation_service/solutions/bf93bb56-478d-4052-9bd4-54978cc43c8b/springapp"
DATABASE_NAME="bf93bb56_478d_4052_9bd4_54978cc43c8b"

# Create Spring Boot project using Spring CLI
spring init \
  --type=maven-project \
  --language=java \
  --boot-version=3.4.0 \
  --packaging=jar \
  --java-version=17 \
  --groupId=com.examly \
  --artifactId=springapp \
  --name="Healthcare Appointment Management System" \
  --description="Spring Boot backend for Healthcare Appointment Management System" \
  --package-name=com.examly.springapp \
  --dependencies=web,data-jpa,validation,mysql,lombok \
  --build=maven \
  ${PROJECT_DIR}

# Wait for project creation to complete
sleep 2

# Create MySQL database
mysql -u root -pexamly -e "CREATE DATABASE IF NOT EXISTS ${DATABASE_NAME};" 2>/dev/null || echo "Database creation failed, will use default"

# Configure application.properties
cat > "${PROJECT_DIR}/src/main/resources/application.properties" << EOL
spring.datasource.url=jdbc:mysql://localhost:3306/${DATABASE_NAME}?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=examly
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Server configuration
server.port=8080
server.error.include-message=always
server.error.include-binding-errors=always

# Logging configuration
logging.level.org.springframework.web=INFO
logging.level.org.hibernate=ERROR
logging.level.com.examly=DEBUG
EOL

# Update pom.xml with additional dependencies if needed
sed -i '/<\/dependencies>/i \
    <dependency>\
        <groupId>org.springframework.boot</groupId>\
        <artifactId>spring-boot-starter-validation</artifactId>\
    </dependency>' "${PROJECT_DIR}/pom.xml"

echo "Spring Boot project created successfully in ${PROJECT_DIR}"
