import dbConnect from '../../../../lib/mongodb'; // Adjust path as necessary
import User from '../../../../models/User'; // Adjust path as necessary
import { generateSessionCookie } from '../../../../lib/auth'; // Import the new utility

export async function POST(req) {
  await dbConnect(); 

  try {
    const { name, email, password } = await req.json();


    if (!name || !email || !password) {
      return new Response(JSON.stringify({ message: 'Please enter all fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: 'User with this email already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }


    const user = await User.create({ name, email, password });


    const sessionCookie = generateSessionCookie(user._id.toString());

    
    const response = new Response(JSON.stringify({
      message: 'Signup successful',
      user: { id: user._id, name: user.name, email: user.email },
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': sessionCookie, 
      },
    });

    return response;

  } catch (error) {
    console.error('Signup API error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return new Response(JSON.stringify({ message: messages.join(', ') }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
