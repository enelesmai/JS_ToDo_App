import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import { differenceInCalendarDays, format } from 'date-fns';

import { todoItem } from './components/todoitem';
import { todoBook } from './components/todobook';
import { DisplayController } from './components/displaycontroller';

// navbar logo
import logo from './icons/logo.svg';



require('webpack-icons-installer');

const logoIcon = new Image();
logoIcon.src = logo;
document.getElementById('brandLogo').appendChild(logoIcon);

// Create new project book for user1
const book = todoBook('user1');
book.initialize(); // Creates a new project "default" with id=0;

//const p1 = todoProject('TODO APP');
const p1 = book.addProject('TODO APP'); // Creat a project with ID '1'

const item1 = todoItem('Define Data model', 'Create excel with data model and methods', new Date(), 'high');
const item2 = todoItem('Create basic Factories', 'Create factory files and methods', new Date(), 'high');
////const item3 = todoItem('Create screens wireframes', 'Create initial screen designs', '2020-07-19', 'high');

p1.addItem(item1); // Item added into the project's array with the project Id Set.
p1.addItem(item2); // Item added into the project's array with the project Id Set.
//p1.addItem(item3); // Item added into the project's array with the project Id Set.

//book.addProject(p1);
/* console.log(`project Name: ${p1.getName()}, project Id: ${p1.getProjectId()}`);
console.log(`project Name: ${p1.getName()}Item 0's project: ${p1.getProjectItems()[1].getProjectId()}`);
console.log(`name :${book.getProjects()[0].getName()}`);
console.log(`id :${book.getProjects()[0].getProjectId()}`); */
// / Render projects

function renderProjects() {
    let htmlTag = '';
    for (let i = 0; i < book.getProjects().length; i += 1) {
        htmlTag += `<div class="card projectItem" data-index="${i}" id="p${i}">
        
        <div class="card-body d-flex flex-row justify-content-between align-items-center">
            <p class="editProjectName" data-index="${i}" project m-0">${book.getProjects()[i].getName()}</p>
            <div class="action-icons d-flex flex-row justify-content-around align-items-center">
                <span id="edit${i}" class="glyphicon glyphicon-pencil action-edit-project" data-index=${i}></span>
                <span id="remove${i}" class="glyphicon glyphicon-remove action-remove-project" data-index=${i}></span>
            </div>
        </div>
        </div>`;
    }
    document.getElementById('projectItems').innerHTML = htmlTag;
}

function prioStyle(prio) {
    console.log('prios :' + prio)
    if (prio === 'high') {
        return 'badge badge-pill badge-danger';
    } else if (prio === 'medium') {
        return 'badge badge-pill badge-warning';
    } else {
        return 'badge badge-pill badge-primary';
    };
}

