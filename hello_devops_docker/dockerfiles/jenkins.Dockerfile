FROM centos:7
#WORKING DIRECTORY
WORKDIR /working_dir
#Install dependencies for Jenkins
RUN yum -y update \
    && yum -y install java-1.8.0-openjdk-devel \
    && yum -y install wget \
    && yum -y install git \
    && wget https://get.jenkins.io/war-stable/2.263.2/jenkins.war \
    # For sonarqube's scanner
    && yum -y install unzip \
    && wget https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.6.0.2311-linux.zip \
    && unzip sonar-scanner-cli-4.6.0.2311-linux.zip \
    && mv sonar-scanner-4.6.0.2311-linux sonar-scanner \
    && rm sonar-scanner-cli-4.6.0.2311-linux.zip \
    #Non-privileged user
    && adduser appuser \
    && groupadd appgroup \
    && usermod -a -G appgroup appuser
ENV JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.275.b01-0.el7_9.x86_64
ENV PATH="/working_dir/sonar-scanner/bin:${PATH}"
USER appuser
#Expose network
EXPOSE 8080
#Entry
ENTRYPOINT ["java", "-jar", "jenkins.war"]
