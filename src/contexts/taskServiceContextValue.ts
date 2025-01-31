import { createContext } from 'react';
import TaskService from '../services/TaskService';

export const TaskServiceContext = createContext<TaskService | null>(null);
