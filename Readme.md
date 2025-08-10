# Summary 

This project uses a monorepo setup with Nx to manage both the Frontend (Angular v18) and Backend (NestJS v11). It features a secure authentication flow with a user signup page, a signin page, a protected dashboard, and JWT token-based authentication. The responsive frontend is linked to a NoSQL database and communicates seamlessly with the backend for real-time data handling.

## Tech Stack:

* Frontend: Angular 
* Backend: NestJS
* Monorepo Setup: Nx (manage multiple projects in a single repository)
* Authentication: JWT-based authentication (secure token storage and validation)

## ⚙️ Backend (NestJS) Process
1. **User Registration/Signin**  
   - POST `/auth/signup` or `/auth/signin`  
   - The AuthService validates the user credentials and generates a JWT token upon successful authentication.  
   - Response: `{ access_token, user }`

2. **JWT Generation**  
    - The JWT token is generated using the JwtModule in NestJS.  
    - The token is signed with the secret key (JWT_SECRET_KEY) and has an expiry time of 8 hours.

3. **Protected Routes**  
   - `(JwtAuthGuard)` checks:  
    1. The JwtAuthGuard ensures that only authorized users can access protected routes (e.g., /dashboard)
    2. The guard checks for the presence of a valid JWT in the `Authorization: Bearer <token>` header
    3. If valid, the user is granted access to the route (/dashboared).

4. **Token Validation**  
   - `JwtStrategy` extracts token -> verifies signature -> checks expiry  
   - If valid, attaches user to `req.user`

## 🖥️ Frontend (Angular) Process

1. **Login**  
   - User submits signin form wich calls `AuthService.signin()`  
   - On success:  
     - Saves JWT to `localStorage`  
     - Redirects to `/dashboard`  

2. **Auto-Redirect**  
   - Signin page checks `localStorage` for valid JWT then redirects to dashboard if exists  

3. **API Calls**  
   - `AuthInterceptor` automatically adds `Authorization` header to all requests  

4. **Route Protection**  
   - The `AuthInterceptor` is responsible for attaching the JWT token to the Authorization header of all outgoing API requests.

5. **Logout**  
   - Clears `localStorage` -> redirects to signin  

## Key Security Files:

* `jwt.strategy.ts`: Validates JWT
* `auth.interceptor.ts`: Injects token into requests 
* `auth.guard.ts`: Protects Angular routes
* `auth.service.ts`: Handles login/logout state
* `validators.ts` : Filter user input

## 🛑 Environment Variables  

Ensure to set the following environment variables:

Create .env file in the path: `penny-co/backend`   

`.env.example` is created for refrence and docker use  

* **Backend (.env):**
- `MONGODB_URI`: URI for connecting to the MongoDB database cluster.
- `JWT_SECRET_KEY`: Secret key used for signing and verifying JWT tokens.

* **Frontend (environment.ts):**
- `environment.apiUrl`: The base URL for the backend API (e.g. http://localhost:3000/api).

## 🛠️ Setup Instructions:

1. Clone the repository:

```git clone <repo-url>```   
    
```cd penny-co```

2. Install dependencies for both frontend and backend using npx Nx:

```npx nx install```

3. Run the backend:

```npx nx serve backend```

4. Run the frontend:

```npx nx serve frontend```

Now you can access the frontend at http://localhost:4200 and the backend at http://localhost:3000

## 🐳 Setup With Docker:

1. Clone the repository:

```git clone <repo-url>```   
    
```cd penny-co```

2. Start Docker engine then:

```docker-compose up --build```

## Feutere Work:

1. Forgot Password Feature

    - Allow users to reset their password via email.
    - Implement a time-sensitive token to validate the reset request.

2. Deploy to Google Cloud Platform (GCP)

    - Deploy the frontend using Firebase Hosting or Google Cloud Storage.
    - Deploy the backend via Google Cloud Run or App Engine for managed, scalable hosting.
