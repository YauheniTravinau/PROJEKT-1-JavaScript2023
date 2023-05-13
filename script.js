// Deklaracja zmiennych
const incomeForm = document.getElementById("income-form");
const expenseForm = document.getElementById("expense-form");
const incomeTable = document.getElementById("income-table");
const expenseTable = document.getElementById("expense-table");
const balanceMessage = document.getElementById("balance-message");
const balance = document.getElementById("balance");


let incomeList = [];
let expenseList = [];

// Funkcja dodająca wpis do listy przychodów
function addIncomeToList(name, amount) {
    incomeList.push({ name, amount });
    updateBalance();
}

// Funkcja dodająca wpis do listy wydatków
function addExpenseToList(name, amount) {
    expenseList.push({ name, amount });
    updateBalance();
}

// Funkcja obliczająca sumę przychodów
function calculateIncomeTotal() {
    let sum = 0;
    for (let i = 0; i < incomeList.length; i++) {
        sum += incomeList[i].amount;
    }
    return sum;
}

// Funkcja obliczająca sumę wydatków
function calculateExpenseTotal() {
    let sum = 0;
    for (let i = 0; i < expenseList.length; i++) {
        sum += expenseList[i].amount;
    }
    return sum;
}

// Funkcja wyświetlająca listę przychodów
function displayIncomeList() {
    while (incomeTable.firstChild) {
        incomeTable.firstChild.remove();
    }

    for (let i = 0; i < incomeList.length; i++) {
        const row = createTableRow(
            incomeList[i].name,
            incomeList[i].amount,
            i,
            "income"
        );
        incomeTable.appendChild(row);
    }
}

// Funkcja edytująca: obsługuje edycję wpisu
function editEntry(index, list, displayFunction) {
    const newName = prompt("Podaj nowa nazwe:", list[index].name);
    const newAmount = prompt("Podaj nowa kwote:", list[index].amount);

    // Sprawdzenie, czy pole jest puste
    if (newName.trim() === "" || newAmount.trim() === "") {
        alert("Nazwa i kwota nie mogą byc puste!");
        return;
    }

    // Sprawdzenie poprawności wprowadzonej liczby
    if (isNaN(parseFloat(newAmount))) {
        alert("Podana kwota jest nieprawidlowa!");
        return;
    }

    // Aktualizacja wartości w tablicy
    list[index].name = newName;
    list[index].amount = parseFloat(newAmount);

    // Odświeżenie tabeli
    displayFunction();

    // Aktualizacja salda
    updateBalance();
}

// Funkcja wyświetlająca listę wydatków
function displayExpenseList() {
    while (expenseTable.firstChild) {
        expenseTable.firstChild.remove();
    }

    for (let i = 0; i < expenseList.length; i++) {
        const row = createTableRow(
            expenseList[i].name,
            expenseList[i].amount,
            i,
            "expense"
        );
        expenseTable.appendChild(row);
    }
}

// Funkcja tworząca wiersz tabeli
function createTableRow(name, amount, index, type) {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    const amountCell = document.createElement("td");
    const actionCell = document.createElement("td");
    const editButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    nameCell.textContent = name;
    amountCell.textContent = `${amount.toFixed(2)} zl`;

    editButton.classList.add("btn", "btn-sm", "btn-warning");
    editButton.textContent = "Edytuj";
    editButton.dataset.index = index;
    editButton.addEventListener("click", function () {
        editEntry(index, type === "income" ? incomeList : expenseList, type === "income" ? displayIncomeList : displayExpenseList);
    });

    deleteButton.classList.add("btn", "btn-sm", "btn-danger");
    deleteButton.textContent = "Usun";
    deleteButton.dataset.index = index;
    deleteButton.addEventListener("click", function () {
        deleteEntry(index, type === "income" ? incomeList : expenseList, type === "income" ? displayIncomeList : displayExpenseList);
    });

    // Funkcja usuwająca wpis z listy
    function deleteEntry(index, list, displayList) {
        list.splice(index, 1);
        displayList();
        updateBalance();
    }

    actionCell.appendChild(editButton);
    actionCell.appendChild(deleteButton);

    row.appendChild(nameCell);
    row.appendChild(amountCell);
    row.appendChild(actionCell);

    return row;
}

