import React, { useState, useEffect } from 'react';
import { List, ListItem } from '@mui/material';
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

    return (
        <List className="task-list" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {tasks.map((task) => (
                <ListItem key={task.id} className="task-list-item" style={{ width: '100%' }}>
                    <TaskDisplaySingle task={task} style={{ width: '100%' }} onDelete={handleDelete} />
                </ListItem>
            ))}
        </List>
    );
};

export default TaskList;
