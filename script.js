// how to connect with local storage in node.js
let state = {
    balance: 0,
    income: 0,
    expense: 0,
    transactions: []
}
let balance = document.getElementById('balance');
let income = document.getElementById('income');
let expense = document.getElementById('expense');
let trans_list = document.getElementById('trans_list');
let addIn_trans_btn = document.getElementById('addIn_trans');
let addEx_trans_btn = document.getElementById('addEx_trans');
let nameLabel = document.getElementById('text_label');
let valueInput = document.getElementById('input_trans');


function init() {
    let stateCopy = JSON.parse(localStorage.getItem('expenseTracker'));
    if(stateCopy !== null){ state = stateCopy; }
    updateState();
    initListeners();
}

function uniqueId() {
    return Math.round(Math.random() * 100000000);
}

function initListeners() {
    addIn_trans_btn.addEventListener('click', onAddIncome);
    addEx_trans_btn.addEventListener('click', onAddExpense);
}

function onAddIncome() { 
    addTransaction(nameLabel.value, valueInput.value, 'income'); 
}

function onAddExpense() { 
    addTransaction(nameLabel.value, valueInput.value, 'expense');
}

function addTransaction(name, amount, catagory){
    if (name !== '' && amount !== '') {
        let transaction = {
            id: uniqueId(),
            name: name,
            amount: parseInt(amount),
            catagory: catagory
        } 
        state.transactions.push(transaction);
        updateState();

    } else {
        alert("Please enter valid data");
    }

    nameLabel.innerHTML = '';
    valueInput.innerHTML = '';
}

function onDelete(e) {
    let _id =  parseInt(e.target.getAttribute('data_id'));
    let index;
    for(i=0; i<state.transactions.length; i++){
        if(state.transactions[i].id === _id){
            index = i;
            break;
        }
    }

    state.transactions.splice(index, 1);
    updateState();
}

function updateState() {
    let balance = 0, income = 0, expense = 0, item;

    for (i = 0; i < state.transactions.length; i++) {
        item = state.transactions[i];
        if (item.catagory === 'income') income += item.amount;
        else if (item.catagory === 'expense') expense += item.amount;
    }

    balance = income - expense;

    state.balance = balance;
    state.income = income;
    state.expense = expense;

    localStorage.setItem('expenseTracker', JSON.stringify(state));
    render();
}

function render() {
    balance.innerHTML = `₹${state.balance}`;
    income.innerHTML = `₹${state.income}`;
    expense.innerHTML = `₹${state.expense}`;

    let list_item, item, trans_label, trans_val, delete_btn;
    trans_list.innerHTML = '';
    for (i = state.transactions.length -1; i >= 0 ; i--) {
        item = state.transactions[i];
        list_item = document.createElement('li');
        list_item.classList.add('list_item');
        { item.catagory === 'income' ? list_item.classList.add('plus') : list_item.classList.add('minus') }
        list_item.innerHTML = `${item.name}`;

        trans_label = document.createElement('div');

        trans_val = document.createElement('span');
        if(item.catagory === 'income') trans_val.innerHTML = `+ ₹${item.amount}`;
        else if(item.catagory === 'expense') trans_val.innerHTML = `- ₹${item.amount}`;
        trans_label.appendChild(trans_val);

        delete_btn = document.createElement('button');
        delete_btn.setAttribute('data_id', item.id);
        delete_btn.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
        delete_btn.addEventListener('click', onDelete);
        trans_label.appendChild(delete_btn);

        list_item.appendChild(trans_label);
        trans_list.appendChild(list_item);
    }
}

init();

