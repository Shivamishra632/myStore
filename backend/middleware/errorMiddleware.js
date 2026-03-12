// Custom error handling middleware

// 1️⃣ Not Found Middleware
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // pass to next middleware
};

// 2️⃣ General Error Handler
export const errorHandler = (err, req, res, next) => {
  // Use status code if set, otherwise 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode);
  res.json({
    message: err.message,
    // Only show stack trace in development
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};