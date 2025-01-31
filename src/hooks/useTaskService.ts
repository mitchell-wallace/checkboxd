import { useContext } from 'react';
import { TaskServiceContext } from '../contexts/taskServiceContextValue';

export const useTaskService = () => {
    const context = useContext(TaskServiceContext);
    if (!context) {
        throw new Error('useTaskService must be used within a TaskServiceProvider');
    }
    return context;
};
