import React, { createContext, useContext } from 'react';
import TaskService from '../services/TaskService';

const TaskServiceContext = createContext<TaskService | null>(null);

export const TaskServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const taskService = new TaskService();

    // Add three sample tasks
    taskService.createTask('Task 1');
    taskService.createTask('Task 2');
    taskService.createTask('Task 3');

    return (
        <TaskServiceContext.Provider value={taskService}>
            {children}
        </TaskServiceContext.Provider>
    );
};

export const useTaskService = () => {
    const context = useContext(TaskServiceContext);
    if (!context) {
        throw new Error('useTaskService must be used within a TaskServiceProvider');
    }
    return context;
};
