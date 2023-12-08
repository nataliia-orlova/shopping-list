// select elements from the DOM
const itemForm = document.querySelector('#item-form');
const itemInput = document.querySelector('#item-input');
const itemList = document.querySelector('#item-list');
const clearBtn = document.querySelector('#clear');
const itemFilter = document.querySelector('#filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

// render items in the DOM
function displayItems() {
    // get items from storage
    let itemsFromStorage = getItemsFromStorage();
    // loop through the items and add each item to the DOM
    itemsFromStorage.forEach((item) => addItemToDOM(item));
    // update UI
    resetUI();
}

function onAddItemSubmit(e) {
    e.preventDefault();
    // get input value as an item
    const newItem = itemInput.value;
    // validate input
    if (newItem === '') {
        alert('Please add an item');
        return;
    }
    // check for edit mode
    if (isEditMode) {
        // get item in edit
        const itemToEdit = itemList.querySelector('.edit-mode');
        // remove item text from storage
        removeItemFromStorage(itemToEdit.textContent);
        // remove edit mode
        itemToEdit.classList.remove('edit-mode');
        // remove item from the DOM
        itemToEdit.remove();
        isEditMode = false;
    } else {
        if (checkIfItemExists(newItem)) {
            alert('This item already exists!');
            return;
        }
    }

    // add item to the DOM
    addItemToDOM(newItem);
    // add item to the local storage
    addItemToStorage(newItem);
    // check if there are items in the list
    resetUI();
    // clear input
    itemInput.value = '';
}

// add list items to the DOM
function addItemToDOM(item) {
    // create element
    const li = document.createElement('li');
    // add element to the DOM
    li.appendChild(document.createTextNode(item));
    // create button
    const button = document.createElement('button');
    button.className = 'remove-item btn-link text-red';
    // create icon element
    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-xmark';
    // append icon to the button
    button.appendChild(icon);
    // append button to the list item
    li.appendChild(button);
    // append list item to the list
    itemList.appendChild(li);
}

// add list items to local storage
function addItemToStorage(item) {
    // declare variable for items from local storage
    let itemsFromStorage = getItemsFromStorage();
    // if no items in local storage - the array is empty
    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];
        // if there is something - get them and make an array
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }
    // add another item
    itemsFromStorage.push(item);
    // convert to string to be able to keep in local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

//
function getItemsFromStorage() {
    let itemsFromStorage;

    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage;
}

function onClickItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement);
    } else {
        setItemToEdit(e.target);
    }
}

function checkIfItemExists(item) {
    const itemsFromStorage = getItemsFromStorage();

    return itemsFromStorage.includes(item);
}

// edit list items
function setItemToEdit(item) {
    // set edit mode to true
    isEditMode = true;
    // ensure that only one list item is in edit mode at a time
    itemList
        .querySelectorAll('li')
        .forEach((i) => i.classList.remove('edit-mode'));
    // change text color
    item.classList.add('edit-mode');
    // change btn icon and text
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Edit item';
    // change btn color
    formBtn.style.backgroundColor = '#228B22';
    // send item text to form input
    itemInput.value = item.textContent;
}
function removeItem(item) {
    if (confirm('Are you sure?')) {
        item.remove();

        removeItemFromStorage(item.textContent);
        resetUI();
    }
}

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();
    // filter items to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);
    // reset to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems() {
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }
    localStorage.removeItem('items');
    resetUI();
}

function filterItems(e) {
    // get a node list of items to be able to loop through them
    const items = itemList.querySelectorAll('li');
    // get the text from the input
    const text = e.target.value.toLowerCase();

    items.forEach((item) => {
        // get the text from the list item
        const itemName = item.firstChild.textContent.toLowerCase();
        // compare text from the input with the text from the list
        if (itemName.indexOf(text) != -1) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

//check UI for list items
function resetUI() {
    itemInput.value = '';
    const items = itemList.querySelectorAll('li');
    // if no items on the list - hide filter and clear btn
    if (items.length === 0) {
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';
        // if there are items added - show filter and clear all option
    } else {
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block';
    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backGroundColor = '#333';
    isEditMode = false;
}

// initialize app - not to have it all in the global scope
function init() {
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    clearBtn.addEventListener('click', clearItems);
    itemFilter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems);

    resetUI();
}

init();
