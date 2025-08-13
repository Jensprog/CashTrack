/**
 * @file API response utilities
 *
 * Helper functions to standardize API responses across the application.
 * Provides consistent formatting for both success and error responses.
 */
import { NextResponse } from 'next/server';

/**
 * Success response function
 * @param {object} data - The data to return
 * @param {string} message - Success message
 * @param {number} status - HTTP status code (default is 200)
 * @return {NextResponse} - Formatted success response
 */
export function successResponse(data = {}, message = 'Framgångsrikt', status = 200) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status },
  );
}

/**
 * Error response function
 * @param {Error} error - The error object
 * @returns {NextResponse} - Formatted error response with status code
 */
export function errorResponse(error) {
  console.error(`API Error: ${error.message}`, error);

  // Status code from the error or if unknown, default to 500
  const statusCode = error.statusCode || 500;

  // Generic message to avoid leaking sensitive information
  const message = statusCode < 500 ? error.message : 'Ett internt serverfel har inträffat.';

  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status: statusCode },
  );
}
