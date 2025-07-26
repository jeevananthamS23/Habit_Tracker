import dbConnect from '../../../lib/mongodb'; 
import Habit from '../../../models/Habit'; 
import { getUserIdFromSession } from '../../../lib/auth'; 

export async function GET(req) {
  await dbConnect();

  const userId = getUserIdFromSession(req);

  if (!userId) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    
    const habits = await Habit.find({ userId }).sort({ createdAt: -1 }); 

    return new Response(JSON.stringify({ habits }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('GET habits API error:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(req) {
  await dbConnect();

  const userId = getUserIdFromSession(req);

  if (!userId) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { name } = await req.json();

    if (!name) {
      return new Response(JSON.stringify({ message: 'Habit name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const habit = await Habit.create({
      userId,
      name,
      completedDates: [], 
    });

    return new Response(JSON.stringify({ message: 'Habit created successfully', habit }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('POST habit API error:', error);
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
