import dbConnect from '../../../../lib/mongodb'; 
import Habit from '../../../../models/Habit'; 
import { getUserIdFromSession } from '../../../../lib/auth'; 


export async function GET(req, { params }) {
  await dbConnect();
  const { id } = params;
  const userId = getUserIdFromSession(req);

  if (!userId) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const habit = await Habit.findOne({ _id: id, userId });

    if (!habit) {
      return new Response(JSON.stringify({ message: 'Habit not found or not authorized' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ habit }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('GET habit by ID API error:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params;
  const userId = getUserIdFromSession(req);

  if (!userId) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const { name, completedDates } = body;
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (completedDates !== undefined) updateFields.completedDates = completedDates;

    if (Object.keys(updateFields).length === 0) {
      return new Response(JSON.stringify({ message: 'No fields provided for update' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const habit = await Habit.findOneAndUpdate(
      { _id: id, userId },
      updateFields,
      { new: true, runValidators: true } 
    );

    if (!habit) {
      return new Response(JSON.stringify({ message: 'Habit not found or not authorized' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Habit updated successfully', habit }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('PUT habit by ID API error:', error);
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


export async function DELETE(req, { params }) {
  await dbConnect();
  const { id } = params;
  const userId = getUserIdFromSession(req);

  if (!userId) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const deletedHabit = await Habit.findOneAndDelete({ _id: id, userId });

    if (!deletedHabit) {
      return new Response(JSON.stringify({ message: 'Habit not found or not authorized' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Habit deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('DELETE habit by ID API error:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
