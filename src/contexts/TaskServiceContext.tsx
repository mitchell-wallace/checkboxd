import React, { useMemo } from 'react';
import TaskService from '../services/TaskService';
import { TaskServiceContext } from './taskServiceContextValue';

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
