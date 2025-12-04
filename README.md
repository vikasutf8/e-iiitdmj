# EShop
 <!-- npx nx reset cache -->

## SERVICES
```
nx g @nx/express:app product-service --directory=apps/product-service --e2eTestRunner=none
```
### 1. api-gateway
 - PORT: 8081
The API Gateway acts as a single entry point for all client requests.  
Instead of calling each microservice (Auth, Product, Order, Payment, etc.) directly on different ports or databases, clients interact with the gateway on a **single port (8081)**.  
The gateway then routes the request to the appropriate service.
#### Features
- **Single Entry Point** → All APIs are accessed via port `8081`.
- **Proxy Routing** → Routes requests to underlying services (e.g., Auth, Product).
- **Security & Checks** → Add authentication/authorization layers at the gateway.
- **Rate Limiting** → Prevents DDoS attacks using `express-rate-limit`.
- **API Documentation** → Auto-generated docs with `swagger-ui-express`.
#### Example
```bash
# Request hitting API Gateway (Port: 8081)
curl http://localhost:8081/auth
```

### 2. auth-service
 - PORT: 6001
The User Service handles **authentication & authorization** in the system.  
It provides endpoints for user registration, login, OTP-based verification, and password management.  
Internally, it integrates with **Redis** for OTP storage/cooldown and **templated emails** for verification.

#### Features
- **User Registration** with email + password
- **Email Verification** with OTP
- **User Login** with JWT tokens
- **Password Reset & Forgot Password Flow**
- **Redis Integration** → OTP & cooldown storage
- **Templated Emails** → Sent using Nodemailer + SMTP

#### Tech Stack
- **Node.js + Express.js**
- **Redis / Upstash** (for OTP, cooldown)
- **MongoDB** (for user data)
- **Nodemailer** (for emails)
- **ioredis** (client for Redis)


### api Resources
```
curl -X POST http://localhost:8081/api/v1/user-registration \
  -H "Content-Type: application/json" \
  -d '{
    "name": "test2",
    "email": "vikasarya1889@gmail.com",
    "password": "test1234567"
  }'
RESPONSE:-
{
  "status": "success",
  "message": "Otp sent successfully | Verify your account"
}
```
---
```
curl -X POST http://localhost:8081/api/v1/verify-user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "21bcs241@iiitdmj.ac.in",
    "otp": "5220",
    "name": "test2",
    "password": "test1234567"
  }'
RESPONSE:-
{
  "status": "success",
  "success": true,
  "message": "user registered successfully",
  "user": {
    "id": "68c30574a8ff65d4fb0d109",
    "email": "21bcs241@iiitdmj.ac.in",
    "password": "$2b$10$fFffyA0GpZKuepLDq0BPquemiYNKe0JayY/No9Rjof.1QPWbaMvPC",
    "name": "test2",
    "following": [],
    "createdAt": "2025-09-11T17:23:00.871Z",
    "updatedAt": "2025-09-11T17:23:00.871Z"
  }
}
```
---
```
curl -X POST http://localhost:8081/api/v1/login-user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "21bcs241@iiitdmj.ac.in",
    "password": "test1234567"
  }'

RESPONSE:
{
  "status": "success",
  "success": true,
  "message": "User logged in successfully",
  "user": {
    "id": "68c30574a8ff65d4fb0d109",
    "email": "21bcs241@iiitdmj.ac.in",
    "name": "test2"
  }
}
```

---
### Technologies used and its inner modules
 -npm i crypto. || now its in-built



 ### REFERENCES of DEBUGGING
 -Prisma Client
~ https://chatgpt.com/share/687931da-01ac-8001-90b3-6da6f9685ae8 ~


- Swagger
  "basePath": "/api",
   "/api/user-registration": 

  
### user-ui
- tanstack and react-query ::



# Some of the important things to note about the project
- as is using just  userData it move like this:
```bash
{
 name: string;
  email: string;  
  password: string;
}
```
- {...userData} is used to pass the data to the verifyOtpMutation
```bash

 name: string;
  email: string;  
  password: string;

```

### Seller-UI
POST: http://localhost:3000/api/v1/logged-in-seller
```
response:
{
    "status": "success",
    "success": true,
    "seller": {
        "id": "68cc39d073b1812806ec1e89",
        "name": "Vikas",
        "email": "21bcs241@iiitdmj.ac.in",
        "password": "$2b$10$p4tsYy0YCoCiG0COAhVT5elXTlc6vw9JM6XKLW9y9H6w/CfSyjbaK",
        "phone_number": "9983340124",
        "country": "AO",
        "stripeId": null,
        "createdAt": "2025-09-18T16:56:48.428Z",
        "updatedAt": "2025-09-18T16:56:48.428Z",
        "shopId": null,
        "shops": {
            "id": "68cc3a1973b1812806ec1e8a",
            "name": "shops1",
            "bio": "this is working of shops",
            "category": "furniture",
            "coverBanner": null,
            "address": "sector 45, Gurugram",
            "opening_hours": "Mon-Thr 4:45 PM",
            "website": "http://localhost.com",
            "socialLinks": [],
            "ratings": 0,
            "sellerId": "68cc39d073b1812806ec1e89",
            "createdAt": "2025-09-18T16:58:01.259Z",
            "updatedAt": "2025-09-18T16:58:01.259Z"
        }
    }
}

```

### Product Service

```js 
curl -X POST http://localhost:6002/products/api/v1/get-categories
```

 - Get discount-codes
 ```js
curl -X POST http://localhost:6002/products/api/v1/get-discount-code
```

- Create discount-codes
 ```js
curl -X POST http://localhost:6002/products/api/v1/create-discount-code \
  -H "Content-Type: application/json" \
  -d '{
    "public_name": "New discount code",
    "discountType": "percentage",
    "discountValue": 10,
    "discountCode": "new-code"
  }'
```

- Delete discount-codes
 ```js  
curl -X DELETE http://localhost:6002/products/api/v1/delete-discount-code/${discountId} \
  -H "Content-Type: application/json"
```