# Battleship

Battleship is a distributed web application based on the famous homonymous game. A user can register/login and play matches with other online players or 
with random players. During the match a player can also chat with the opponent. Finally, the home page also shows statistics about the best players and 
their ratio (wins-defeats).

The complete documentation is available [here](documentation.pdf).

(Repository for the distributed systems and middleware technologies' project)

## Goals are:
- Create a distributed web application
- Use an application server in order to make avaiable the service to the users 
  (in our case GlassFish(5.1.0) + MySQL(8.0.25) and MySQL-Connector(8.0.18))
- Use different technologies: EJB, JSP, servlet and filters
- Use the ERLANG funcional programming language

## Project structure:
 - `Battleship`: the Java(8) web application module with EJBs
 - `battleship_server_erlang`: the ERLANG web server module (Cowboy)

## Preview
![Alt Text](app_usage.gif)


