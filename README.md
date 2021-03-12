# LION REAL ESTATE

![Lion Real Estate above the fold section](https://github.com/petruborta/developer-portfolio/blob/master/assets/images/lion-real-estate-720w.jpg?raw=true)

Real estate agency multi-page website.

## Table of contents

* [Demo](#demo)
* [Technologies](#technologies)
* [Setup](#setup)
* [Status](#status)
* [Inspiration](#inspiration)
* [Contact](#contact)

## Demo

Here is a working live demo: <https://lion-real-estate.com/>

## Technologies

* Development
  * [HTML](https://www.w3schools.com/html/)
  * [CSS](https://www.w3schools.com/css/)
  * [JavaScript](https://www.w3schools.com/js/)
  * [Realtor API](https://rapidapi.com/apidojo/api/realtor)
  * [D3.js](https://d3js.org/)
  * [AWS Lambda](https://aws.amazon.com/lambda/)
  * [AWS CloudFormation](https://aws.amazon.com/cloudformation/)
* Production / Hosting
  * [AWS S3](https://aws.amazon.com/s3/)
  * [AWS Route 53](https://aws.amazon.com/route53/)
  * [AWS CloudFront](https://aws.amazon.com/cloudfront/)
  * [ACM (Amazon Certificate Manager)](https://aws.amazon.com/certificate-manager/)

## Setup

* Follow the instructions of [this](https://github.com/petruborta/api-requests-dispatcher) repository to create a service for dispatching Realtor API requests
* Clone this repository to your local machine

  `$ git clone https://github.com/petruborta/real-estate-agency.git`

* Create `js/keys.js` and replace `"YOUR_SERVICE_ENDPOINT"` with your endpoint logged to the console after deploying the API

```javascript
export const DISPATCH_REALTOR_API_REQUESTS_API_ENDPOINT = "YOUR_SERVICE_ENDPOINT";
```

* In VS Code install _Live Server_ extension to view the project

## Status

Project is: functionally _finished_, but the code can be refactored in a more elegant manner

## Inspiration

Front-end design inspired by [Redfin](https://www.redfin.com/), [Zillow](https://www.zillow.com/), [Realtor](https://www.realtor.com/), [Trulia](https://www.trulia.com/) and [Century21](https://www.century21.com/)

## Contact

Created by [@petruborta](https://petruborta.com/) - feel free to contact me!
