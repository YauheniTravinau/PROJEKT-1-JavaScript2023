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
    incomeTable.innerHTML = "";
    for (let i = 0; i < incomeList.length; i++) {
        let row = `
      <tr>
        <td>${incomeList[i].name}</td>
        <td>${incomeList[i].amount} zl</td>
        <td>
          <button class="btn btn-sm btn-warning edit-income" data-index="${i}" onclick="Edytuj(${i}, incomeList, displayIncomeList)">
           Edytuj
          </button>
          <button class="btn btn-sm btn-danger delete-income" data-index="${i}">
            Usun
          </button>
        </td>
      </tr>
    `;
        incomeTable.innerHTML += row;
    }
}

function Edytuj(index, list, displayFunction) {
    let newName = prompt("Podaj nowa nazwe:");
    let newAmount = prompt("Podaj nowa kwote:");

    // sprawdzenie, czy pole jest puste
    if (newName.trim() === "" || newAmount.trim() === "") {
        alert("Nazwa i kwota nie mogą byc puste!");
        return;
    }

    // sprawdzenie poprawności wprowadzonej liczby
    if (isNaN(parseFloat(newAmount))) {
        alert("Podana kwota jest nieprawidlowa!");
        return;
    }

    // aktualizacja wartości w tablicy
    list[index].name = newName;
    list[index].amount = parseFloat(newAmount);

    // odświeżenie tabeli
    displayFunction();

    // aktualizacja salda
    updateBalance();
}

// Funkcja wyświetlająca listę wydatków
function displayExpenseList() {
    expenseTable.innerHTML = "";
    for (let i = 0; i < expenseList.length; i++) {
        let row = `
      <tr>
        <td>${expenseList[i].name}</td>
        <td>${expenseList[i].amount} zl</td>
        <td>
          <button class="btn btn-sm btn-warning edit-expense" data-index="${i}" onclick="Edytuj(${i}, expenseList, displayExpenseList)">
           Edytuj
          </button>
          <button class="btn btn-sm btn-danger delete-expense" data-index="${i}">
            Usun
          </button>
        </td>
      </tr>
    `;
        expenseTable.innerHTML += row;
    }
}

// Funkcja aktualizująca stan bilansu, aktualizująca wartości i wyświetlająca informacje o bilansie
function updateBalance() {
// Pobierz elementy DOM reprezentujące wartości całkowite przychodów i wydatków
    let incomeTotal = document.getElementById("income-total");
    let expenseTotal = document.getElementById("expense-total");
    // Oblicz i wyświetl wartości całkowite przychodów i wydatków
    incomeTotal.textContent = calculateIncomeTotal().toFixed(2);
    expenseTotal.textContent = calculateExpenseTotal().toFixed(2);

// Oblicz i wyświetl bilans
    let totalIncome = calculateIncomeTotal();
    let totalExpense = calculateExpenseTotal();
    let balanceAmount = totalIncome - totalExpense;
    let balanceMessage = document.getElementById("balance-message");
    let balance = document.getElementById("balance");

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
    let nameInput = document.getElementById("income-name");
    let amountInput = document.getElementById("income-amount");

    let name = nameInput.value;
    let amount = parseFloat(amountInput.value);

    if (name && amount) {
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
    let nameInput = document.getElementById("expense-name");
    let amountInput = document.getElementById("expense-amount");

    let name = nameInput.value;
    let amount = parseFloat(amountInput.value);

    if (name && amount) {
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

