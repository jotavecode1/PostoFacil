document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const loginScreen = document.getElementById('login-screen');
    const appContainer = document.getElementById('app-container');
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');
    
    const amountChargeInput = document.getElementById('amount-to-charge');
    const amountPaidInput = document.getElementById('amount-paid');
    const resultArea = document.getElementById('result-area');
    const statusMessage = document.getElementById('status-message');
    const changeDisplay = document.getElementById('change-display');
    const changeValue = document.getElementById('change-value');
    const visualChangeArea = document.getElementById('visual-change-area');
    const historyList = document.getElementById('history-list');
    const finalizeBtn = document.getElementById('finalize-btn');

    // Shift Change Elements
    const shiftProdInput = document.getElementById('shift-prod');
    const shiftCodeInput = document.getElementById('shift-code');
    const shiftQtyInput = document.getElementById('shift-qty');
    const shiftTotalInput = document.getElementById('shift-total');
    const addShiftItemBtn = document.getElementById('add-shift-item-btn');
    const shiftList = document.getElementById('shift-list');
    const printShiftBtn = document.getElementById('print-shift-btn');
    const printHistoryBtn = document.getElementById('print-history-btn');

    // Modal Elements
    const passwordModal = document.getElementById('password-modal');
    const adminPasswordInput = document.getElementById('admin-password');
    const passwordError = document.getElementById('password-error');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    const confirmDeleteBtn = document.getElementById('confirm-delete');

    const editModal = document.getElementById('edit-modal');
    const editInfo = document.getElementById('edit-info');
    const itemsList = document.getElementById('items-list');
    const newItemNameInput = document.getElementById('new-item-name');
    const addItemBtn = document.getElementById('add-item-btn');
    const closeEditBtn = document.getElementById('close-edit');

    // State
    let currentUser = null;
    let currentCharge = 0;
    let currentPaid = 0;
    let currentChange = 0;
    
    // Transactions Store (In-memory for now)
    let transactions = [];
    let transactionToDeleteId = null;
    let transactionToEditId = null;

    // Shift Items Store
    let shiftItems = [];

    // Valid Users
    const validUsers = ['joao', 'isaque', 'luan', 'gabriel', 'bruno', 'marina', 'luiz', 'murilo'];

    // Login Logic
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = usernameInput.value.trim().toLowerCase();
        const pass = passwordInput.value.trim();

        if (validUsers.includes(user) && pass === '1') {
            currentUser = user.charAt(0).toUpperCase() + user.slice(1);
            loginScreen.classList.add('hidden');
            appContainer.classList.remove('hidden');
            document.getElementById('operator-name').textContent = currentUser;
            loginError.textContent = '';
        } else {
            loginError.textContent = 'Usuário ou senha incorretos.';
            passwordInput.value = '';
        }
    });

    logoutBtn.addEventListener('click', () => {
        currentUser = null;
        loginScreen.classList.remove('hidden');
        appContainer.classList.add('hidden');
        usernameInput.value = '';
        passwordInput.value = '';
        resetCalculator();
    });

    // Tabs Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => {
                c.classList.add('hidden');
                c.classList.remove('active');
            });

            // Add active class to clicked button and target content
            btn.classList.add('active');
            const targetId = `tab-${btn.dataset.tab}`;
            const targetContent = document.getElementById(targetId);
            targetContent.classList.remove('hidden');
            targetContent.classList.add('active');
        });
    });

    // Calculator Logic
    function calculateChange() {
        const charge = parseFloat(amountChargeInput.value);
        const paid = parseFloat(amountPaidInput.value);

        // Reset UI if inputs are empty or invalid
        if (isNaN(charge) || isNaN(paid)) {
            statusMessage.textContent = 'Aguardando valores...';
            statusMessage.classList.remove('hidden');
            changeDisplay.classList.add('hidden');
            visualChangeArea.innerHTML = '';
            finalizeBtn.classList.add('hidden');
            return;
        }

        const diff = paid - charge;

        if (diff < 0) {
            // Insufficient funds
            statusMessage.textContent = `Falta: ${formatCurrency(Math.abs(diff))}`;
            statusMessage.style.color = '#d32f2f';
            statusMessage.classList.remove('hidden');
            changeDisplay.classList.add('hidden');
            visualChangeArea.innerHTML = '';
            finalizeBtn.classList.add('hidden');
        } else {
            // Calculate change
            statusMessage.classList.add('hidden');
            changeDisplay.classList.remove('hidden');
            changeValue.textContent = formatCurrency(diff);
            
            // Store current values for history
            currentCharge = charge;
            currentPaid = paid;
            currentChange = diff;

            renderMoney(diff);
            finalizeBtn.classList.remove('hidden');
        }
    }

    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }

    function renderMoney(amount) {
        visualChangeArea.innerHTML = '';
        
        if (amount === 0) {
            visualChangeArea.innerHTML = '<div style="color: #666; font-size: 1.2rem;">Sem troco.</div>';
            return;
        }

        // Denominations in cents (Removed cents < 1 Real as requested)
        const denominations = [
            { val: 20000, type: 'note', label: '200' },
            { val: 10000, type: 'note', label: '100' },
            { val: 5000, type: 'note', label: '50' },
            { val: 2000, type: 'note', label: '20' },
            { val: 1000, type: 'note', label: '10' },
            { val: 500, type: 'note', label: '5' },
            { val: 200, type: 'note', label: '2' },
            { val: 100, type: 'coin', label: '1' }
        ];

        let remaining = Math.round(amount * 100);
        let delay = 0;

        denominations.forEach(denom => {
            const count = Math.floor(remaining / denom.val);
            if (count > 0) {
                remaining %= denom.val;
                createMoneyElement(denom, count, delay);
                delay += 0.1;
            }
        });
    }

    function createMoneyElement(denom, count, delay) {
        const wrapper = document.createElement('div');
        wrapper.className = 'money-item';
        wrapper.style.animationDelay = `${delay}s`;

        const countBadge = document.createElement('div');
        countBadge.className = 'money-count';
        countBadge.textContent = `${count}x`;

        const moneyVisual = document.createElement('div');
        if (denom.type === 'note') {
            moneyVisual.className = `note note-${denom.label}`;
            moneyVisual.textContent = `R$ ${denom.label}`;
        } else {
            moneyVisual.className = `coin coin-${denom.label.replace('.', '-')}`;
            moneyVisual.textContent = denom.label;
        }

        wrapper.appendChild(countBadge);
        wrapper.appendChild(moneyVisual);
        visualChangeArea.appendChild(wrapper);
    }

    // Finalize Button Logic
    finalizeBtn.addEventListener('click', () => {
        addToHistory(currentCharge, currentPaid, currentChange);
        resetCalculator();
    });

    function addToHistory(charge, paid, change) {
        const id = Date.now();
        const now = new Date();
        const transaction = {
            id,
            charge,
            paid,
            change,
            timestamp: now,
            items: []
        };
        
        transactions.unshift(transaction);
        renderHistory();
    }

    function renderHistory() {
        historyList.innerHTML = '';
        
        if (transactions.length === 0) {
            historyList.innerHTML = '<div class="empty-history">Nenhuma transação recente.</div>';
            return;
        }

        transactions.forEach(t => {
            const item = document.createElement('div');
            item.className = 'history-item';
            
            const timeString = t.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            const itemsCount = t.items.length > 0 ? `<div style="font-size: 0.8rem; color: #666; margin-top: 5px;">${t.items.length} item(s)</div>` : '';

            item.innerHTML = `
                <span class="time">${timeString}</span>
                <div class="details">
                    <span>Cobrado:</span>
                    <strong>${formatCurrency(t.charge)}</strong>
                </div>
                <div class="details">
                    <span>Pago:</span>
                    <strong>${formatCurrency(t.paid)}</strong>
                </div>
                <span class="change-highlight">Troco: ${formatCurrency(t.change)}</span>
                ${itemsCount}
                <div class="history-actions">
                    <button class="action-btn edit" onclick="openEditModal(${t.id})">Editar</button>
                    <button class="action-btn delete" onclick="requestDelete(${t.id})">Excluir</button>
                </div>
            `;
            historyList.appendChild(item);
        });
    }

    function resetCalculator() {
        amountChargeInput.value = '';
        amountPaidInput.value = '';
        statusMessage.textContent = 'Aguardando valores...';
        statusMessage.classList.remove('hidden');
        statusMessage.style.color = '#888';
        changeDisplay.classList.add('hidden');
        visualChangeArea.innerHTML = '';
        finalizeBtn.classList.add('hidden');
        amountChargeInput.focus();
    }

    // Shift Change Logic
    addShiftItemBtn.addEventListener('click', () => {
        const prod = shiftProdInput.value.trim();
        const code = shiftCodeInput.value.trim();
        const qty = parseInt(shiftQtyInput.value);
        const total = parseFloat(shiftTotalInput.value);

        if (prod && code && qty > 0 && !isNaN(total)) {
            shiftItems.push({ prod, code, qty, total });
            renderShiftItems();
            
            // Clear inputs
            shiftProdInput.value = '';
            shiftCodeInput.value = '';
            shiftQtyInput.value = '';
            shiftTotalInput.value = '';
            shiftProdInput.focus();
        } else {
            alert('Preencha todos os campos corretamente.');
        }
    });

    function renderShiftItems() {
        shiftList.innerHTML = '';
        shiftItems.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.prod}</td>
                <td>${item.code}</td>
                <td>${item.qty}</td>
                <td>${formatCurrency(item.total)}</td>
                <td><span class="remove-item" onclick="removeShiftItem(${index})">&times;</span></td>
            `;
            shiftList.appendChild(tr);
        });
    }

    window.removeShiftItem = function(index) {
        shiftItems.splice(index, 1);
        renderShiftItems();
    };

    // Printing Logic
    printHistoryBtn.addEventListener('click', () => {
        document.body.classList.add('printing-history');
        window.print();
        document.body.classList.remove('printing-history');
    });

    printShiftBtn.addEventListener('click', () => {
        document.body.classList.add('printing-shift');
        window.print();
        document.body.classList.remove('printing-shift');
    });

    // Delete Logic
    window.requestDelete = function(id) {
        transactionToDeleteId = id;
        passwordModal.classList.remove('hidden');
        adminPasswordInput.value = '';
        passwordError.textContent = '';
        adminPasswordInput.focus();
    };

    cancelDeleteBtn.addEventListener('click', () => {
        passwordModal.classList.add('hidden');
        transactionToDeleteId = null;
    });

    confirmDeleteBtn.addEventListener('click', () => {
        const pass = adminPasswordInput.value;
        if (pass === '1') {
            transactions = transactions.filter(t => t.id !== transactionToDeleteId);
            renderHistory();
            passwordModal.classList.add('hidden');
            transactionToDeleteId = null;
        } else {
            passwordError.textContent = 'Senha incorreta.';
        }
    });

    // Edit Logic
    window.openEditModal = function(id) {
        transactionToEditId = id;
        const t = transactions.find(tr => tr.id === id);
        if (!t) return;

        editInfo.innerHTML = `
            <p><strong>Valor:</strong> ${formatCurrency(t.charge)}</p>
            <p><strong>Data:</strong> ${t.timestamp.toLocaleString('pt-BR')}</p>
        `;
        
        renderItemsList(t.items);
        editModal.classList.remove('hidden');
        newItemNameInput.focus();
    };

    function renderItemsList(items) {
        itemsList.innerHTML = '';
        items.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${item}</span>
                <span class="remove-item" onclick="removeItem(${index})">&times;</span>
            `;
            itemsList.appendChild(li);
        });
    }

    window.removeItem = function(index) {
        const t = transactions.find(tr => tr.id === transactionToEditId);
        if (t) {
            t.items.splice(index, 1);
            renderItemsList(t.items);
        }
    };

    addItemBtn.addEventListener('click', () => {
        const name = newItemNameInput.value.trim();
        if (name) {
            const t = transactions.find(tr => tr.id === transactionToEditId);
            if (t) {
                t.items.push(name);
                renderItemsList(t.items);
                newItemNameInput.value = '';
                newItemNameInput.focus();
            }
        }
    });

    // Allow pressing Enter to add item
    newItemNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addItemBtn.click();
        }
    });

    closeEditBtn.addEventListener('click', () => {
        editModal.classList.add('hidden');
        transactionToEditId = null;
        renderHistory(); // Re-render to show item count update
    });

    // Event Listeners for Inputs
    amountChargeInput.addEventListener('input', calculateChange);
    amountPaidInput.addEventListener('input', calculateChange);

});
