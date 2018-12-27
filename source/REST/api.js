import { TOKEN, MAIN_URL } from '../REST'

const fetchTasks = async () => {    
    const response = await fetch(MAIN_URL, {
        method: 'GET',
        headers: {
            Authorization: TOKEN,
        },
    });
     
    const { data: tasks } = await response.json();
    return tasks;
};

const createTask = async (message) => {
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
};

const updateTask = async(params) => {
    const response = await fetch(MAIN_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: TOKEN,
        },
        body: JSON.stringify(params),
    });

    const { data: tasks } = await response.json(); 
    return tasks;
};

const removeTask = async(id) => {
    await fetch(`${MAIN_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: TOKEN,
        },
    });
    return;
};

const completeAllTasks = async(tasks) => {

    tasks.map((task) => { task.completed = true });

    tasks.forEach((item) => {
        fetch(MAIN_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: TOKEN,
            },
            body: JSON.stringify([item]),
        }) .then(response => response.json())
        .then((json) => {item = (json.data);});
    });  
     



    /* const response = await fetch(MAIN_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: TOKEN,
        },
        body: JSON.stringify(tasks),
    });

    const { data: tasks_new } = await response.json();
    return ta sks_new;*/
    
};

export const api = {
    fetchTasks:       fetchTasks,
    createTask:       createTask,
    updateTask:       updateTask,
    removeTask:       removeTask,
    completeAllTasks: completeAllTasks,
};
