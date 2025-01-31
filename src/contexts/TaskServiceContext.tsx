import React, { createContext, useContext, useMemo } from 'react';
import TaskService from '../services/TaskService';

const TaskServiceContext = createContext<TaskService | null>(null);

export const TaskServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const taskService = useMemo(() => {
        const service = new TaskService();
        service.createTask('Task 1');
        service.createTask('Task 2');
        service.createTask('Task 3');
        return service;
    }, []);

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
