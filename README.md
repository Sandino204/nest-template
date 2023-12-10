# Bank API

## Description
- An API that allows the creation of a user and authentication to access the API
- An User Can have more than One Account
- an API that allows the creation of an account of either a savings or current account type.
- an API that allows money in and out transactions, and their saving in the database, through the transaction route.
- The user can also use the API through the various filters it has

## Commands

### Test the API
```
    npm run test
```

### Run the API
```
    docker compose up
```

## Documentation

- http://localhost:3000/api

### Swagger link
- https://app.swaggerhub.com/apis/Sandino204/bank-api/1.0.0

### openApi yaml
- swagger.yaml in the project root has the yaml which was used to create the documentation in swaggerhub so it can be edited and used in other environments

## Use the API

- create a user POST /auth/signup
- create an account POST /account
- Create a transaction POST /transaction/:accountNumber
- Get all the transactions GET /transaction/:accountNumber