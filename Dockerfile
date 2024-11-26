FROM cimg/base:stable

COPY talk.sh /talk.sh
EXPOSE 4000
EXPOSE 5000

ENTRYPOINT [ "/talk.sh" ]