function renderItems(project) {
    let htmlTagToday = '';
    let htmlTagTomorrow = '';
    let htmlTagLater = '';

    let i = 0;
    book.getSingleProject(project).getProjectItems().forEach(item => {
        console.log('rendering items in the today/tomorrow groups');
        console.log(item.getDueDate());

        //const date = Date.parse(item.getDueDate());
        //const todayDate = new Date();
        console.log('today is: ' + format(new Date(), "dd/MM/yyy") + " - Item date is :" + format(item.getDueDate(), "dd/MM/yyy"));

        const result = differenceInCalendarDays(item.getDueDate(), new Date());
        console.log("item :" + item.getTitle() + " due day in: " + result + " days.");
        if (result === 0) {
            htmlTagToday += `<div class="card projectItem" id="item${i}">
            <div class="card-body d-flex flex-row justify-content-between align-items-center pt-4">
            <div id="update-${i}"></div>
            <div class="item-info">
                <h3 class="editItem" data-index="${i}" data-element="title">${item.getTitle()}</h3>
                <p class="editItem" data-index="${i}" data-element="description">${item.getDescription()}</p>
            </div>
            <div class="due-box  d-flex flex-row justify-content-around align-items-center">
                <h5 class="m-0">Due date:</h5>
                <p class="m-0 editItem" data-index="${i}" placeholder="dd-mm-yyyy" data-element="dueDate">${item.getHtmlSafeDueDate()}</p>
            </div>
            <div class="item-status">
                <p class="m-0">${(result < 0 ? " Overdue" : " Upcoming")}</p>
            </div>
            <div class="priority ${prioStyle(item.getPriority())}">
                <p class="m-0 editItem" data-index="${i}" data-element="priority">${item.getPriority()}</p>
            </div>
            <div class="action-icons d-flex flex-row justify-content-around align-items-center">
                <span id="edit${i}" class="glyphicon glyphicon-pencil action-edit-item" data-index=${i}></span>
                <span id="remove${i}" class="glyphicon glyphicon-remove action-remove-item" data-index=${i}></span>
            </div>
        </div>
            </div>`;
        } else if (result === 1) {
            htmlTagTomorrow += `<div class="card projectItem" id="item${i}">
            <div class="card-body d-flex flex-row justify-content-between align-items-center pt-4">
                <div id="update-${i}"></div>
                <div class="item-info">
                    <h3 class="editItem" data-index="${i}" data-element="title">${item.getTitle()}</h3>
                    <p class="editItem" data-index="${i}" data-element="description">${item.getDescription()}</p>
                </div>
                <div class="due-box  d-flex flex-row justify-content-around align-items-center">
                    <h5 class="m-0">Due date:</h5>
                    <p class="m-0 editItem" data-index="${i}" placeholder="dd-mm-yyyy" data-element="dueDate">${item.getHtmlSafeDueDate()}</p>
                </div>
                <div class="item-status">
                    <p class="m-0">${(result < 0 ? " Overdue" : " Upcoming")}</p>
                </div>
                <div class="priority ${prioStyle(item.getPriority())}">
                    <p class="m-0 editItem" data-index="${i}" data-element="priority">${item.getPriority()}</p>
                </div>
                <div class="action-icons d-flex flex-row justify-content-around align-items-center">
                    <span id="edit${i}" class="glyphicon glyphicon-pencil action-edit-item" data-index=${i}></span>
                    <span id="remove${i}" class="glyphicon glyphicon-remove action-remove-item" data-index=${i}></span>
                </div>
            </div>
        </div>`;
        } else {
            htmlTagLater += `<div class="card projectItem" id="item${i}">
            <div class="card-body d-flex flex-row justify-content-between align-items-center pt-4">
                <div id="update-${i}"></div>
                <div class="item-info">
                    <h3 class="editItem" data-index="${i}" data-element="title">${item.getTitle()}</h3>
                    <p class="editItem" data-index="${i}" data-element="description">${item.getDescription()}</p>
                </div>
                <div class="due-box  d-flex flex-row justify-content-around align-items-center">
                    <h5 class="m-0">Due date:</h5>
                    <p class="m-0 editItem" data-index="${i}" placeholder="dd-mm-yyyy" data-element="dueDate">${item.getHtmlSafeDueDate()}</p>
                </div>
                <div class="item-status">
                    <p class="m-0">${(result < 0 ? " Overdue" : " Upcoming")}</p>
                </div>
                <div class="priority ${prioStyle(item.getPriority())}">
                    <p class="m-0 editItem" data-index="${i}" data-element="priority">${item.getPriority()}</p>
                </div>
                <div class="action-icons d-flex flex-row justify-content-around align-items-center">
                    <span id="edit${i}" class="glyphicon glyphicon-pencil action-edit-item" data-index=${i}></span>
                    <span id="remove${i}" class="glyphicon glyphicon-remove action-remove-item" data-index=${i}></span>
                </div>
            </div>
        </div>`;
        }
        i += 1;
    });

    document.getElementById('today').innerHTML = htmlTagToday;
    document.getElementById('tomorrow').innerHTML = htmlTagTomorrow;
    document.getElementById('later').innerHTML = htmlTagLater;
}

function addListenersToProjects() {
    //add listener to projects
    const project_items = document.getElementsByClassName('projectItem');
    const showListProjects = function showListProjects() {
        console.log("click on select project : " + this.getAttribute('data-index'));
        book.setDomSelectedProject(this.getAttribute('data-index'));
        DisplayController.selectDomProject(this.getAttribute('data-index'));
        prepareItems();
    };
    for (let i = 0; i < project_items.length; i += 1) {
        project_items[i].addEventListener('click', showListProjects, false);
    }
}

