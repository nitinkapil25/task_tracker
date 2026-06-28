import mongoose from 'mongoose';
import Task from '../models/Task.js';

const allowedSortFields = new Set(['createdAt', 'updatedAt', 'dueDate', 'title', 'priority']);

export async function getTasks(req, res, next) {
  try {
    const { status, priority, search, sort = 'createdAt', order = 'desc' } = req.query;
    const filter = {};

    if (status && status !== 'all') filter.status = status;
    if (priority && priority !== 'all') filter.priority = priority;
    if (search?.trim()) {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { title: { $regex: escaped, $options: 'i' } },
        { description: { $regex: escaped, $options: 'i' } },
      ];
    }

    const sortField = allowedSortFields.has(sort) ? sort : 'createdAt';
    const tasks = await Task.find(filter).sort({ [sortField]: order === 'asc' ? 1 : -1 });
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    next(error);
  }
}

export async function getTask(req, res, next) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
}

export async function createTask(req, res, next) {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
}

export async function updateTask(req, res, next) {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(req, res, next) {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
}

export function handleErrors(error, _req, res, _next) {
  if (error instanceof mongoose.Error.CastError) {
    return res.status(400).json({ success: false, message: 'Invalid task ID' });
  }

  if (error instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(error.errors).map((item) => item.message);
    return res.status(400).json({ success: false, message: errors[0], errors });
  }

  console.error(error);
  res.status(500).json({ success: false, message: 'Something went wrong on the server' });
}
