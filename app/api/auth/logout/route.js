import { generateClearSessionCookie } from '../../../../lib/auth'; // Import the new utility

/**
 * Handles POST requests for user logout.
 * Clears the session cookie.
 * @param {Request} req - The Next.js request object.
 * @returns {Response} The Next.js response object.
 */
export async function POST(req) {
  try {
    // Generate the cookie string to clear the session
    const clearCookie = generateClearSessionCookie();

    const response = new Response(JSON.stringify({ message: 'Logout successful' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': clearCookie, // Set the cookie here
      },
    });

    return response;
  } catch (error) {
    console.error('Logout API error:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
