# Heritage of Dorn/Esse/Baeuchel

This project visualises and document the heritage of the families Dorn, Esse and Baeuchel 


## Getting started

### Setup development environment

 - Get a cup a coffee or tea
 - Get some good synth pop music
 - Install latest nodejs 12 from https://nodejs.org/en/download/
 - Install docker engine to run docker container. https://docs.docker.com/get-docker/
 - Start PostGreSQL DB as docker container with 
    - ```cmd
      cd Deployment/local_dev && 
      docker-compose up
      ```
    - Load dummy data to Postgres

#### Project setup
 - Clone this project and checkout `develop` branch
 - Install frontend node modules with `npm i`
 - Install backend node modules with `cd server && npm i`
 - Install nodemo globaly `npm i -g nodemon`

## Next steps
 <!-- - [ ] Add redux to handle data -->
 - [ ] Add react router https://reactrouter.com/web/guides/quick-start
 - [ ] Add Error pages 
 - [ ] Edit person
 - [ ] Delete person
 - [ ] Add authentication system (read book about OpenID Connect and OAuth 2.0)

### UX stecific
- [x] Visualise a family tree
- [x] Document basic information about family members
- [ ] Document general images and mark family members on them
- [ ] Host family member images
- [ ] Add family members with their relation to existing members
- [x] Visual direct relation (Father/Mother/Children)
- [ ] Edit family member information

### Deployment specific
- [ ] Persist in database
- [ ] Ansible deployment



## Infrastructure


```plantuml

cloud 

```