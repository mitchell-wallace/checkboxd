import React, { useMemo } from 'react';
import TaskService from '../services/TaskService';
import { TaskServiceContext } from './taskServiceContextValue';

export const TaskServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const taskService = useMemo(() => new TaskService(), []);

    return (
        <TaskServiceContext.Provider value={taskService}>
            {children}
        </TaskServiceContext.Provider>
    );
};
