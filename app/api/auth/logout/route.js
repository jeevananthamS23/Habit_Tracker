import { clearSessionCookie } from '../../../../lib/auth'; // Import session utility

/**
 * Handles POST requests for user logout.
 * Clears the session cookie.
 * @param {Request} req - The Next.js request object.
 * @returns {Response} The Next.js response object.
 */
export async function POST(req) {
  try {
    const response = new Response(JSON.stringify({ message: 'Logout successful' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    clearSessionCookie(response); // Clear the session cookie

    return response;
  } catch (error) {
    console.error('Logout API error:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
