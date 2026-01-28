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

    // Product Database
    const productDatabase = [
        { code: '505', name: 'ISQUEIRO MINI' },
        { code: '2527', name: 'ISQUEIRO MAX' },
        { code: '1890', name: 'PRES. PRUDENCE' },
        { code: '2482', name: 'SUPER BOND' },
        { code: '4211', name: 'PALHEIROS PARATY' },
        { code: '3595', name: 'FUMO MASCAR STOCKER' },
        { code: '4262', name: 'PALHEIROS SAVANNA' },
        { code: '3592', name: 'PALHEIROS SANTROPEZ' },
        { code: '3659', name: 'SEDA PAPELITO' },
        { code: '3593', name: 'SEDA SMOKING' },
        { code: '3656', name: 'OCULOS BR BRASIL' },
        { code: '648', name: 'CARVAO VILA RICA' },
        { code: '2250', name: 'CARVAO SÃO JOSÉ' },
        { code: '582', name: 'ERVA YACUI NATURAL' },
        { code: '519', name: 'CHOCO KINDER OVO' },
        { code: '130', name: 'KINDER JOY' },
        { code: '357', name: 'CHOCO M&M TUBO' },
        { code: '2490', name: 'CAIXA BOMBOM' },
        { code: '308', name: 'CHOCO BIS CAIXA' },
        { code: '397', name: 'LEITE LIDER' },
        { code: '319', name: 'MIOJO NISSIN' },
        { code: '757', name: 'CAFÉ JAGUARI' },
        { code: '3620', name: 'CAFÉ CABOCLO' },
        { code: '3157', name: 'LEITE CONDENSADO' },
        { code: '2475', name: 'CREME DE LEITE' },
        { code: '1141', name: 'NESCAU 2.0' },
        { code: '3116', name: 'LEITE NINHO LATA' },
        { code: '2695', name: 'BALA FINI' },
        { code: '3171', name: 'BISCOITO TRAKINAS' },
        { code: '1224', name: 'PULLMAN PÃO FORMA' },
        { code: '1225', name: 'PULLMAN' },
        { code: '3249', name: 'BOM AR' },
        { code: '3248', name: 'AMACIANTE DIVERSOS' },
        { code: '1250', name: 'SABÃO EM PÓ OMO' },
        { code: '2478', name: 'SABONETE DIVERSOS' },
        { code: '2986', name: 'GILLETE/PRESTOBARBA' },
        { code: '2619', name: 'ABSORVENTE' },
        { code: '2735', name: 'SHAMPOO' },
        { code: '2553', name: 'CONDICIONADOR' },
        { code: '4202', name: 'S.FRITOP BATATA 130G' },
        { code: '4203', name: 'S.FRITOP BATATA 50G' },
        { code: '4204', name: 'S. POLVILHO FRITOP' },
        { code: '76', name: 'AMENDOIM MARIA' },
        { code: '1734', name: 'POLVILHO TICK TITOS' },
        { code: '543', name: 'PURURUCA CAIPIRA' },
        { code: '3616', name: 'SALGADINHO FRITOP' },
        { code: '380', name: 'ELMA RUFFLES 75 GR' },
        { code: '2230', name: 'ELMA RUFFLES 115 GR' },
        { code: '2899', name: 'ELMA DORITOS DINAM' },
        { code: '372', name: 'ELMA DORITOS 75 GR' },
        { code: '2337', name: 'ELMA DORITOS 120 GR' },
        { code: '2770', name: 'BATATA PRINGLES' },
        { code: '703', name: 'ELMA BATATA STAX' },
        { code: '2262', name: 'ELMA FANDANGOS 105' },
        { code: '376', name: 'ELMA SENSAÇÕES' },
        { code: '2265', name: 'ELMA CHEETOS 105 GR' },
        { code: '410', name: 'ELMA CEBOLITOS' },
        { code: '2599', name: 'ELMA BACONZITO' },
        { code: '3596', name: 'MANTEIGA' },
        { code: '1149', name: 'MARGARINA QUALY' },
        { code: '1150', name: 'REQUEIJÃO CREMOSO' },
        { code: '144', name: 'TODDYNHO' },
        { code: '1972', name: 'NESTLE NESCAU FATOR' },
        { code: '1020', name: 'AGUA DE COCO' },
        { code: '3074', name: 'CHAMYTO BIG' },
        { code: '3211', name: 'SUCO LIFE 300ML' },
        { code: '938', name: 'SUCO PRATS 300ML' },
        { code: '939', name: 'SUCO PRATS 900ML' },
        { code: '3225', name: 'SUCO LIFE 900ML' },
        { code: '4137', name: 'SUCO PRATS 1,5L' },
        { code: '4391', name: 'SUCO LIFE 1,5L' },
        { code: '78', name: 'SUCO DEL VALE PET' },
        { code: '2684', name: 'CHÁ FUZE LEÃO ICE TEA' },
        { code: '3048', name: 'PERDIGÃO MORTADELA' },
        { code: '3212', name: 'COCA/PEPSI… 200ML' },
        { code: '302', name: 'SPRITE LATA' },
        { code: '2195', name: 'AGUA CRYSTAL 500ML' },
        { code: '2318', name: 'AGUA CRYSTAL 1,5 LT' },
        { code: '825', name: 'SANTA INES 500ML' },
        { code: '917', name: 'SANTA INES 1,5L' },
        { code: '3645', name: 'ENERGETICO BALY 2L' },
        { code: '208', name: 'ENERG 8 SEGUNDO 2L' },
        { code: '2150', name: 'REFRI H2O 2 LITROS' },
        { code: '1033', name: 'PAO FRANCES' },
        { code: '1576', name: 'HEINEKEN LONG' },
        { code: '753', name: 'HEINEKEN LATA' },
        { code: '3904', name: 'PATAGONIA IPA LONG' },
        { code: '537', name: 'STELLA LONG' },
        { code: '3903', name: 'SPATEN LONG' },
        { code: '3206', name: 'CORONA LONG' },
        { code: '4030', name: 'IMPÉRIO LONG' },
        { code: '1899', name: 'SPATEN LATA' },
        { code: '3015', name: 'IMPERIO LATA' },
        { code: '638', name: 'VODKA SMIRNOFF 1L' },
        { code: '2919', name: 'VODKA SKYY 1L' },
        { code: '575', name: 'VODKA ASKOV 1L' },
        { code: '1879', name: 'ASKOV GIN DIV. 1L' },
        { code: '738', name: 'ASKOV FUNFUN' },
        { code: '3407', name: 'COROTE' },
        { code: '3000', name: 'EISENBAHN' },
        { code: '2351', name: 'AMSTEL LONG' },
        { code: '4641', name: 'AMSTEL ULTRA LATA' },
        { code: '651', name: 'BUDWEISER LONG' },
        { code: '221', name: 'BRAHMA DUPLO MALT' },
        { code: '660', name: 'BUDWEISER LATA' },
        { code: '2716', name: 'AMSTEL LATA' },
        { code: '83', name: 'ANTARTICA BOA LATA' },
        { code: '227', name: 'VINHOS CRIVELIM' },
        { code: '0', name: 'VINHOS DIVERSOS' },
        { code: '0', name: 'COOLERS DIVERSOS' },
        { code: '926', name: 'CER.SKOL BEATS LONG' },
        { code: '3487', name: 'SMIRNOFF ICE' },
        { code: '4258', name: 'VODKA ASKOV GIN ICE' },
        { code: '993', name: 'VODKA ASKOV ICE' },
        { code: '108', name: 'ORIGINAL LATA' },
        { code: '85', name: 'SUB ZERO LATA' },
        { code: '2572', name: 'BAVARIA LATA' },
        { code: '724', name: 'BAVARIA LATÃO' },
        { code: '2734', name: 'CERV. SKOL BEATS LATA' },
        { code: '2279', name: 'JACK DANIELS COCA' },
        { code: '3611', name: 'JACK DANIELS HONEY' },
        { code: '1021', name: 'BURGUESA LATA' },
        { code: '2389', name: 'SKOL LATA' },
        { code: '964', name: 'BRAHMA LATA' },
        { code: '1028', name: 'SKOL LATÃO' },
        { code: '695', name: 'AMSTEL LATÃO' },
        { code: '2942', name: 'SADIA HOT POCKET' },
        { code: '2943', name: 'PIZZA' },
        { code: '4142', name: 'PUDIM 500G' },
        { code: '4143', name: 'PUDIM 1KG' },
        { code: '974', name: 'RED BULL PEQ 250ML' },
        { code: '2689', name: 'RED BULL MED 355ML' },
        { code: '2692', name: 'RED BULL G 473ML' },
        { code: '781', name: 'TNT P 269ML' },
        { code: '3331', name: 'TNT G 473ML' },
        { code: '3916', name: 'ENERG BALY LATA 473' },
        { code: '2344', name: 'GATORADE DIVERSOS' },
        { code: '680', name: 'POWERADE DIVERSOS' },
        { code: '252', name: 'SPRITE FRESH' },
        { code: '2336', name: 'H2O/LIMONETO' },
        { code: '3636', name: 'CORONA LONG ZERO' },
        { code: '273', name: 'HEINEKEN ZERO LONG' },
        { code: '882', name: 'BRAHMA ZERO LATA' },
        { code: '3070', name: '8 SEGUNDOS 1L' },
        { code: '1414', name: 'TUBAINA PET 350 ML' },
        { code: '2625', name: 'GUARANA 600ML' },
        { code: '3125', name: 'SPRITE 600ML' },
        { code: '1753', name: 'FANTA 600ML' },
        { code: '3193', name: 'REFRI TUB. FUNADA 2L' },
        { code: '152', name: 'FANTA 2L' },
        { code: '154', name: 'GUARANA ANTARTIC 2L' },
        { code: '291', name: 'SPRITE 2L' },
        { code: '3187', name: 'COCA CAFÉ' },
        { code: '3400', name: 'FANTA 220ML' },
        { code: '302', name: 'SPRITE LATA' },
        { code: '160', name: 'FANTA LATA' },
        { code: '158', name: 'COCA LATA' },
        { code: '4138', name: 'COPO DA FELICIDADE' },
        { code: '4140', name: 'MOUSSE DE LIMÃO' },
        { code: '4141', name: 'PUDIM PEQUENO' },
        { code: '2680', name: 'PEPSI/TWIST LATA' },
        { code: '126', name: 'GUARANA LATA' },
        { code: '164', name: 'CITRUS LATA' },
        { code: '113', name: 'TONICA LATA' },
        { code: '754', name: 'COCA 1L' },
        { code: '156', name: 'COCA 600ML' },
        { code: '150', name: 'COCA 2L' },
        { code: '15', name: 'MONSTER LATA 473ML' },
        { code: '3210', name: 'KIBON POTE 800 ML' },
        { code: '4412', name: 'GRESP PÃO DE BATATA' },
        { code: '1126', name: 'PÃO DE QUEIJO' },
        { code: '2278', name: 'SALGADOS RENATA' },
        { code: '3807', name: 'SALGADOS DU MARIO' },
        { code: '3454', name: 'SALGADOS MISTER' },
        { code: '2949', name: 'CAFÉ CAP' },
        { code: '1124', name: 'BEBIDAS NESTLE' },
        { code: '1423', name: 'BONÉ DIVERSOS' },
        { code: '794', name: 'PAÇOCA/DOCES DIV' },
        { code: '3170', name: 'CHOC. TRENTO' },
        { code: '434', name: 'CHOC. BATON' },
        { code: '2635', name: 'MENTOS POTE' },
        { code: '2347', name: 'CHOCO TALENTO' },
        { code: '668', name: 'CHOCO KIT KAT' },
        { code: '3796', name: 'CACHAÇA DI MINAS' },
        { code: '4419', name: 'CAMISETAS YLD' }
    ];

    // Welcome Overlay Elements
    const welcomeOverlay = document.getElementById('welcome-overlay');
    const welcomeMessageTitle = document.getElementById('welcome-message-title');
    const mainSidebar = document.getElementById('main-sidebar');

    // Login Logic
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = usernameInput.value.trim().toLowerCase();
        const pass = passwordInput.value.trim();

        if (validUsers.includes(user) && pass === '1') {
            currentUser = user.charAt(0).toUpperCase() + user.slice(1);
            
            // Show Welcome Message
            loginScreen.classList.add('hidden');
            welcomeOverlay.classList.remove('hidden');
            welcomeMessageTitle.textContent = `Bem-vindo, ${currentUser}!`;
            
            document.getElementById('operator-name').textContent = currentUser;
            loginError.textContent = '';

            // Transition to App after delay
            setTimeout(() => {
                welcomeOverlay.classList.add('hidden');
                appContainer.classList.remove('hidden');
                // Default to Home tab
                document.querySelector('.tab-btn[data-tab="home"]').click();
            }, 2000);

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
        // Reset to Home tab for next login (visually)
        document.querySelector('.tab-btn[data-tab="home"]').click();
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

            // Sidebar Visibility Logic
            if (btn.dataset.tab === 'troco') {
                mainSidebar.classList.remove('hidden');
            } else {
                mainSidebar.classList.add('hidden');
            }
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
    // Shift Change Logic
    addShiftItemBtn.addEventListener('click', () => {
        const prod = shiftProdInput.value.trim();
        const code = shiftCodeInput.value.trim();
        let qty = parseInt(shiftQtyInput.value);
        let total = parseFloat(shiftTotalInput.value);

        // Default quantity to 1 if invalid or empty
        if (isNaN(qty) || qty < 1) {
            qty = 1;
        }

        // Allow total to be optional (NaN if empty)
        // We only require Product Name. Code is optional but usually present.
        if (prod) {
            shiftItems.push({ prod, code, qty, total: isNaN(total) ? 0 : total });
            renderShiftItems();
            
            // Clear inputs
            shiftProdInput.value = '';
            shiftCodeInput.value = '';
            shiftQtyInput.value = '';
            shiftTotalInput.value = '';
            shiftCodeInput.focus(); // Focus back to code
        } else {
            alert('O nome do produto é obrigatório.');
        }
    });

    // Auto-fill Product Info
    shiftCodeInput.addEventListener('input', () => {
        const code = shiftCodeInput.value.trim();
        const product = productDatabase.find(p => p.code === code);
        if (product) {
            shiftProdInput.value = product.name;
        }
    });

    shiftProdInput.addEventListener('input', () => {
        const name = shiftProdInput.value.trim().toUpperCase();
        // Find exact match or partial match if needed. Using exact for now to avoid conflicts.
        const product = productDatabase.find(p => p.name === name);
        if (product) {
            shiftCodeInput.value = product.code;
        }
    });

    // Enter key navigation for Shift Change
    shiftCodeInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const code = shiftCodeInput.value.trim();
            const product = productDatabase.find(p => p.code === code);
            
            if (product) {
                shiftProdInput.value = product.name;
                shiftProdInput.focus();
            } else {
                shiftProdInput.value = '';
                shiftCodeInput.focus();
                shiftCodeInput.select();
            }
        }
    });

    shiftProdInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addShiftItemBtn.click();
        }
    });

    function renderShiftItems() {
        shiftList.innerHTML = '';
        shiftItems.forEach((item, index) => {
            const tr = document.createElement('tr');
            const totalDisplay = item.total > 0 ? formatCurrency(item.total) : '-';
            tr.innerHTML = `
                <td>${item.code}</td>
                <td>${item.prod}</td>
                <td>${item.qty}</td>
                <td>${totalDisplay}</td>
                <td>
                    <span class="action-btn edit" onclick="editShiftItem(${index})" style="cursor: pointer; margin-right: 10px;">✎</span>
                    <span class="remove-item" onclick="removeShiftItem(${index})" style="cursor: pointer;">&times;</span>
                </td>
            `;
            shiftList.appendChild(tr);
        });
    }

    window.editShiftItem = function(index) {
        const item = shiftItems[index];
        shiftCodeInput.value = item.code;
        shiftProdInput.value = item.prod;
        shiftQtyInput.value = item.qty;
        shiftTotalInput.value = item.total > 0 ? item.total : '';
        
        // Remove the item so it can be re-added (updated)
        removeShiftItem(index);
        shiftCodeInput.focus();
    };

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
