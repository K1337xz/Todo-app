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
	if (e.key === `Enter`) {
		const text = addItems.value;
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
        <li class="${list.done ? "checkedInp" : "unchecked"}">
            <input type="checkbox" data-index=${i} id="item${i}" name="checks" ${
				list.done ? "checked" : ""
			}/>
            <label for="item${i} ">${list.text}</label>
        </li>
        `;
		})
		.join("");
}

function toggleDone(e) {
	if (!e.target.matches("input")) return;
	const el = e.target;
	const index = el.dataset.index;
	items[index].done = !items[index].done;
	localStorage.setItem("items", JSON.stringify(items));

	todoList(items, itemList);
}

//show completed todo`s
const completed = document.querySelector(".showCompleted");

function completedTodos(complete = [], completeList) {
	completeList.innerHTML = complete
		.map((list, i) => {
			return `
        <li class="${list.done ? "checkedInp'" : "sortbycompleted"}">
            <input type="checkbox" data-index=${i} id="item${i}" name="checks" checked/>
            <label for="item${i} ">${list.text}</label>
        </li>
        `;
		})
		.join("");
}

completed.addEventListener("click", completedTodos);
addItems.addEventListener("keyup", addItem);
todoList(items, itemList);
itemList.addEventListener("click", toggleDone);