function addItemCancelListers() {
    const items_cancel_action = document.getElementsByClassName('action-cancel-item');
    const cancelItem = function cancelItem(event) {
        let currentProject = book.getSingleProject(book.getDomSelectedProject());
        currentProject.clearEditing();
        event.stopPropagation();
        prepareItems();
    }
    for (let i = 0; i < items_cancel_action.length; i += 1) {
        items_cancel_action[i].addEventListener('click', cancelItem, false);
    }
}


function addItemUpdateListeners() {
    const items_update_action = document.getElementsByClassName('action-save-item');

    const saveItem = function saveItem(event) {
        let currentProject = book.getSingleProject(book.getDomSelectedProject());
        let item = this.getAttribute('data-index');
        let element = this.getAttribute('data-element');

        let newValue = DisplayController.readItemUpdateValue("inputEdit_" + element);
        console.log("saving: " + element);
        switch (element) {
            case "title":
                currentProject.getProjectItems()[item].setTitle(newValue);
                break;
            case "description":
                currentProject.getProjectItems()[item].setDescription(newValue);
                break;
            case "dueDate":
                currentProject.getProjectItems()[item].setDueDate(newValue);
                break;
            case "priority":
                currentProject.getProjectItems()[item].setPriority(newValue);
                break;
            default:
                break;
        }

        prepareItems();
        console.log('now trying to clear editing flag')
        currentProject.clearEditing();
        console.log("Just finished editing. editing item? : " + currentProject.getEditing());
        event.stopPropagation();
        console.log("...and event propagation halted after editing Title " + this.getAttribute('data-index'));
    }

    for (let i = 0; i < items_update_action.length; i += 1) {
        items_update_action[i].addEventListener('click', saveItem, false);
    }

}



function addProjectEditListeners() {
    const projects_titleEdit_action = document.getElementsByClassName('editProjectName');


    const editProjectName = function editProjectName(event) {
        console.log('click on editProjectName');
        let projectNameToEdit = this.getAttribute('data-index');

        console.log("Changing selected project to ptoject: : " + projectNameToEdit);
        book.setDomSelectedProject(this.getAttribute('data-index'));
        DisplayController.selectDomProject(this.getAttribute('data-index'));
        prepareItems();

        let selecteProject = book.getDomSelectedProject();

        console.log("project name edit Clicked: " + this.getAttribute('data-index'));
        console.log("Now, selected Project is project: " + selecteProject);

        event.stopPropagation();
        console.log("Killing propagation after selecting project: " + selecteProject);

        if (projectNameToEdit === selecteProject) {
            console.log('Lets Edit the Project name')
        } else {
            return;
        }


    }

    for (let i = 0; i < projects_titleEdit_action.length; i += 1) {
        projects_titleEdit_action[i].addEventListener('click', editProjectName, false);
    }
}



