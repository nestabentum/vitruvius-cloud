FROM openjdk:17-jdk-slim

COPY ./target/org.eclipse.emfcloud.coffee.modelserver-0.8.0-SNAPSHOT-standalone.jar /target/modelserver.jar
COPY ./cloud-vsum /cloud-vsum

EXPOSE 8081

CMD [ "java", "-jar", "-Xdebug", "-Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=0.0.0.0:8000", "/target/modelserver.jar"]