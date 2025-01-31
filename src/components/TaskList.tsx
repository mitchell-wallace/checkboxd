import React, { useState, useEffect } from 'react';
import { List } from '@mui/material';
import TaskDisplaySingle from './TaskDisplaySingle';
import './TaskList.css';
import { TaskDataModel } from '../models/TaskDataModel';
import { useTaskService } from '../contexts/TaskServiceContext';

const TaskList: React.FC = () => {
    const taskService = useTaskService();
    const [tasks, setTasks] = useState<TaskDataModel[]>([]);

    useEffect(() => {
        setTasks(taskService.getTasks());
    }, [taskService]);

    const handleDelete = (task: TaskDataModel) => {
        taskService.deleteTask(task.id);
        setTasks(taskService.getTasks());
    };

    const handleToggle = (task: TaskDataModel) => {
        const updatedTask = { ...task, isDone: !task.isDone };
        taskService.updateTask(task.id, updatedTask);
        setTasks(taskService.getTasks());
    };

    return (
        <List className="task-list" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {tasks.map((task) => (
                <TaskDisplaySingle 
                    key={task.id}
                    task={task}
                    onDelete={handleDelete}
                    onToggle={handleToggle}
                />
            ))}
        </List>
    );
};

export default TaskList;