function addItemActionListeners() {
    const items_remove_action = document.getElementsByClassName('action-remove-item');
    const items_titleEdit_action = document.getElementsByClassName('editItem');

    const removeItem = function removeItem() {
        console.log('click on removeItem');
        console.log(this.getAttribute('data-index'));
        console.log("click Item remove - project : " + book.getDomSelectedProject() + " - item :" + this.getAttribute('data-index'));
        let currentProject = book.getSingleProject(book.getDomSelectedProject());
        currentProject.removeItem(this.getAttribute('data-index'));
        prepareItems();
    };

    const editItem = function editItem(event) {
        let currentProject = book.getSingleProject(book.getDomSelectedProject());
        let item = this.getAttribute('data-index');
        let element = this.getAttribute('data-element');
        let itemObject = currentProject.getProjectItems()[item];

        let updateIconsTag = document.getElementById('update-' + item);

        if (currentProject.getEditing()) { return }

        currentProject.setEditing();

        this.removeEventListener(event, editItem, true)
        // render inputs on the element's Item to edit
        this.classList.remove('editItem');

        console.log("editing: " + element);

        switch (element) {
            case "title":
            case "description":
                this.innerHTML = `<input type="text" value="${this.innerHTML}"
                id="inputEdit_${element}"
                >
                <div>
                <span id="save${item}" class="glyphicon glyphicon-floppy-disk action-save-item" data-index="${item}" data-element="${element}"></span>
                <span id="cancell${item}" class="glyphicon glyphicon-remove action-cancel-item" data-index="${item}" data-element="${element}"></span>
                </div>`;
                break;
            case "dueDate":
                console.log("dueDate Case: Objects are - ")
                console.log(itemObject.getDueDate());
                let editDueDate = itemObject.getDueDate();

                this.innerHTML = `<input type="date" value="${format(editDueDate, "yyyy-MM-dd")}"
                id="inputEdit_${element}"
                
                >
                <div>
                <span id="save${item}" class="glyphicon glyphicon-floppy-disk action-save-item" data-index="${item}" data-element="${element}"></span>
                <span id="cancell${item}" class="glyphicon glyphicon-remove action-cancel-item" data-index="${item}" data-element="${element}"></span>
                </div>`;
                break;
            case "priority":
                this.innerHTML = `<select id="inputEdit_${element}">
                      <option value="low" 
                      ${itemObject.getPriority() == "low" ? "selected" : ""} 
                      >Low</option>
                      <option value="medium"
                      ${itemObject.getPriority() == "medium" ? "selected" : ""} 
                      >Medium</option>
                      <option value="high"
                      ${itemObject.getPriority() == "high" ? "selected" : ""} 
                      >High</option>                      
                    </select>
                `;
                updateIconsTag.innerHTML = `
                <div class = "updateItemIcons">
                <span id="save${item}" class="glyphicon glyphicon-floppy-disk action-save-item" data-index="${item}" data-element="${element}"></span>
                <span id="cancell${item}" class="glyphicon glyphicon-remove action-cancel-item" data-index="${item}" data-element="${element}"></span>
                </div>
                `
            default:
                break;
        }

        addItemUpdateListeners();
        addItemCancelListers();

        // render accept icon to add changes
        // read new form imputs
        // save modified item in the project
        // re-render items
    }

    for (let i = 0; i < items_remove_action.length; i += 1) {
        items_remove_action[i].addEventListener('click', removeItem, false);
    }
    for (let i = 0; i < items_titleEdit_action.length; i += 1) {
        items_titleEdit_action[i].addEventListener('click', editItem, false);
    }

}

function addProjectActionListeners() {
    const projects = document.getElementsByClassName('action-remove-project');
    const removeProject = function removeProject(event) {
        console.log("click project remove - project : " + this.getAttribute('data-index'))
        book.removeProject(this.getAttribute('data-index'));
        book.setDomSelectedProject(0);
        prepareProjects();
        event.stopPropagation();
        console.log("...and event propagation halted after killing project " + this.getAttribute('data-index'));
    };
    for (let i = 0; i < projects.length; i += 1) {
        projects[i].addEventListener('click', removeProject, false);
    }
}

function prepareProjects() {
    renderProjects();
    DisplayController.selectDomProject(book.getDomSelectedProject());
    addListenersToProjects();
    addProjectActionListeners();
    addProjectEditListeners()
    prepareItems();
}

function prepareItems() {
    let currentProject = book.getSingleProject(book.getDomSelectedProject());
    currentProject.clearEditing();
    renderItems(book.getDomSelectedProject());
    addItemActionListeners();
}

document.addEventListener('DOMContentLoaded', () => {
    book.setDomSelectedProject(0); //sets project default as selected;
    prepareProjects();

    //add listener to buttons
    document.getElementById('btnAddProject').addEventListener('click', () => {
        let p = DisplayController.prepareProjectObject();
        if (p.getName() === '' || book.projectExists(p)) {
            console.log('project name empty');
            return;
        } else {
            p = book.addProject(p.getName());
            book.setDomSelectedProject(p.getProjectId());
            prepareProjects();
        };
    });

    document.getElementById('btnAddItem').addEventListener('click', () => {
        let domItem = DisplayController.prepareItemObject();

        if (book.getDomSelectedProject() === -1) {
            console.log('no project selected');
            return;
        } else {
            let currentProject = book.getSingleProject(book.getDomSelectedProject());
            if (domItem.getTitle() === '' || currentProject.itemExists(domItem) || domItem.isOverdue()) {
                console.log('item title empty');
                return;
            } else {
                currentProject.addItem(domItem);
                DisplayController.clearItemProjectForm();
                prepareItems();
            }
        };

    });
});