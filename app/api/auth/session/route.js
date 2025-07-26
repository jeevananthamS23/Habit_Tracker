import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { getUserIdFromSession } from '../../../../lib/auth';

export async function GET(req) {
  await dbConnect();

  try {
    const userId = getUserIdFromSession(req);

    if (!userId) {
      return new Response(JSON.stringify({ message: 'No active session' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const user = await User.findById(userId).select('-password'); 
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      message: 'Session active',
      user: { id: user._id, name: user.name, email: user.email },
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Session API error:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
