import { TOKEN, MAIN_URL } from '../REST'

export const api = {
    async fetchTasks () {    
        const response = await fetch(MAIN_URL, {
            method: 'GET',
            headers: {
                Authorization: TOKEN,
            },
        });
         
        const { data: tasks } = await response.json();
        return tasks;
    },

    async createTask (message) {
        const response = await fetch(MAIN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: TOKEN,
            },
            body: JSON.stringify({ 'message': message }),
        });
        
        const { data: task } = await response.json();       
        return task;
    },
    
    async updateTask (task_params) {
        const response = await fetch(MAIN_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: TOKEN,
            },
            body: JSON.stringify(task_params),
        });
    
        const { data: tasks } = await response.json(); 
        return tasks;
    },
    
    async removeTask (id) {
        await fetch(`${MAIN_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: TOKEN,
            },
        });
        return;
    },
    
    async completeAllTasks (tasks) {
        const promises = [];

        for (const task of tasks) {
            promises.push(
                fetch(MAIN_URL, {
                    method:  'PUT',
                    headers: {
                        Authorization:  TOKEN,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify([{ ...task, completed: true }]),
                }),
            );
        }

        const responses = await Promise.all(promises);

        const success = responses.every((result) => result.status === 200);

        if (!success) {
            throw new Error('Tasks were not completed');
        }
    },
};
