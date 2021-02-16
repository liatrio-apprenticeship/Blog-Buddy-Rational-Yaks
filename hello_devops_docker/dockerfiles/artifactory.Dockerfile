FROM centos:7
#Install Artifactory
RUN yum -y install wget \
    && wget https://releases.jfrog.io/artifactory/artifactory-rpms/artifactory-rpms.repo -O jfrog-artifactory-rpms.repo \
    && mv jfrog-artifactory-rpms.repo /etc/yum.repos.d/ \
    && yum -y update \
    && yum -y install jfrog-artifactory-oss
EXPOSE 8081 8082
ENTRYPOINT ["/opt/jfrog/artifactory/app/bin/artifactory.sh"]
