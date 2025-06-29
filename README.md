# Todo App with Next.js, Tailwind CSS and MongoDB

This is a simple Todo application with user registration and login built with Next.js. Tasks are stored in MongoDB.

## Features

- User registration and authentication with JSON Web Tokens
- Create, toggle and delete todo items
- Styled with Tailwind CSS

## Setup

1. Install dependencies (requires internet access):
   ```bash
   npm install
   ```
2. Create a `.env.local` file and provide the following variables:
   ```env
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-secret
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000` in your browser.

Due to the environment used to create this repository, dependencies are not installed automatically.
