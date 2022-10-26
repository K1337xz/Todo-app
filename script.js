//theme switcher
const dataTheme = document.querySelector("html");
const switchTheme = document.querySelector(".switchTheme");

switchTheme.addEventListener("click", () => {
	localStorage.setItem(
		"data-theme",
		`${switchTheme.classList.contains("moon")}`
	);
	let darkMode = JSON.parse(localStorage.getItem("data-theme"));
	if (darkMode === true) {
		dataTheme.setAttribute("data-theme", `dark`);
		switchTheme.classList.remove("moon");
		switchTheme.classList.add("sun");
	} else if (darkMode === false) {
		dataTheme.setAttribute("data-theme", `light`);
		switchTheme.classList.remove("sun");
		switchTheme.classList.add("moon");
	}
	console.log(dataTheme);
});

//local theme
window.addEventListener("load", () => {
	let darkMode = JSON.parse(localStorage.getItem("data-theme"));
	if (darkMode === true) {
		dataTheme.setAttribute("data-theme", `dark`);
		switchTheme.classList.remove("moon");
		switchTheme.classList.add("sun");
	} else if (darkMode === false) {
		dataTheme.setAttribute("data-theme", `light`);
		switchTheme.classList.remove("sun");
		switchTheme.classList.add("moon");
	}
});

//add items to ToDolist
const items = JSON.parse(localStorage.getItem("items")) || [];
const itemList = document.querySelector(".todoList");
const addItems = document.querySelector(".addTodo");
const circle = document.querySelector(".inputCircle");
/* const addItems = document.querySelector(".add_items"); */

function addItem(e) {
	e.preventDefault();
	const text = addItems.value;
	if (e.key === `Enter` && text.length > 0) {
		const item = {
			text,
			done: false,
		};
		items.push(item);
		todoList(items, itemList);
		localStorage.setItem("items", JSON.stringify(items));
		addItems.value = ``;
		this.reset();
	} else {
		return;
	}
}
function todoList(todo = [], listTodo) {
	listTodo.innerHTML = todo
		.map((list, i) => {
			return `
        <li class="${
			list.done ? "checkedInp" : "unchecked"
		}" draggable="true" ondragstart="dragStart(event)" ondragend='dragEnd(event)'value="${i}" id="drag">
            <input type="checkbox" data-index=${i} id="item${i}" name="checks" ${
				list.done ? "checked" : ""
			}/>
            <label for="item${i} ">${list.text}</label>
			<span class="deleteTodo" data-index="${i}" onclick="deleteTodos(id)" id="it${i}"></span>
			</li>
        `;
		})
		.join("");
	todoCounter();
}

function toggleDone(e) {
	if (!e.target.matches("input")) return;
	const el = e.target;
	const index = el.dataset.index;
	items[index].done = !items[index].done;
	localStorage.setItem("items", JSON.stringify(items));
	todoList(items, itemList);
	todoCounter();
}

//show completed todo`s
const completed = document.querySelector(".showCompleted");
const checkedInp = document.getElementsByName("checks");
function completedTodos(e) {
	for (let i = 0; i < checkedInp.length; i++) {
		if (!checkedInp[i].checked) {
			checkedInp[i].parentNode.style.display = `none`;
		} else if (checkedInp[i].checked) {
			checkedInp[i].parentNode.style.display = ``;
		}
	}
	e.preventDefault();
}

//show all todo`s
const allTodos = document.querySelector(".showAll");
function showAll(e) {
	for (let j = 0; j < checkedInp.length; j++) {
		checkedInp[j].parentNode.style.display = `flex`;
	}
}
//show active todo's
const activeTrigger = document.querySelector(".showActive");
function showActive(e) {
	for (let z = 0; z < checkedInp.length; z++) {
		if (checkedInp[z].checked) {
			checkedInp[z].parentNode.style.display = `none`;
		} else if (!checkedInp[z].checked) {
			checkedInp[z].parentNode.style.display = ``;
		}
	}
	e.preventDefault();
}
//items left
const itemLeft = document.querySelector(".itemsLeft");
function todoCounter(e) {
	const uncheck = itemList.querySelectorAll(".unchecked");
	itemLeft.innerHTML = `${uncheck.length} items left`;
}
//clear complete todo`s
const clearCompleted = document.querySelector(".clearCompleted");
function clearCompletedTodo() {
	let itemsfromStorage = JSON.parse(localStorage.getItem("items"));
	let activeTodoFilter = itemsfromStorage.filter(
		(item) => item.done === false
	);
	console.log(JSON.stringify(activeTodoFilter));
	localStorage.setItem("items", JSON.stringify(activeTodoFilter));
}

//delete todo
function deleteTodos(id) {
	let bla = itemList.querySelectorAll(".deleteTodo");
	let clickID = document.getElementById(`${id}`);
	let clickParentVal = clickID.parentElement.value;
	let itemsfromStorage = JSON.parse(localStorage.getItem("items"));
	itemsfromStorage.splice(clickParentVal, 1);
	localStorage.setItem("items", JSON.stringify(itemsfromStorage));
	window.location.reload();
}

//drag and drop
function dragStart(event) {
	event.target.classList.add("dragging");
}

function dragEnd(event) {
	event.target.classList.remove("dragging");
}
function dragOver(event) {
	const draggable = itemList.querySelector(".dragging");
	event.preventDefault();
	let newList = itemList.querySelectorAll("li");
	let sortedElementsToLocal = [...newList].map(function (item) {
		return {
			text: item.querySelector("label").textContent,
			done: item.querySelector("input").checked,
		};
	});

	const afterElement = getDragAfterElement(itemList, event.clientY);
	if (afterElement == null) {
		itemList.appendChild(draggable);
	} else {
		itemList.insertBefore(draggable, afterElement);
	}
	localStorage.setItem("items", JSON.stringify(sortedElementsToLocal));
}
function getDragAfterElement(itemList, y) {
	const draggableElements = [
		...itemList.querySelectorAll(`#drag:not(.dragging)`),
	];
	return draggableElements.reduce(
		(closest, child) => {
			const box = child.getBoundingClientRect();
			const offset = y - box.top - box.height / 2;
			if (offset < 0 && offset > closest.offset) {
				return { offset: offset, element: child };
			} else {
				return closest;
			}
		},
		{
			offset: Number.NEGATIVE_INFINITY,
		}
	).element;
}
allTodos.addEventListener("click", showAll);
completed.addEventListener("click", completedTodos);
addItems.addEventListener("keyup", addItem);
itemList.addEventListener("click", toggleDone);
activeTrigger.addEventListener("click", showActive);
clearCompleted.addEventListener("click", clearCompletedTodo);
todoList(items, itemList);
todoCounter();
