// App code
const ADD_TODO = "ADD_TODO";
const REMOVE_TODO = "REMOVE_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const ADD_GOAL = "ADD_GOAL";
const REMOVE_GOAL = "REMOVE_GOAL";

// generate uniq id
function generateId() {
  return (
    Math.random().toString(36).substring(2) + new Date().getTime().toString(36)
  );
}

// create action creator
function addTodoAction(todo) {
  return {
    type: ADD_TODO,
    todo,
  };
}

function removeTodoAction(id) {
  return {
    type: REMOVE_TODO,
    id,
  };
}

function toggleTodoAction(id) {
  return {
    type: TOGGLE_TODO,
    id,
  };
}

function addGoalAction(goal) {
  return {
    type: ADD_GOAL,
    goal,
  };
}

function removeGoalAction(id) {
  return {
    type: REMOVE_GOAL,
    id,
  };
}

// todos reducer
function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [...state, ...[action.todo]];

    case REMOVE_TODO:
      return state.filter((todo) => todo.id !== action.id);

    case TOGGLE_TODO:
      return state.map((todo) =>
        todo.id !== action.id
          ? todo
          : Object.assign({}, todo, { complete: !todo.complete })
      );

    default:
      return state;
  }
}

// goals reducer
function goals(state = [], action) {
  switch (action.type) {
    case ADD_GOAL:
      return [...state, ...[action.goal]];
    case REMOVE_GOAL:
      return state.filter((goal) => goal.id !== action.id);
    default:
      return state;
  }
}

const checker = (store) => (next) => (action) => {
  if (
    action.type == ADD_TODO &&
    action.todo.name.toLowerCase().includes("bitcoin")
  ) {
    return alert('Nope. That"s a bad idea');
  }

  if (
    action.type == ADD_GOAL &&
    action.goal.name.toLowerCase().includes("bitcoin")
  ) {
    return alert('Nope. That"s a bad idea');
  }
  return next(action);
};

const logger = (store) => (next) => (action) => {
  console.group(action.type);
  console.log("The action", action);
  // const result = next(action)
  console.log("The new state: ", store.getState())
  // console.log("The new state: ", store.getState())
  console.groupEnd();
};

const store = Redux.createStore(
  Redux.combineReducers({
    //     todos: todos(state.todos, action),
    todos,
    //     goals: goals(state.goals, action),
    goals,
  }),
  Redux.applyMiddleware(checker,logger)
);

store.subscribe(() => {
  // console.log("The new state is: ", store.getState());
  const { goals, todos } = store.getState();

  document.getElementById("todos").innerHTML = "";
  document.getElementById("goals").innerHTML = "";

  todos.forEach(addTodoToDom);
  goals.forEach(addGoalToDom);
});

function addTodo() {
  const input = document.getElementById("todo");
  const name = input.value;
  input.value = "";

  store.dispatch(
    addTodoAction({
      id: generateId(),
      name,
      complete: false,
    })
  );
}

function addGoal() {
  const input = document.getElementById("goal");
  const name = input.value;
  input.value = "";

  store.dispatch(
    addGoalAction({
      id: generateId(),
      name,
    })
  );
}

document.getElementById("todoBtn").addEventListener("click", addTodo);
document.getElementById("goalBtn").addEventListener("click", addGoal);

function createRemoveBtn(onClick) {
  const removeBtn = document.createElement("button");
  removeBtn.innerHTML = "X";
  removeBtn.addEventListener("click", onClick);
  return removeBtn;
}

function addTodoToDom(todo) {
  const node = document.createElement("li");
  const text = document.createTextNode(todo.name);
  const RemoveBtn = createRemoveBtn(() => {
    store.dispatch(removeTodoAction(todo.id));
  });

  node.appendChild(text);
  node.appendChild(RemoveBtn);

  node.style.textDecoration = todo.complete ? "line-through" : "none";
  node.addEventListener("click", () => {
    store.dispatch(toggleTodoAction(todo.id));
  });

  document.getElementById("todos").appendChild(node);
}

function addGoalToDom(goal) {
  const node = document.createElement("li");
  const text = document.createTextNode(goal.name);
  const RemoveBtn = createRemoveBtn(() => {
    store.dispatch(removeGoalAction(goal.id));
  });

  node.appendChild(text);
  node.appendChild(RemoveBtn);

  document.getElementById("goals").appendChild(node);
}
