import dbConnect from '../../../../lib/mongodb'; // Adjust path as necessary
import User from '../../../../models/User'; // Adjust path as necessary
import { generateSessionCookie } from '../../../../lib/auth'; // Import the new utility

/**
 * Handles POST requests for user login.
 * Connects to the database, authenticates the user, and sets a session cookie.
 * @param {Request} req - The Next.js request object.
 * @returns {Response} The Next.js response object.
 */
export async function POST(req) {
  await dbConnect(); // Connect to MongoDB

  try {
    const { email, password } = await req.json();

    // Basic validation
    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'Please enter all fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Compare provided password with hashed password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate the session cookie string
    const sessionCookie = generateSessionCookie(user._id.toString());

    // Create the response and set the 'Set-Cookie' header
    const response = new Response(JSON.stringify({
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email },
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': sessionCookie, // Set the cookie here
      },
    });

    return response;

  } catch (error) {
    console.error('Login API error:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
