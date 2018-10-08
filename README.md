# <img src="https://github.com/Chungzilla/parkner/blob/master/app/assets/images/parkner_p.PNG" width="48"> Parkner
[![forthebadge](https://forthebadge.com/images/badges/made-with-ruby.svg)](https://forthebadge.com) 
[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)

Parkner is an app that will remind a user when to move their car in order to avoid getting a ticket.

## How Does It Work
<img src="https://media.giphy.com/media/k6NCuY77bCFU6ZQTZF/giphy.gif">

Parkner uses the built-in HTML Geolocation feature to grab a user's current location. Then, the [Coord Curb API](https://coord.co/docs/searchcurbs) is used to take the location coordinates and parse it into ledgible, plain pieces of an address string. 

A user can sign up for an account and store one or multiple cars and create parking sessions. When parking their car, a user can set an email reminder to notify them 15 mintues to an hour prior to when the parking regulation expires to avoid getting a ticket.

## Getting Started

### Installation
In order to install the app, you will need the latest version of Ruby installed onto your local machine. This app also uses a PostgreSQL object-relational database.

### Site Demo
I encourage you to test out the site! You can either sign up and create your own account, or login to a demo account [here](http://www.rocky-journey-32777.herokuapp.com/) using the following credtials:

```
Email: demo@parkner.com

Password: password
```

#### Please Note

<img src="https://media.giphy.com/media/VYYVEWEeSdYwo/giphy.gif">

Currently, the location services used only pulls data for New York City and California. While the rest of the app will still function, you will only be able to view the map if you are physically located in those two areas.

## Built With
- [Geolocation](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) - HTML API used to grab user's current location
- [Coord](https://coord.co/docs/searchcurbs) - modern RESTful API used to collect parking regulations data
- [Geocodio](https://www.geocod.io/) - parses latitude and longitude coordinates into address stings
- [Ruby](https://www.ruby-lang.org/en/) - programming lanuguage used 
- [Rails](https://rubyonrails.org/) - domain-specific languange and Ruby gem
- [Devise](https://github.com/plataformatec/devise) - comprehensive authentication solution used to ensure data integrity
- [Bootstrap](https://github.com/twbs/bootstrap-rubygem) - front-end framework for styling
- [PostgreSQL](https://www.postgresql.org/) - relational database structure

## Authors
- [**Lillian Ngo**](https://github.com/ngolilli94) - **Project Lead** - Database structure, design, and user flow
- [**Jazmine Chung**](https://github.com/chungzilla) - **Team Member** - Authentication/data integrity, design, database structure, and user flow
- [**Jorge Navarro**](https://github.com/Jnavarr56) - **Team Member** - JavaScript GPS algorithm, ActiveJob email system, design, and user flow
- [**Ben Wexler**](https://github.com/benjwexler) - **Team Member** - Database design, Routing, Mobile responsiveness, ActiveJob email system, design, and user flow
