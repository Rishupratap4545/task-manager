const form = document.querySelector("form");
const taskInput = document.getElementById("task");
const priorityInput = document.getElementById("priority");
const dueDateInput = document.getElementById("due-date");

const taskSection = document.querySelectorAll("main > section")[3];
const filterSection = document.querySelectorAll("main > section")[2];

const totalTasks = document.querySelectorAll("main > section")[0].querySelectorAll("div")[0].querySelector("p");
const pendingTasks = document.querySelectorAll("main > section")[0].querySelectorAll("div")[1].querySelector("p");
const completedTasks = document.querySelectorAll("main > section")[0].querySelectorAll("div")[2].querySelector("p");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateDashboard() {
    totalTasks.textContent = tasks.length;
    pendingTasks.textContent = tasks.filter(task => !task.completed).length;
    completedTasks.textContent = tasks.filter(task => task.completed).length;
}

function renderTasks(filter = "all") {
    taskSection.innerHTML = "";

    let filteredTasks = tasks;

    if (filter === "pending") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (filter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {
        const article = document.createElement("article");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            updateDashboard();
            renderTasks(filter);
        });

        const title = document.createElement("h3");
        title.textContent = task.name;

        const priority = document.createElement("p");
        priority.textContent = "Priority: " + task.priority;

        const dueDate = document.createElement("p");
        dueDate.textContent = "Due Date: " + task.dueDate;

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";

        editButton.addEventListener("click", () => {
            const newName = prompt("Enter new task name:", task.name);

            if (newName && newName.trim() !== "") {
                task.name = newName.trim();
                saveTasks();
                renderTasks(filter);
            }
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter(item => item.id !== task.id);
            saveTasks();
            updateDashboard();
            renderTasks(filter);
        });

        article.appendChild(checkbox);
        article.appendChild(title);
        article.appendChild(priority);
        article.appendChild(dueDate);
        article.appendChild(editButton);
        article.appendChild(deleteButton);

        taskSection.appendChild(article);
    });
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = taskInput.value.trim();
    const priority = priorityInput.value;
    const dueDate = dueDateInput.value;

    if (name === "" || dueDate === "") {
        alert("Please enter task name and due date.");
        return;
    }

    const newTask = {
        id: Date.now(),
        name: name,
        priority: priority,
        dueDate: dueDate,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    updateDashboard();
    renderTasks();

    form.reset();
});

const filterButtons = filterSection.querySelectorAll("button");

filterButtons[0].addEventListener("click", () => {
    renderTasks("all");
});

filterButtons[1].addEventListener("click", () => {
    renderTasks("pending");
});

filterButtons[2].addEventListener("click", () => {
    renderTasks("completed");
});

updateDashboard();
renderTasks();