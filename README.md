# Task Manager Application

A full-stack task management application built with Node.js, Express, and MongoDB. This application allows users to create, manage, and track their tasks with authentication and real-time updates.

## Features

- User authentication (login/logout)
- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Responsive design
- Real-time updates
- Secure session management

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Google Cloud Platform account (for deployment)

## Local Development Setup

1. Clone the repository:
   ```bash
   git clone [your-repository-url]
   cd task-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Access the application at `http://localhost:3000`

## Project Structure

```
task-manager/
├── public/             # Static files and client-side code
├── routes/            # API route handlers
├── controllers/       # Business logic
├── models/           # Database models
├── middleware/       # Custom middleware
├── utils/            # Utility functions
├── db/               # Database connection
├── app.js           # Main application file
└── package.json     # Project dependencies
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/logout` - User logout

### Tasks
- `GET /api/v1/tasks` - Get all tasks
- `POST /api/v1/tasks` - Create a new task
- `PATCH /api/v1/tasks/:id` - Update a task
- `DELETE /api/v1/tasks/:id` - Delete a task

## Deployment to Google Cloud Run

1. Install Google Cloud SDK:
   - Follow the [official installation guide](https://cloud.google.com/sdk/docs/install)

2. Initialize Google Cloud:
   ```bash
   gcloud init
   ```

3. Build and deploy:
   ```bash
   gcloud run deploy task-manager \
     --source . \
     --region asia-south1 \
     --platform managed \
     --allow-unauthenticated
   ```

4. Set environment variables in Google Cloud Console:
   - Go to Cloud Run > task-manager > Edit
   - Add the following environment variables:
     - `MONGO_URI`
     - `JWT_SECRET`
     - `NODE_ENV=production`

```

## Security Considerations

- All API endpoints are protected with authentication
- Passwords are hashed using bcrypt
- JWT tokens are used for session management
- HTTPS is enforced in production
- Environment variables are used for sensitive data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request


## Support

For support, please open an issue in the GitHub repository or contact the maintainers. 