<p> eb init
eb create
eb deploy iapp </p>

<p>

						Project Run with Docker

1) First Create Docker configration file "Dockerfile" in project root according to server config.

EXPOSE 9000 


CMD [ "node", "server" ]

like "node server"  command for start node server

Note: Dockerfile setup on project root.

Second step

2) Open Docker software "Docker Quickstart Terminal"

Copy project path and paste in docker cmd screen

3) cd project path

Note: you can see list of project files in cmd screen

Now start Docker build

4) Create Docker Project Build

project name is "iapp"

Successfully built 6b8cf22753de

You can check images using "docker images"

Image Id : 6b8cf22753de

Now run docker 

docker run -d -p 9000:9000 --name running_new_container(projectname) projectname

docker run -d -p 9000:9000 --name iapp iapp

iapp already use

ok docker server already running iapp
first stop all containers

for check runnng proccess

docker ps

for stop

docker stop CONTAINER ID

Now i will try with

docker run -d -p 9000:9000 --name iapp iapp

iapp and iappnew images already created so thats why showing  Conflict message

finally "docker run -d -p 9000:9000 --name iappnew2 iapp"  run

now we run this project with port 9000 on docker default IP.

http://192.168.99.100:9000/


Note: if you are running on Windows, localhost will not work, you will need to navigate to http://<ip docker runs on>:8080/. The ip is usually displayed when Docker Quickstart Terminal first starts up.

We are working on window so thats why using <ip docker>

Thanks



</p>