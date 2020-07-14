const { default: todoProject } = require('./todoproject');
const { default: todoItem } = require('./todoitem');
import { differenceInCalendarDays, format } from 'date-fns';
import { Storage } from './storage';
import book from './applogic';

export const DisplayController = (() => {
  const prepareProjectObject = () => {
    const name = document.getElementById('projectName').value;
    const project = todoProject(name, 0);
    document.getElementById('projectName').value = '';
    return project;
  };

  const prepareItemObject = () => {
    const parts = document.getElementById('inputDate').value.split('-');
    const date = new Date(`${parts[0]}/${parts[1]}/${parts[2]}`);
    const title = document.getElementById('inputTitle').value;
    const description = document.getElementById('inputDescription').value;
    const duedate = date;
    const priority = document.getElementById('inputPriority').value;
    const item = todoItem(title, description, duedate, priority);
    return item;
  };

  const readItemUpdateValue = (itemProperty) => {
    let property = document.getElementById(itemProperty).value;
    console.log(`reading value: ${itemProperty}`);
    if (itemProperty === 'inputEdit_dueDate') {
      console.log('parsing date');
      const parts = property.split('-');
      console.log(parts);
      property = new Date(`${parts[0]}/${parts[1]}/${parts[2]}`);
    }
    return property;
  };

  const selectDomProject = (project) => {
    console.log(`select dom ${project}`);
    const projectItems = document.getElementsByClassName('projectItem');
    for (let i = 0; i < projectItems.length; i += 1) {
      projectItems[i].classList.remove('selectedProject');
    }
    console.log('domproj');
    const domProject = document.getElementById(`p${project}`);
    console.log('class');
    domProject.classList.add('selectedProject');
  };

  const clearItemProjectForm = () => {
    document.getElementById('inputTitle').value = '';
    document.getElementById('inputDescription').value = '';
    document.getElementById('inputPriority').value = 'low';
    document.getElementById('inputDate').value = '';
  };

  /* General Render and Listener Management */

  // Render projects
  //move
  const renderProjects = () => {
    let htmlTag = '';
    for (let i = 0; i < book.getProjects().length; i += 1) {
      htmlTag += `<div class="card projectItem" data-index="${i}" id="p${i}">        
      <div class="card-body d-flex flex-row justify-content-between align-items-center">
          <p class="editProjectName" data-index="${i}" project m-0">${book.getProjects()[i].getName()}</p>
          <div class="action-icons d-flex flex-row justify-content-around align-items-center">
              <span id="remove${i}" class="glyphicon glyphicon-remove action-remove-project" data-index=${i}></span>
          </div>
      </div>
      </div>`;
    }
    document.getElementById('projectItems').innerHTML = htmlTag;
  }

  //move
  const prioStyle = (prio) => {
    console.log(`prios :${prio}`);
    if (prio === 'high') {
      return 'badge badge-pill badge-danger';
    }
    if (prio === 'medium') {
      return 'badge badge-pill badge-warning';
    }
    return 'badge badge-pill badge-primary';
  }

  //move
  const renderItems = (project) => {
    let htmlTagToday = '';
    let htmlTagTomorrow = '';
    let htmlTagLater = '';

    let i = 0;
    book.getSingleProject(project).getProjectItems().forEach(item => {
      console.log('rendering items in the today/tomorrow groups');
      console.log(item.getDueDate());

      // const date = Date.parse(item.getDueDate());
      // const todayDate = new Date();
      console.log(`today is: ${format(new Date(), 'dd/MM/yyy')} - Item date is :${format(item.getDueDate(), 'dd/MM/yyy')}`);

      const result = differenceInCalendarDays(item.getDueDate(), new Date());
      console.log(`item :${item.getTitle()} due day in: ${result} days.`);
      if (result === 0) {
        htmlTagToday += `<div class="card projectItem" id="item${i}">
          <div id="box-item-${i}" class="card-body d-flex flex-row justify-content-between align-items-center pt-4 ${item.getStatus() === 'complete' ? 'complete-item' : ''}">
          <div id="update-${i}" data-index="${i}" class="complete-check">  <span class="glyphicon glyphicon-check"></span> </div>
          <div class="item-info">
              <h3 class="editItem" data-index="${i}" data-element="title">${item.getTitle()}</h3>
              <p class="editItem" data-index="${i}" data-element="description">${item.getDescription()}</p>
          </div>
          <div class="due-box  d-flex flex-row justify-content-around align-items-center">
              <h5 class="m-0">Due date:</h5>
              <p class="m-0 editItem" data-index="${i}" placeholder="dd-mm-yyyy" data-element="dueDate">${item.getHtmlSafeDueDate()}</p>
          </div>
          <div class="item-status">
              <p class="m-0">${(result < 0 ? ' Overdue' : ' Upcoming')}</p>
          </div>
          <div class="priority ${prioStyle(item.getPriority())}">
              <p class="m-0 editItem" data-index="${i}" data-element="priority">${item.getPriority()}</p>
          </div>
          <div class="action-icons remove-item d-flex flex-row justify-content-around align-items-center">
              <span id="remove${i}" class="glyphicon glyphicon-remove action-remove-item" data-index=${i}></span>
          </div>
      </div>
          </div>`;
      } else if (result === 1) {
        htmlTagTomorrow += `<div class="card projectItem" id="item${i}">
          <div id="box-item-${i}" class="card-body d-flex flex-row justify-content-between align-items-center pt-4 ${item.getStatus() === 'complete' ? 'complete-item' : ''}">
          <div id="update-${i}" data-index="${i}" class="complete-check">  <span class="glyphicon glyphicon-check"></span> </div>
              <div class="item-info">
                  <h3 class="editItem" data-index="${i}" data-element="title">${item.getTitle()}</h3>
                  <p class="editItem" data-index="${i}" data-element="description">${item.getDescription()}</p>
              </div>
              <div class="due-box  d-flex flex-row justify-content-around align-items-center">
                  <h5 class="m-0">Due date:</h5>
                  <p class="m-0 editItem" data-index="${i}" placeholder="dd-mm-yyyy" data-element="dueDate">${item.getHtmlSafeDueDate()}</p>
              </div>
              <div class="item-status">
                  <p class="m-0">${(result < 0 ? ' Overdue' : ' Upcoming')}</p>
              </div>
              <div class="priority ${prioStyle(item.getPriority())}">
                  <p class="m-0 editItem" data-index="${i}" data-element="priority">${item.getPriority()}</p>
              </div>
              <div class="action-icons remove-item d-flex flex-row justify-content-around align-items-center">
                  <span id="remove${i}" class="glyphicon glyphicon-remove action-remove-item" data-index=${i}></span>
              </div>
          </div>
      </div>`;
      } else {
        htmlTagLater += `<div class="card projectItem" id="item${i}">
          <div id="box-item-${i}" class="card-body d-flex flex-row justify-content-between align-items-center pt-4 ${item.getStatus() === 'complete' ? 'complete-item' : ''}">
          <div id="update-${i}" data-index="${i}" class="complete-check">  <span class="glyphicon glyphicon-check"></span> </div>
              <div class="item-info">
                  <h3 class="editItem" data-index="${i}" data-element="title">${item.getTitle()}</h3>
                  <p class="editItem" data-index="${i}" data-element="description">${item.getDescription()}</p>
              </div>
              <div class="due-box  d-flex flex-row justify-content-around align-items-center">
                  <h5 class="m-0">Due date:</h5>
                  <p class="m-0 editItem" data-index="${i}" placeholder="dd-mm-yyyy" data-element="dueDate">${item.getHtmlSafeDueDate()}</p>
              </div>
              <div class="item-status">
                  <p class="m-0">${(result < 0 ? ' Overdue' : ' Upcoming')}</p>
              </div>
              <div class="priority ${prioStyle(item.getPriority())}">
                  <p class="m-0 editItem" data-index="${i}" data-element="priority">${item.getPriority()}</p>
              </div>
              <div class="action-icons remove-item d-flex flex-row justify-content-around align-items-center">
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

  //move
  const addListenersToProjects = () => {
    // add listener to projects
    const projectItems = document.getElementsByClassName('projectItem');
    const showListProjects = function showListProjects() {
      if (book.getEditing()) { return; }
      console.log(`click on select project : ${this.getAttribute('data-index')}`);
      book.setDomSelectedProject(this.getAttribute('data-index'));
      DisplayController.selectDomProject(this.getAttribute('data-index'));
      // eslint-disable-next-line no-use-before-define
      prepareItems();
    };
    for (let i = 0; i < projectItems.length; i += 1) {
      projectItems[i].addEventListener('click', showListProjects, false);
    }
  }

  //move
  const addItemCancelListers = () => {
    const itemsCancelAction = document.getElementsByClassName('action-cancel-item');
    const cancelItem = function cancelItem(event) {
      const currentProject = book.getSingleProject(book.getDomSelectedProject());
      currentProject.clearEditing();
      event.stopPropagation();
      // eslint-disable-next-line no-use-before-define
      prepareItems();
    };
    for (let i = 0; i < itemsCancelAction.length; i += 1) {
      itemsCancelAction[i].addEventListener('click', cancelItem, false);
    }
  }

  //move
  const addItemUpdateListeners = () => {
    const itemsUpdateAction = document.getElementsByClassName('action-save-item');

    const saveItem = function saveItem(event) {
      const currentProject = book.getSingleProject(book.getDomSelectedProject());
      const item = this.getAttribute('data-index');
      const element = this.getAttribute('data-element');

      const newValue = DisplayController.readItemUpdateValue(`inputEdit_${element}`);
      console.log(`saving: ${element}`);
      switch (element) {
        case 'title':
          currentProject.getProjectItems()[item].setTitle(newValue);
          break;
        case 'description':
          currentProject.getProjectItems()[item].setDescription(newValue);
          break;
        case 'dueDate':
          currentProject.getProjectItems()[item].setDueDate(newValue);
          break;
        case 'priority':
          currentProject.getProjectItems()[item].setPriority(newValue);
          break;
        default:
          break;
      }

      // eslint-disable-next-line no-use-before-define
      prepareItems();
      console.log('now trying to clear editing flag');
      currentProject.clearEditing();
      console.log(`Just finished editing. editing item? : ${currentProject.getEditing()}`);
      event.stopPropagation();
      console.log(`...and event propagation halted after editing Title ${this.getAttribute('data-index')}`);
    };

    for (let i = 0; i < itemsUpdateAction.length; i += 1) {
      itemsUpdateAction[i].addEventListener('click', saveItem, false);
    }
  }

  //move
  const addProjectCancelListeners = () => {
    const cancelAction = document.getElementsByClassName('action-cancel-project');
    const cancelProject = function cancelProject(event) {
      book.clearEditing();
      event.stopPropagation();
      // eslint-disable-next-line no-use-before-define
      prepareProjects();
    };
    for (let i = 0; i < cancelAction.length; i += 1) {
      cancelAction[i].addEventListener('click', cancelProject, false);
    }
  }

  //move
  const addProjectUpdateListeners = () => {
    const updateAction = document.getElementsByClassName('action-save-project');

    const saveProject = function saveProject(event) {
      const currentProject = book.getSingleProject(book.getDomSelectedProject());
      const value = DisplayController.readItemUpdateValue('inputEditProject');
      console.log(`new project name: ${value}`);
      console.log(currentProject);
      currentProject.setName(value);

      book.clearEditing();
      console.log(`is Editing?: ${book.getEditing()}`);
      console.log(`Just finished editing project title. editing project? : ${book.getEditing()}`);
      event.stopPropagation();
      console.log(`...and event propagation halted after editing Title ${currentProject.getName()}`);
      // eslint-disable-next-line no-use-before-define
      prepareProjects();
    };

    for (let i = 0; i < updateAction.length; i += 1) {
      updateAction[i].addEventListener('click', saveProject, false);
    }
  }

  //move
  const addProjectEditListeners = () => {
    const projectsTitleEditAction = document.getElementsByClassName('editProjectName');


    const editProjectName = function editProjectName(event) {
      console.log(`checking before return Editing?: ${book.getEditing()}`);
      if (book.getEditing()) { return; }

      console.log('click on editProjectName');
      const projectNameToEdit = this.getAttribute('data-index');

      console.log(`Changing selected project to ptoject: : ${projectNameToEdit}`);
      book.setDomSelectedProject(this.getAttribute('data-index'));
      DisplayController.selectDomProject(this.getAttribute('data-index'));
      // eslint-disable-next-line no-use-before-define
      prepareItems();

      const selecteProject = book.getDomSelectedProject();

      console.log(`project name edit Clicked: ${this.getAttribute('data-index')}`);
      console.log(`Now, selected Project is project: ${selecteProject}`);

      event.stopPropagation();
      console.log(`Killing propagation after selecting project: ${selecteProject}`);

      if (projectNameToEdit === selecteProject) {
        console.log('Lets Edit the Project name');
        book.setEditing();
        console.log(`is Editing?: ${book.getEditing()}`);
        this.innerHTML = `<input type="text" value="${this.innerHTML}"
              id="inputEditProject"
              >
              <div>
              <span class="glyphicon glyphicon-floppy-disk action-save-project"></span>
              <span class="glyphicon glyphicon-remove action-cancel-project"></span>
              </div>`;
      } else {
        return;
      }

      addProjectCancelListeners(); //move
      addProjectUpdateListeners(); //move
    };

    for (let i = 0; i < projectsTitleEditAction.length; i += 1) {
      projectsTitleEditAction[i].addEventListener('click', editProjectName, false);
    }
  }

  //move
  const addItemActionListeners = () => {
    const itemsRemoveAction = document.getElementsByClassName('action-remove-item');
    const itemsTitleEditAction = document.getElementsByClassName('editItem');

    const removeItem = function removeItem() {
      console.log('click on removeItem');
      console.log(this.getAttribute('data-index'));
      console.log(`click Item remove - project : ${book.getDomSelectedProject()} - item :${this.getAttribute('data-index')}`);
      const currentProject = book.getSingleProject(book.getDomSelectedProject());
      currentProject.removeItem(this.getAttribute('data-index'));
      // eslint-disable-next-line no-use-before-define
      prepareItems();
    };

    const editItem = function editItem(event) {
      const currentProject = book.getSingleProject(book.getDomSelectedProject());
      const item = this.getAttribute('data-index');

      const element = this.getAttribute('data-element');
      const itemObject = currentProject.getProjectItems()[item];
      const itemStatus = itemObject.getStatus();
      console.log(`THIS IS THE STATUS OF THE ITEM CLICKED TO EDIT  :${itemStatus}`);


      const updateIconsTag = document.getElementById(`update-${item}`);

      if (itemStatus === 'complete') { return; }
      if (currentProject.getEditing()) { return; }


      currentProject.setEditing();

      this.removeEventListener(event, editItem, true);
      // render inputs on the element's Item to edit
      this.classList.remove('editItem');

      console.log(`editing: ${element}`);
      const editDueDate = itemObject.getDueDate();

      switch (element) {
        case 'title':
        case 'description':
          this.innerHTML = `<input type="text" value="${this.innerHTML}"
              id="inputEdit_${element}"
              >
              <div>
              <span id="save${item}" class="glyphicon glyphicon-floppy-disk action-save-item" data-index="${item}" data-element="${element}"></span>
              <span id="cancell${item}" class="glyphicon glyphicon-remove action-cancel-item" data-index="${item}" data-element="${element}"></span>
              </div>`;
          break;
        case 'dueDate':
          console.log('dueDate Case: Objects are - ');
          console.log(itemObject.getDueDate());
          this.innerHTML = `<input type="date" value="${format(editDueDate, 'yyyy-MM-dd')}"
              id="inputEdit_${element}"
              
              >
              <div>
              <span id="save${item}" class="glyphicon glyphicon-floppy-disk action-save-item" data-index="${item}" data-element="${element}"></span>
              <span id="cancell${item}" class="glyphicon glyphicon-remove action-cancel-item" data-index="${item}" data-element="${element}"></span>
              </div>`;
          break;
        case 'priority':
          this.innerHTML = `<select id="inputEdit_${element}">
                    <option value="low" 
                    ${itemObject.getPriority() === 'low' ? 'selected' : ''} 
                    >Low</option>
                    <option value="medium"
                    ${itemObject.getPriority() === 'medium' ? 'selected' : ''} 
                    >Medium</option>
                    <option value="high"
                    ${itemObject.getPriority() === 'high' ? 'selected' : ''} 
                    >High</option>                      
                  </select>
              `;
          updateIconsTag.innerHTML = `
              <div class = "updateItemIcons">
              <span id="save${item}" class="glyphicon glyphicon-floppy-disk action-save-item" data-index="${item}" data-element="${element}"></span>
              <span id="cancell${item}" class="glyphicon glyphicon-remove action-cancel-item" data-index="${item}" data-element="${element}"></span>
              </div>
              `;
          break;
        default:
          break;
      }

      addItemUpdateListeners(); //move
      addItemCancelListers(); //move

      // render accept icon to add changes
      // read new form imputs
      // save modified item in the project
      // re-render items
    };

    for (let i = 0; i < itemsRemoveAction.length; i += 1) {
      itemsRemoveAction[i].addEventListener('click', removeItem, false);
    }
    for (let i = 0; i < itemsTitleEditAction.length; i += 1) {
      itemsTitleEditAction[i].addEventListener('click', editItem, false);
    }
  }
  //move
  const addProjectActionListeners = () => {
    const projects = document.getElementsByClassName('action-remove-project');
    const removeProject = function removeProject(event) {
      const currentProject = book.getSingleProject(book.getDomSelectedProject());
      console.log("current selected project :" + currentProject.getName())
      console.log("Is someone editing anything? :" + book.getEditing())
      if (book.getEditing()) { return; }
      console.log(`click project remove - project : ${this.getAttribute('data-index')}`);
      book.removeProject(this.getAttribute('data-index'));
      book.setDomSelectedProject(0);
      // eslint-disable-next-line no-use-before-define
      Storage.clearStorage();
      Storage.saveBook();
      book.clearProjects();
      book.convertJSONtoProjects(Storage.getObjectStorage());
      prepareProjects();
      event.stopPropagation();
      console.log(`...and event propagation halted after killing project ${this.getAttribute('data-index')}`);
    };
    for (let i = 0; i < projects.length; i += 1) {
      projects[i].addEventListener('click', removeProject, false);
    }
  }
  //move
  const addCompleteItemListeners = () => {
    const updateItems = document.getElementsByClassName('complete-check');

    const toggleItem = function toggleItem() {
      const currentProject = book.getSingleProject(book.getDomSelectedProject());
      console.log(`click toggle item : ${this.getAttribute('data-index')}`);
      const itemIndex = this.getAttribute('data-index');
      const currentItem = currentProject.getProjectItems()[itemIndex];
      const itemStatus = currentItem.getStatus();

      if (itemStatus === 'open') {
        console.log(`Item is:${itemStatus}`);
        currentProject.getProjectItems()[itemIndex].completeItem();
        const domItemTag = document.getElementById(`box-item-${itemIndex}`);
        domItemTag.classList.add('complete-item');
      } else {
        console.log(`Item is:${itemStatus}`);
        currentProject.getProjectItems()[itemIndex].openItem();
        const domItemTag = document.getElementById(`box-item-${itemIndex}`);
        domItemTag.classList.remove('complete-item');
      }
      console.log(`Now Item is:${currentItem.getStatus()}`);
      // eslint-disable-next-line no-use-before-define
      prepareItems();
    };


    for (let i = 0; i < updateItems.length; i += 1) {
      updateItems[i].addEventListener('click', toggleItem, false);
    }
  }


  const prepareItems = () => {
    const currentProject = book.getSingleProject(book.getDomSelectedProject());
    currentProject.clearEditing();
    renderItems(book.getDomSelectedProject()); //move
    addItemActionListeners(); //move
    addCompleteItemListeners(); //move
    Storage.saveBook();
  }

  const prepareProjects = () => {
    renderProjects(); //move
    selectDomProject(book.getDomSelectedProject());
    addListenersToProjects(); //move
    addProjectActionListeners(); //move
    addProjectEditListeners(); //move
    prepareItems();
  }



  return {
    prepareProjectObject,
    prepareItemObject,
    selectDomProject,
    clearItemProjectForm,
    readItemUpdateValue,
    renderItems,
    addItemActionListeners,
    addCompleteItemListeners,
    renderProjects,
    addListenersToProjects,
    addProjectActionListeners,
    addProjectEditListeners,
    prepareProjects,
    prepareItems,

  };
})();

export default DisplayController;