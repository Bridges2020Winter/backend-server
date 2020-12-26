# Bridge Backend
Repository for bridge's backend. 

# Link
http://bridge-backend.azurewebsites.net/

# API ENDPOINTS
1. __Part 1__: Signup with first name, last name, email, and password (part 2 is with/without the group code)
```
POST /accounts/signup

HTTP Body:
{
    "firstName": "Isaac",
    "lastName: "Newton",
    "email": "isaacnewton@gmail.com",
    "password: "abcdefg123",
}

Status Codes:
200 - Account has been created
409 - Duplicate email in database
500 - General error (error will be sent back in response)
```

2. __Part 2__ Add user information (This part needs the group code)
```
POST /accounts/signup/information

HTTP Body:
{
    "email": "isaacnewton@gmail.com"    //string
    "password": "abcdefg123"            //string
    "research" true                     //bool (determines if user is research participant)
    "code": "f1230",                    //string (only applicable if user is research participant)
    "dob": "06.23.2001",                //string
    "weight": 50,                       //double
    "smoke": true,                      //boolean
    "ethnicity": "White"                //string
    "sex": "male"                       //string
    "diabetes": true                    //boolean
    "status": "student"                 //string
    "calorieGoal" : 123.4               //double
    "weightManagementGoal": 40          //double
    "activityLevel": 30                 //double
    "country": "Japan"                  //string
    "height": 20                        //double
}

Status Codes:
200 - Information has been added
500 - General error (error will be sent back in response)
```

3.  __Institution__ Institution add patient detail
```
POST /institutionDashboard/addPatient

~ If sucessfully added, returns the group code

HTTP Body:
{
    "firstName": "Isaac",               //string
    "lastName: "Newton",                //string
    "institutionName": "HospitalABC",   //string
}

Status Codes:
200 - Patient sucessfully added to database. Also returns unique code.
500 - General error (error will be sent back in response)
```

4. __Part 4__ Insert food into food diary
```
HTTP Body:
{
    "email": "newton@gmail.com",        //string
    "password: "abcdefg123",            //string
    "servingSize": 2                    //double
    "cholesterol: 20,                   //double
    "fat": 30,                          //double
    "carbohydrates": 40,                //double
    "sodium": 90,                       //double
}
```
## Installation
```
~ npm install
```

## Starting the backend server
```
~ npm start
```
