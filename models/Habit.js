import mongoose from 'mongoose';

const HabitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide a name for this habit.'],
    maxlength: [100, 'Habit name cannot be more than 100 characters'],
  },
  
  completedDates: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.models.Habit || mongoose.model('Habit', HabitSchema);
