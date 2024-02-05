import { LightningElement, track, wire } from 'lwc';
import getTasks from '@salesforce/apex/ToDoListController.getTasks';
import { refreshApex } from '@salesforce/apex';
import insertTask from '@salesforce/apex/ToDoListController.insertTask';
import deleteTask from '@salesforce/apex/ToDoListController.deleteTask';

export default class CustomTodo extends LightningElement {
    @track todoTasks = [];
    todoTasksResponse;
    processing = true;
    newTask = '';

    updateNewTask(event) {
        this.newTask = event.target.value;
    }

    addTaskToList() {
        if (this.newTask === '') {
            return;
        }

        this.processing = true;

        insertTask({ subject: this.newTask })
            .then(result => {
                console.log(result);
                const newTaskItem = {
                    id: this.todoTasks.length ? this.todoTasks[this.todoTasks.length - 1].id + 1 : 0,
                    name: this.newTask,
                    recordId: result.Id
                };
                this.todoTasks = [...this.todoTasks, newTaskItem];
                this.newTask = '';
                console.log(JSON.stringify(this.todoTasks));
            })
            .catch(error => console.log(error))
            .finally(() => (this.processing = false));
    }

    deleteTaskFromList(event) {
        const idToDelete = event.target.name;

        this.processing = true;

        const taskToDelete = this.todoTasks.find(task => task.id === idToDelete);

        if (taskToDelete) {
            deleteTask({ recordId: taskToDelete.recordId })
                .then(result => {
                    console.log(result);
                    if (result) {
                        this.todoTasks = this.todoTasks.filter(task => task.id !== idToDelete);
                    } else {
                        console.log('Unable to delete task');
                    }
                    console.log(JSON.stringify(this.todoTasks));
                })
                .catch(error => console.log(error))
                .finally(() => (this.processing = false));
        }
    }

    @wire(getTasks)
    getCustomTodoTasks(response) {
        this.todoTasksResponse = response;
        const { data, error } = response;

        if (data || error) {
            this.processing = false;
        }

        if (data) {
            console.log('data');
            console.log(data);
            this.todoTasks = data.map((task, index) => ({
                id: index + 1,
                name: task.Subject,
                recordId: task.Id
            }));
        } else if (error) {
            console.log('error');
            console.log(error);
        }
    }

    refreshCustomTodoList() {
        this.processing = true;
        refreshApex(this.todoTasksResponse)
            .finally(() => (this.processing = false));
    }
}
