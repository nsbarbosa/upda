import axios from "axios";
import MockAdapter from "axios-mock-adapter";

const api = axios.create({
  baseURL: "https://api.mock.com",
});

const mock = new MockAdapter(api);

mock.onPost("/login").reply((config) => {
  const { email, password } = JSON.parse(config.data);
  if (email === "teste@upda.com.br" && password === "123456") {
    return [
      200,
      {
        user: {
          id: 1,
          name: "Usuário upda",
          email: "teste@upda.com.brm",
        },
        token: "token",
      },
    ];
  } else {
    return [401, { message: "Credenciais inválidas" }];
  }
});

mock.onGet("/tasks").reply((config) => {
  const { inputFilter, concludedFilter } = config.params;
  const tasks = getTasksFromLocalStorage();
  const filteredTasks = tasks.filter(
    (task) =>
      (inputFilter === null ||
        task.title.toLowerCase().includes(inputFilter.toLowerCase()) ||
        task.description.toLowerCase().includes(inputFilter.toLowerCase())) &&
      (concludedFilter === null || task.concluded === concludedFilter)
  );
  const { page = 1, itemsPerPage = 5 } = config.params || {};

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedTasks = filteredTasks.slice(start, end);

  return [
    200,
    {
      tasks: paginatedTasks,
      total: filteredTasks.length,
      page: Number(page),
      itemsPerPage: Number(itemsPerPage),
    },
  ];
  return [200, filteredTasks];
});

mock.onPost("/task").reply((config) => {
  const data = JSON.parse(config.data);
  const task = data.data;
  task.id = Math.random().toString().split(".")[1];

  const tasks = getTasksFromLocalStorage();
  tasks.push(task);
  saveTasksToLocalStorage(tasks);

  return [200, { message: "Tarefa criada com sucesso", task }];
});

mock.onPut(/\/task\/\d+/).reply((config) => {
  const id = config.url?.match(/\/task\/(\d+)/)?.[1];
  const task = JSON.parse(config.data);

  const tasks = getTasksFromLocalStorage();
  const taskIndex = tasks.findIndex((task: any) => task.id === id);

  tasks[taskIndex] = { ...task.data };
  saveTasksToLocalStorage(tasks);

  return [200, { message: "Tarefa editada com sucesso", task }];
});

const getTasksFromLocalStorage = () => {
  const tasks = localStorage.getItem("tasks");
  return tasks ? JSON.parse(tasks) : [];
};

const saveTasksToLocalStorage = (tasks: any[]) => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

export default api;