// Funkcja aktualizująca stan bilansu, aktualizująca wartości i wyświetlająca informacje o bilansie
function updateBalance() {
// Pobierz elementy DOM reprezentujące wartości całkowite przychodów i wydatków
    const incomeTotal = document.getElementById("income-total");
    const expenseTotal = document.getElementById("expense-total");
    // Oblicz i wyświetl wartości całkowite przychodów i wydatków
    incomeTotal.textContent = calculateIncomeTotal().toFixed(2);
    expenseTotal.textContent = calculateExpenseTotal().toFixed(2);

// Oblicz i wyświetl bilans
    const totalIncome = calculateIncomeTotal();
    const totalExpense = calculateExpenseTotal();
    const balanceAmount = totalIncome - totalExpense;
    const balanceMessage = document.getElementById("balance-message");
    const balance = document.getElementById("balance");

    balance.textContent = balanceAmount.toFixed(2);

    if (balanceAmount > 0) {
        balanceMessage.textContent = `Mozesz jeszcze wydac ${balanceAmount.toFixed(2)} zl`;
        balanceMessage.classList.remove("text-danger");
        balanceMessage.classList.add("text-success");
        balance.innerText = `${balanceAmount.toFixed(2)} zl`;
    } else if (balanceAmount < 0) {
        balanceMessage.textContent = `Bilans jest ujemny. Jestes na minusie ${(-balanceAmount).toFixed(2)} zl`;
        balanceMessage.classList.remove("text-success");
        balanceMessage.classList.add("text-danger");
        balance.innerText = `${balanceAmount.toFixed(2)} zl`;
    } else {
        balanceMessage.textContent = "Twoj bilans wynosi 0 zl";
        balanceMessage.classList.remove("text-danger");
        balanceMessage.classList.remove("text-success");
        balance.innerText = "0 zl";
    }
}
// Funkcja obsługująca przesyłanie formularza z wpływami
incomeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const nameInput = document.getElementById("income-name");
    const amountInput = document.getElementById("income-amount");
    const name = nameInput.value.trim();
    const amount = parseFloat(amountInput.value);

    if (name !== "" && !isNaN(amount) && amount > 0) {
        addIncomeToList(name, amount);
        nameInput.value = "";
        amountInput.value = "";

        displayIncomeList();
        updateBalance();
    }
});

// Funkcja obsługująca przesyłanie formularza z wydatkami
expenseForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const nameInput = document.getElementById("expense-name");
    const amountInput = document.getElementById("expense-amount");
    const name = nameInput.value.trim();
    const amount = parseFloat(amountInput.value);

    if (name !== "" && !isNaN(amount) && amount > 0) {
        addExpenseToList(name, amount);
        nameInput.value = "";
        amountInput.value = "";

        displayExpenseList();
        updateBalance();
    }
});

// Jeśli różnica wynosi 0
balanceMessage.innerText = "Balans wynosi 0";
balanceMessage.classList.remove("text-danger");
balanceMessage.classList.remove("text-success");
balance.innerText = "0 zl";

// Funkcja obsługująca dodawanie przychodu
function handleIncomeSubmit(event) {
    event.preventDefault();
    const nameInput = document.getElementById("income-name");
    const amountInput = document.getElementById("income-amount");
    const name = nameInput.value.trim();
    const amount = parseFloat(amountInput.value.trim().replace(",", "."));
    if (name === "" || isNaN(amount) || amount <= 0) {
        return;
    }
    addIncomeToList(name, amount);
    displayIncomeList();
    updateBalance();
    nameInput.value = "";
    amountInput.value = "";
}

// Funkcja obsługująca dodawanie wydatku
function handleExpenseSubmit(event) {
    event.preventDefault();
    const nameInput = document.getElementById("expense-name");
    const amountInput = document.getElementById("expense-amount");
    const name = nameInput.value.trim();
    const amount = parseFloat(amountInput.value.trim().replace(",", "."));
    if (name === "" || isNaN(amount) || amount <= 0) {
        return;
    }
    addExpenseToList(name, amount);
    displayExpenseList();
    updateBalance();
    nameInput.value = "";
    amountInput.value = "";
}

// Funkcja obsługująca usuwanie przychodu
function handleIncomeDelete(event) {
    const index = event.target.dataset.index;
    incomeList.splice(parseInt(index), 1);
    displayIncomeList();
    updateBalance();
}

// Funkcja obsługująca usuwanie wydatku
function handleExpenseDelete(event) {
    const index = parseInt(event.target.dataset.index);
    expenseList.splice(index, 1);
    displayExpenseList();
    updateBalance();
}


// Obsługa zdarzeń
incomeForm.addEventListener("submit", handleIncomeSubmit);
expenseForm.addEventListener("submit", handleExpenseSubmit);
incomeTable.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-income")) {
        handleIncomeDelete(event);
    }
});
expenseTable.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-expense")) {
        handleExpenseDelete(event);
    }
});

// Wywołanie funkcji inicjujących
displayIncomeList();
displayExpenseList();
updateBalance();

