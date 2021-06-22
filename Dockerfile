FROM artifactory.service.anz:8116/puppeteer-ui-automation:2.0
# Sonar and fortify scanner
RUN mkdir -p /home/jenkins/
COPY sonar-scanner-3.3.0.1492-linux /home/jenkins/.sonar/native-sonar-scanner/sonar-scanner-3.3.0.1492-linux/
COPY HPE_Security_Fortify_SCA_and_Apps_17.20_linux_x64.run /home/jenkins/fortify/
COPY HPE_Security_Fortify_SCA_and_Apps_17.20_linux_x64.run.options /home/jenkins/fortify/
COPY fortify.license /home/jenkins/fortify/
COPY Rules_2018.04/*.bin /home/jenkins/fortify/Core/config/rules/
COPY Rules_2018.04/ExternalMetadata/* /home/jenkins/fortify/Core/config/ExternalMetadata/
RUN /home/jenkins/fortify/HPE_Security_Fortify_SCA_and_Apps_17.20_linux_x64.run --mode unattended
RUN npm install -g sonarqube-scanner
RUN chmod -R 775 /home/jenkins/
# Essential tools and xvfb
RUN apt-get update && apt-get install -y \
    software-properties-common \
    unzip \
    curl \
    xvfb

# Chrome browser to run the tests
RUN curl https://dl-ssl.google.com/linux/linux_signing_key.pub -o /tmp/google.pub \
    && cat /tmp/google.pub | apt-key add -; rm /tmp/google.pub \
    && echo 'deb http://dl.google.com/linux/chrome/deb/ stable main' > /etc/apt/sources.list.d/google.list \
    && mkdir -p /usr/share/desktop-directories \
    && apt-get -y update && apt-get install -y google-chrome-stable
# Disable the SUID sandbox so that chrome can launch without being in a privileged container
RUN dpkg-divert --add --rename --divert /opt/google/chrome/google-chrome.real /opt/google/chrome/google-chrome \
    && echo "#!/bin/bash\nexec /opt/google/chrome/google-chrome.real --no-sandbox --disable-setuid-sandbox \"\$@\"" > /opt/google/chrome/google-chrome \
    && chmod 755 /opt/google/chrome/google-chrome

RUN npm install -g node-gyp
RUN node-gyp install
RUN mkdir -p /test
WORKDIR /test
RUN npm install fibers
WORKDIR /test/node_modules/fibers
RUN node build
COPY chrome-driver /test/chrome-driver
COPY .npmrc /test/.npmrc
COPY prepare.sh /test
WORKDIR /test
