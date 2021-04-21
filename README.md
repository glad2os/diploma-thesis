## Degree work

Development of a web application for instant messaging via the Internet/Intranet on the Electron platform using
JavaScript language  

### Reverse proxy  

![alt text][guide]  

[guide]: guide.png "JopaScript"


### NGINX Reverse Proxy

```nginx
location / {
  proxy_pass http://localhost:8080;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Nginx-Proxy true;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "Upgrade";
  proxy_set_header Host $host;
  client_max_body_size 100M;
}
```

### Run as container

```
docker build -t gladdos/wtchat
docker run --name wtchat -p 8080:8080 -d gladdos/wtchat
```

Yours application will be available at the next url: http://localhost:8080/