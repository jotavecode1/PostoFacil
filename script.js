document.addEventListener('DOMContentLoaded', () => {
    // CONFIGURAÃ‡ÃƒO GOOGLE SHEETS
    const URL_PLANILHA_TROCO = 'https://script.google.com/macros/s/AKfycbzHrQ3-H7mROc4sG_Pu4J9NHJmKhLDSbG5yqRxw1Pi_5MalnVADjttHZMw0Mn3NOT4/exec';
    const URL_PLANILHA_VIRADA = ''; // Link para Virada de Caixa (Deixe vazio se nÃ£o quiser usar)

    async function sendToGoogleSheets(url, data) {
        if (!url || url === 'URL_DA_SUA_PLANILHA_AQUI') return;
        
        try {
            await fetch(url, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, user: currentUser })
            });
        } catch (error) {
            console.error('Erro ao enviar para Google Sheets:', error);
        }
    }

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
    const shiftSuggestions = document.getElementById('shift-suggestions');
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

    // Comanda Elements
    const btnNewComanda = document.getElementById('btn-new-comanda');
    const activeComandasList = document.getElementById('active-comandas-list');
    const comandaCreateModal = document.getElementById('comanda-create-modal');
    const comandaClientNameInput = document.getElementById('comanda-client-name');
    const cancelNewComandaBtn = document.getElementById('cancel-new-comanda');
    const confirmNewComandaBtn = document.getElementById('confirm-new-comanda');

    const comandaManageModal = document.getElementById('comanda-manage-modal');
    const manageComandaTitle = document.getElementById('manage-comanda-title');
    const manageComandaTotal = document.getElementById('manage-comanda-total');
    const comandaItemsList = document.getElementById('comanda-items-list');
    const comandaProdNameInput = document.getElementById('comanda-prod-name');
    const comandaProdQtyInput = document.getElementById('comanda-prod-qty');
    const comandaProdPriceInput = document.getElementById('comanda-prod-price');
    const btnAddToComanda = document.getElementById('btn-add-to-comanda');
    const comandaProdSuggestions = document.getElementById('comanda-prod-suggestions');
    const btnCloseManage = document.getElementById('btn-close-manage');
    const btnDeleteComanda = document.getElementById('btn-delete-comanda');
    const btnFinalizeComanda = document.getElementById('btn-finalize-comanda');
    const finalizedComandasList = document.getElementById('finalized-comandas-list');

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

    // Comandas Store
    let comandas = JSON.parse(localStorage.getItem('postoFacilComandas') || '[]');
    let currentComandaId = null;

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
        { code: '2250', name: 'CARVAO SÃƒO JOSÃ‰' },
        { code: '582', name: 'ERVA YACUI NATURAL' },
        { code: '519', name: 'CHOCO KINDER OVO' },
        { code: '130', name: 'KINDER JOY' },
        { code: '357', name: 'CHOCO M&M TUBO' },
        { code: '2490', name: 'CAIXA BOMBOM' },
        { code: '308', name: 'CHOCO BIS CAIXA' },
        { code: '397', name: 'LEITE LIDER' },
        { code: '319', name: 'MIOJO NISSIN' },
        { code: '757', name: 'CAFÃ‰ JAGUARI' },
        { code: '3620', name: 'CAFÃ‰ CABOCLO' },
        { code: '3157', name: 'LEITE CONDENSADO' },
        { code: '2475', name: 'CREME DE LEITE' },
        { code: '1141', name: 'NESCAU 2.0' },
        { code: '3116', name: 'LEITE NINHO LATA' },
        { code: '2695', name: 'BALA FINI' },
        { code: '3171', name: 'BISCOITO TRAKINAS' },
        { code: '1224', name: 'PULLMAN PÃƒO FORMA' },
        { code: '1225', name: 'PULLMAN' },
        { code: '3249', name: 'BOM AR' },
        { code: '3248', name: 'AMACIANTE DIVERSOS' },
        { code: '1250', name: 'SABÃƒO EM PÃ“ OMO' },
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
        { code: '376', name: 'ELMA SENSAÃ‡Ã•ES' },
        { code: '2265', name: 'ELMA CHEETOS 105 GR' },
        { code: '410', name: 'ELMA CEBOLITOS' },
        { code: '2599', name: 'ELMA BACONZITO' },
        { code: '3596', name: 'MANTEIGA' },
        { code: '1149', name: 'MARGARINA QUALY' },
        { code: '1150', name: 'REQUEIJÃƒO CREMOSO' },
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
        { code: '2684', name: 'CHÃ FUZE LEÃƒO ICE TEA' },
        { code: '3048', name: 'PERDIGÃƒO MORTADELA' },
        { code: '3212', name: 'COCA/PEPSIâ€¦ 200ML' },
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
        { code: '4030', name: 'IMPÃ‰RIO LONG' },
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
        { code: '724', name: 'BAVARIA LATÃƒO' },
        { code: '2734', name: 'CERV. SKOL BEATS LATA' },
        { code: '2279', name: 'JACK DANIELS COCA' },
        { code: '3611', name: 'JACK DANIELS HONEY' },
        { code: '1021', name: 'BURGUESA LATA' },
        { code: '2389', name: 'SKOL LATA' },
        { code: '964', name: 'BRAHMA LATA' },
        { code: '1028', name: 'SKOL LATÃƒO' },
        { code: '695', name: 'AMSTEL LATÃƒO' },
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
        { code: '3187', name: 'COCA CAFÃ‰' },
        { code: '3400', name: 'FANTA 220ML' },
        { code: '302', name: 'SPRITE LATA' },
        { code: '160', name: 'FANTA LATA' },
        { code: '158', name: 'COCA LATA' },
        { code: '4138', name: 'COPO DA FELICIDADE' },
        { code: '4140', name: 'MOUSSE DE LIMÃƒO' },
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
        { code: '4412', name: 'GRESP PÃƒO DE BATATA' },
        { code: '1126', name: 'PÃƒO DE QUEIJO' },
        { code: '2278', name: 'SALGADOS RENATA' },
        { code: '3807', name: 'SALGADOS DU MARIO' },
        { code: '3454', name: 'SALGADOS MISTER' },
        { code: '2949', name: 'CAFÃ‰ CAP' },
        { code: '1124', name: 'BEBIDAS NESTLE' },
        { code: '1423', name: 'BONÃ‰ DIVERSOS' },
        { code: '794', name: 'PAÃ‡OCA/DOCES DIV' },
        { code: '3170', name: 'CHOC. TRENTO' },
        { code: '434', name: 'CHOC. BATON' },
        { code: '2635', name: 'MENTOS POTE' },
        { code: '2347', name: 'CHOCO TALENTO' },
        { code: '668', name: 'CHOCO KIT KAT' },
        { code: '3796', name: 'CACHAÃ‡A DI MINAS' },
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

    // Login navigation with Enter
    usernameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            passwordInput.focus();
        }
    });

    passwordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            loginForm.dispatchEvent(new Event('submit'));
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

    // Disabled services logic removed to allow in-page 404 tabs

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
            { val: 100, type: 'coin', label: '1' },
            { val: 50, type: 'coin', label: '0.50' },
            { val: 25, type: 'coin', label: '0.25' },
            { val: 10, type: 'coin', label: '0.10' },
            { val: 5, type: 'coin', label: '0.05' }
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
            moneyVisual.innerHTML = `<span class="text-value">R$ ${denom.label}</span>`;
        } else {
            // Replace dots with dashes for CSS classes (e.g., 0.50 -> 0-50)
            const coinClass = denom.label.replace(/\./g, '-');
            moneyVisual.className = `coin coin-${coinClass}`;
            moneyVisual.innerHTML = `<span class="text-value">${denom.label}</span>`;
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

        // Enviar para Google Sheets (Troco)
        sendToGoogleSheets(URL_PLANILHA_TROCO, {
            type: 'TROCO',
            charge: charge,
            paid: paid,
            change: change
        });
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
                <div class="status-bar"></div>
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
                <div class="history-actions" style="display: flex; gap: 12px; margin-top: 15px; border-top: 1px solid #eee; pt: 10px;">
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
            const item = { prod, code, qty, total: isNaN(total) ? 0 : total };
            shiftItems.push(item);
            renderShiftItems();

            // Enviar para Google Sheets (Virada)
            sendToGoogleSheets(URL_PLANILHA_VIRADA, {
                type: 'VIRADA',
                code: item.code,
                product: item.prod,
                qty: item.qty,
                total: item.total
            });
            
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
        const query = shiftProdInput.value.trim().toUpperCase();
        shiftSuggestions.innerHTML = '';
        
        if (query.length < 2) {
            shiftSuggestions.classList.add('hidden');
            return;
        }

        const matches = productDatabase.filter(p => p.name.includes(query)).slice(0, 5);
        
        if (matches.length > 0) {
            matches.forEach(product => {
                const item = document.createElement('div');
                item.className = 'suggestion-item';
                item.innerHTML = `
                    <span>${product.name}</span>
                    <span class="item-code">${product.code}</span>
                `;
                item.addEventListener('click', () => {
                    shiftProdInput.value = product.name;
                    shiftCodeInput.value = product.code;
                    shiftSuggestions.classList.add('hidden');
                    shiftQtyInput.focus();
                });
                shiftSuggestions.appendChild(item);
            });
            shiftSuggestions.classList.remove('hidden');
        } else {
            shiftSuggestions.classList.add('hidden');
        }
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!shiftProdInput.contains(e.target) && !shiftSuggestions.contains(e.target)) {
            shiftSuggestions.classList.add('hidden');
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
                shiftQtyInput.focus();
            } else {
                shiftProdInput.focus();
            }
        }
    });

    shiftProdInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // If there's an exact match or first suggestion, we can auto-select it
            const query = shiftProdInput.value.trim().toUpperCase();
            const product = productDatabase.find(p => p.name.includes(query));
            if (product) {
                shiftProdInput.value = product.name;
                shiftCodeInput.value = product.code;
            }
            shiftSuggestions.classList.add('hidden');
            shiftQtyInput.focus();
        }
    });

    shiftQtyInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            shiftTotalInput.focus();
        }
    });

    shiftTotalInput.addEventListener('keydown', (e) => {
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
                    <div style="display: flex; gap: 8px;">
                        <button class="action-btn edit" onclick="editShiftItem(${index})" style="padding: 4px 8px; font-size: 0.8rem; background: var(--primary-blue); color: white; border-radius: 6px; border: none; cursor: pointer;">âœŽ</button>
                        <button class="action-btn delete" onclick="removeShiftItem(${index})" style="padding: 4px 8px; font-size: 0.8rem; background: #dc2626; color: white; border-radius: 6px; border: none; cursor: pointer;">&times;</button>
                    </div>
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

    adminPasswordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            confirmDeleteBtn.click();
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

    // Enter key navigation for Troco
    amountChargeInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            amountPaidInput.focus();
        }
    });

    amountPaidInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            if (!finalizeBtn.classList.contains('hidden')) {
                e.preventDefault();
                finalizeBtn.click();
            }
        }
    });

    // --- Game Selection Logic ---
    window.switchGame = function(game) {
        document.getElementById('game-selector').classList.add('hidden');
        if (game === 'rush') {
            document.getElementById('game-rush').classList.remove('hidden');
            initRushGame();
        } else if (game === 'catch') {
            document.getElementById('game-catch').classList.remove('hidden');
            initCatchGame();
        }
    };

    window.backToSelector = function() {
        document.getElementById('game-rush').classList.add('hidden');
        document.getElementById('game-catch').classList.add('hidden');
        document.getElementById('game-selector').classList.remove('hidden');
        stopAllGames();
    };

    function stopAllGames() {
        if (pumpingInterval) clearInterval(pumpingInterval);
        if (catchInterval) clearInterval(catchInterval);
        if (itemSpawnInterval) clearInterval(itemSpawnInterval);
    }

    // --- Minigame 1 Logic: Frentista Rush ---
    const abastecerBtn = document.getElementById('abastecer-btn');
    const fuelGauge = document.getElementById('fuel-gauge');
    const fuelCounter = document.getElementById('fuel-counter');
    const targetAmountDisplay = document.getElementById('target-amount');
    const gameScoreDisplay = document.getElementById('game-score');
    const gameMessage = document.getElementById('game-message');
    const scoreHistoryList = document.getElementById('score-history');

    let currentFuel = 0;
    let targetFuel = 50;
    let gameScore = 0;
    let pumpingInterval = null;
    let gameActive = true;
    let highScores = JSON.parse(localStorage.getItem('postoFacilScores') || '[]');

    function initRushGame() {
        currentFuel = 0;
        targetFuel = parseFloat(Math.random() * 80 + 20).toFixed(2);
        if (targetAmountDisplay) targetAmountDisplay.textContent = targetFuel;
        updateRushUI();
        gameActive = true;
        if (gameMessage) {
            gameMessage.textContent = 'Segure para encher o tanque!';
            gameMessage.style.color = '#666';
        }
    }

    function updateRushUI() {
        if (fuelCounter) fuelCounter.textContent = `R$ ${currentFuel.toFixed(2)}`;
        const percentage = Math.min((currentFuel / targetFuel) * 100, 100);
        if (fuelGauge) {
            fuelGauge.style.height = `${percentage}%`;
            fuelGauge.style.background = currentFuel > targetFuel ? '#dc2626' : 'var(--primary-yellow)';
        }
    }

    function finishRushRound() {
        gameActive = false;
        const diff = Math.abs(currentFuel - targetFuel);
        let roundPoints = 0;

        if (currentFuel > targetFuel) {
            gameMessage.textContent = '❌ EXCEDEU O LIMITE! Perdeu 10 pontos.';
            gameMessage.style.color = '#dc2626';
            roundPoints = -10;
        } else if (diff <= 0.05) {
            gameMessage.textContent = '🎯 PERFEITO! +100 Pontos';
            gameMessage.style.color = '#059669';
            roundPoints = 100;
        } else if (diff <= 0.50) {
            gameMessage.textContent = '⚡ QUASE LÁ! +50 Pontos';
            gameMessage.style.color = '#0284c7';
            roundPoints = 50;
        } else if (diff <= 2.00) {
            gameMessage.textContent = '👍 BOM TRABALHO! +20 Pontos';
            gameMessage.style.color = '#0f172a';
            roundPoints = 20;
        } else {
            gameMessage.textContent = '🐢 MUITO LONGE! +5 Pontos';
            gameMessage.style.color = '#64748b';
            roundPoints = 5;
        }

        saveHighScore(roundPoints);
        setTimeout(initRushGame, 2000);
    }

    function saveHighScore(points) {
        gameScore += points;
        gameScoreDisplay.textContent = gameScore;
        document.getElementById('catch-score').textContent = gameScore;
        
        highScores.unshift({ points, date: new Date().toLocaleTimeString(), totalScore: gameScore });
        highScores = highScores.slice(0, 5); 
        localStorage.setItem('postoFacilScores', JSON.stringify(highScores));
        renderScoreHistory();
    }

    function renderScoreHistory() {
        if (!scoreHistoryList) return;
        scoreHistoryList.innerHTML = highScores.map(s => `
            <li>
                <span>${s.date}</span>
                <strong style="color: ${s.points > 0 ? '#059669' : '#dc2626'}">${s.points > 0 ? '+' : ''}${s.points} pts</strong>
            </li>
        `).join('');
    }

    if (abastecerBtn) {
        abastecerBtn.addEventListener('mousedown', () => {
            if (!gameActive) return;
            pumpingInterval = setInterval(() => {
                currentFuel += 0.23;
                updateRushUI();
                if (currentFuel > targetFuel + 5) {
                    clearInterval(pumpingInterval);
                    finishRushRound();
                }
            }, 30);
        });

        abastecerBtn.addEventListener('mouseup', () => {
            if (pumpingInterval) {
                clearInterval(pumpingInterval);
                if (gameActive) finishRushRound();
            }
        });

        abastecerBtn.addEventListener('mouseleave', () => {
            if (pumpingInterval) {
                clearInterval(pumpingInterval);
                if (gameActive) finishRushRound();
            }
        });

        abastecerBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            abastecerBtn.dispatchEvent(new Event('mousedown'));
        });
        abastecerBtn.addEventListener('touchend', () => {
            abastecerBtn.dispatchEvent(new Event('mouseup'));
        });
    }

    // --- Minigame 2 Logic: Conveniência Catch ---
    const catchArea = document.getElementById('catch-area');
    const basket = document.getElementById('basket');
    const moveLeftBtn = document.getElementById('move-left');
    const moveRightBtn = document.getElementById('move-right');
    
    let basketPos = 50; // percentage
    let catchInterval = null;
    let itemSpawnInterval = null;
    const items = ['🍪', '🥤', '🍟', '🥪', '🍫', '🍺'];
    
    function initCatchGame() {
        basketPos = 50;
        updateBasketPos();
        gameScore = 0;
        document.getElementById('catch-score').textContent = '0';
        gameActive = true;
        
        startSpawning();
        renderScoreHistory();
    }
    
    function updateBasketPos() {
        basket.style.left = `${basketPos}%`;
    }
    
    function moveBasket(dir) {
        if (!gameActive) return;
        basketPos = Math.max(5, Math.min(95, basketPos + dir * 8));
        updateBasketPos();
    }
    
    moveLeftBtn.addEventListener('click', () => moveBasket(-1));
    moveRightBtn.addEventListener('click', () => moveBasket(1));
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') moveBasket(-1);
        if (e.key === 'ArrowRight') moveBasket(1);
    });
    
    function startSpawning() {
        itemSpawnInterval = setInterval(() => {
            if (!gameActive) return;
            const item = document.createElement('div');
            item.className = 'falling-item';
            item.textContent = items[Math.floor(Math.random() * items.length)];
            item.style.left = `${Math.random() * 90 + 5}%`;
            item.style.top = '0px';
            catchArea.appendChild(item);
            
            let pos = 0;
            const fall = setInterval(() => {
                if (!gameActive) {
                    clearInterval(fall);
                    item.remove();
                    return;
                }
                
                pos += 3;
                item.style.top = `${pos}px`;
                
                // Collision check
                if (pos > 250 && pos < 280) {
                    const itemRange = parseFloat(item.style.left);
                    if (Math.abs(itemRange - basketPos) < 10) {
                        saveHighScore(10);
                        item.remove();
                        clearInterval(fall);
                    }
                }
                
                if (pos > 300) {
                    item.remove();
                    clearInterval(fall);
                }
            }, 20);
        }, 1200);
    }

    renderScoreHistory();

// C-Frete Logic
window.selectFreteView = function(viewName) {
    const views = document.querySelectorAll('.cfrete-view');
    views.forEach(v => v.classList.add('hidden'));
    const target = document.getElementById('cfrete-view-' + viewName);
    if (target) {
        target.classList.remove('hidden');
    }
};

window.selectFreteType = function(type) {
    if (type === 'tip') {
        window.selectFreteView('saldo');
    } else if (type === 'tmov') {
        window.selectFreteView('tmov-saldo');
    } else if (type === 'ff') {
        window.selectFreteView('ff');
    }
};


window.selectDiesel = function(btn, price) {
    const btns = btn.closest('.diesel-selector').querySelectorAll('.btn-diesel');
    btns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const dieselInput = document.getElementById('cfrete-diesel');
    if (dieselInput) {
        dieselInput.value = price;
        window.calculateCfrete();
    }
};

window.calculateCfrete = function() {
    const totalInput = document.getElementById('cfrete-total');
    const dieselInput = document.getElementById('cfrete-diesel');
    const resultsArea = document.getElementById('cfrete-results');
    
    if (!totalInput || !dieselInput || !resultsArea) return;
    
    const total = parseFloat(totalInput.value);
    const diesel = parseFloat(dieselInput.value);
    
    if (isNaN(total) || total <= 0) {
        resultsArea.classList.add('hidden');
        return;
    }
    
    resultsArea.classList.remove('hidden');
    
    const val45 = total * 0.45;
    const litros = val45 / diesel;
    const saque = total - val45;
    
    const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    
    const resTotal = document.getElementById('res-total');
    const res45 = document.getElementById('res-45');
    const resLitros = document.getElementById('res-litros');
    const resSaque = document.getElementById('res-saque');
    
    if (resTotal) resTotal.textContent = formatMoney(total);
    if (res45) res45.textContent = formatMoney(val45);
    if (resLitros) resLitros.textContent = litros.toFixed(2) + ' L';
    if (resSaque) resSaque.textContent = formatMoney(saque);
};

window.calculateTmovSaldo = function() {
    const totalInput = document.getElementById('tmov-saldo-total');
    const dieselInput = document.getElementById('tmov-diesel');
    const resultsArea = document.getElementById('tmov-saldo-results');
    
    if (!totalInput || !dieselInput || !resultsArea) return;
    
    const total = parseFloat(totalInput.value);
    const diesel = parseFloat(dieselInput.value);
    
    if (isNaN(total) || total <= 0) {
        resultsArea.classList.add('hidden');
        return;
    }
    
    resultsArea.classList.remove('hidden');
    
    const combustivel = total * 0.35;
    const litros = combustivel / diesel;
    const saque = total - combustivel;
    
    const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    
    const resCombustivel = document.getElementById('res-tmov-combustivel');
    const resLitros = document.getElementById('res-tmov-litros');
    const resSaque = document.getElementById('res-tmov-saque');
    
    if (resCombustivel) resCombustivel.textContent = formatMoney(combustivel);
    if (resLitros) resLitros.textContent = litros.toFixed(2) + ' L';
    if (resSaque) resSaque.textContent = formatMoney(saque);
};

    // --- Comanda Logic ---
    function saveComandas() {
        localStorage.setItem('postoFacilComandas', JSON.stringify(comandas));
    }

    function renderComandas() {
        const pendentes = comandas.filter(c => c.status !== 'finalizada');
        const finalizadas = comandas.filter(c => c.status === 'finalizada');

        // Counts
        document.getElementById('count-pendentes').textContent = pendentes.length;
        document.getElementById('count-finalizadas').textContent = finalizadas.length;

        // Render Pendentes
        activeComandasList.innerHTML = '';
        if (pendentes.length === 0) {
            activeComandasList.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:30px; color:#94a3b8; background:#f8fafc; border-radius:12px; border:2px dashed #e2e8f0;">Nenhuma comanda pendente.</div>';
        } else {
            pendentes.forEach(c => {
                const totalItems = c.items.reduce((s, i) => s + i.qty, 0);
                const card = document.createElement('div');
                card.style.cssText = 'background:white; border-radius:15px; padding:18px; box-shadow:0 4px 6px -1px rgb(0 0 0/0.08); border:2px solid #fef3c7; cursor:pointer; transition:transform 0.2s, box-shadow 0.2s;';
                card.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:12px;">
                        <h4 style="margin:0; color:#1e293b; font-size:1rem;">${c.client}</h4>
                        <span style="font-size:0.7rem; background:#fef3c7; color:#92400e; padding:2px 7px; border-radius:20px; font-weight:700;">ABERTA</span>
                    </div>
                    <div style="font-size:0.9rem; color:#64748b;">${totalItems} item(s) &bull; #${c.id.toString().slice(-4)}</div>
                `;
                card.addEventListener('mouseenter', () => { card.style.transform = 'translateY(-4px)'; card.style.boxShadow = '0 8px 20px -4px rgb(0 0 0/0.15)'; });
                card.addEventListener('mouseleave', () => { card.style.transform = 'translateY(0)'; card.style.boxShadow = '0 4px 6px -1px rgb(0 0 0/0.08)'; });
                card.addEventListener('click', () => openManageComanda(c.id));
                activeComandasList.appendChild(card);
            });
        }

        // Render Finalizadas
        finalizedComandasList.innerHTML = '';
        if (finalizadas.length === 0) {
            finalizedComandasList.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:20px; color:#94a3b8; font-size:0.9rem;">Nenhuma comanda finalizada.</div>';
        } else {
            finalizadas.forEach(c => {
                const totalItems = c.items.reduce((s, i) => s + i.qty, 0);
                const dt = c.finalizedAt ? new Date(c.finalizedAt) : null;
                const dateStr = dt ? dt.toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' }) : '';
                const card = document.createElement('div');
                card.style.cssText = 'background:white; border-radius:15px; padding:18px; box-shadow:0 2px 4px -1px rgb(0 0 0/0.05); border:2px solid #d1fae5; cursor:pointer; transition: box-shadow 0.2s;';
                card.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:10px;">
                        <h4 style="margin:0; color:#1e293b; font-size:1rem;">${c.client}</h4>
                        <span style="font-size:0.7rem; background:#d1fae5; color:#065f46; padding:2px 7px; border-radius:20px; font-weight:700;">FINALIZADA</span>
                    </div>
                    <div style="font-size:0.85rem; color:#64748b;">${totalItems} item(s) &bull; ${dateStr}</div>
                    <div style="font-size:0.78rem; color:#10b981; margin-top:6px;">Clique para ver itens</div>
                    <button onclick="deleteFinalizedComanda(${c.id}); event.stopPropagation()" style="margin-top:10px; background:none; border:none; color:#ef4444; font-size:0.78rem; cursor:pointer; padding:0;">Excluir registro</button>
                `;
                card.addEventListener('mouseenter', () => card.style.boxShadow = '0 6px 16px -4px rgb(0 0 0/0.12)');
                card.addEventListener('mouseleave', () => card.style.boxShadow = '0 2px 4px -1px rgb(0 0 0/0.05)');
                card.addEventListener('click', (e) => {
                    if (e.target.tagName === 'BUTTON') return;
                    openFinalizedComanda(c.id);
                });
                finalizedComandasList.appendChild(card);
            });
        }
    }

    btnNewComanda.addEventListener('click', () => {
        comandaCreateModal.classList.remove('hidden');
        comandaClientNameInput.value = '';
        comandaClientNameInput.focus();
    });

    cancelNewComandaBtn.addEventListener('click', () => {
        comandaCreateModal.classList.add('hidden');
    });

    confirmNewComandaBtn.addEventListener('click', () => {
        const client = comandaClientNameInput.value.trim();
        if (client) {
            const newComanda = {
                id: Date.now(),
                client: client,
                items: [],
                timestamp: new Date()
            };
            comandas.push(newComanda);
            saveComandas();
            renderComandas();
            comandaCreateModal.classList.add('hidden');
            openManageComanda(newComanda.id);
        }
    });

    // Enter in nova comanda input confirms
    comandaClientNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            confirmNewComandaBtn.click();
        }
    });

    // Enter in admin password confirms delete
    adminPasswordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            confirmDeleteBtn.click();
        }
    });

    function openManageComanda(id, readOnly = false) {
        currentComandaId = id;
        const c = comandas.find(com => com.id === id);
        if (!c) return;

        manageComandaTitle.textContent = `Comanda: ${c.client}`;
        renderComandaItems(readOnly);
        comandaManageModal.classList.remove('hidden');

        // Toggle readonly UI
        const addForm = comandaManageModal.querySelector('.add-product-form');
        const btnFinalize = document.getElementById('btn-finalize-comanda');
        const btnDel = document.getElementById('btn-delete-comanda');
        if (readOnly) {
            if (addForm) addForm.style.display = 'none';
            btnFinalize.style.display = 'none';
            btnDel.style.display = 'none';
            manageComandaTotal.textContent = `${c.items.reduce((s,i)=>s+i.qty,0)} item(s) — FINALIZADA`;
        } else {
            if (addForm) addForm.style.display = '';
            btnFinalize.style.display = '';
            btnDel.style.display = '';
            // Reset product form
            comandaProdNameInput.value = '';
            comandaProdQtyInput.value = '1';
            comandaProdNameInput.focus();
        }
    }

    function openFinalizedComanda(id) {
        openManageComanda(id, true);
    }

    function renderComandaItems(readOnly = false) {
        const c = comandas.find(com => com.id === currentComandaId);
        if (!c) return;

        comandaItemsList.innerHTML = '';

        if (c.items.length === 0) {
            comandaItemsList.innerHTML = '<p style="text-align: center; color: #94a3b8; padding: 20px;">Nenhum item adicionado.</p>';
        } else {
            c.items.forEach((item, index) => {
                const div = document.createElement('div');
                div.style.cssText = `display: grid; grid-template-columns: 1fr 50px ${readOnly ? '' : '40px'}; gap: 10px; padding: 10px 0; border-bottom: 1px solid #f1f5f9; align-items: center;`;
                div.innerHTML = `
                    <span style="font-weight: 500;">${item.name}</span>
                    <span style="color: #64748b; text-align: center;">${item.qty}x</span>
                    ${readOnly ? '' : `<button onclick="removeProductFromComanda(${index})" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1.2rem;">&times;</button>`}
                `;
                comandaItemsList.appendChild(div);
            });
        }
        if (!readOnly) {
            manageComandaTotal.textContent = `${c.items.reduce((s,i)=>s+i.qty,0)} item(s)`;
        }
    }

    window.removeProductFromComanda = function(index) {
        const c = comandas.find(com => com.id === currentComandaId);
        if (c) {
            c.items.splice(index, 1);
            saveComandas();
            renderComandaItems();
            renderComandas();
        }
    };

    function addItemToComanda() {
        const name = comandaProdNameInput.value.trim();
        const qty = parseInt(comandaProdQtyInput.value);

        if (!name || isNaN(qty) || qty < 1) {
            return;
        }

        const c = comandas.find(com => com.id === currentComandaId);
        if (c) {
            // Check if item already exists, increment qty
            const existing = c.items.find(i => i.name.toUpperCase() === name.toUpperCase());
            if (existing) {
                existing.qty += qty;
            } else {
                c.items.push({ name: name.toUpperCase(), qty });
            }
            saveComandas();
            renderComandaItems();
            renderComandas();
            
            // Show feedback
            const feedback = document.getElementById('comanda-add-feedback');
            feedback.textContent = `✓ ${qty}x ${name.toUpperCase()} adicionado!`;
            feedback.style.display = 'block';
            setTimeout(() => { feedback.style.display = 'none'; }, 2500);

            // Reset form
            comandaProdNameInput.value = '';
            comandaProdQtyInput.value = '1';
            comandaProdSuggestions.classList.add('hidden');
            comandaProdNameInput.focus();
        }
    }

    btnAddToComanda.addEventListener('click', addItemToComanda);

    // Enter key support
    comandaProdNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (comandaProdNameInput.value.trim()) comandaProdQtyInput.focus();
        }
    });
    comandaProdQtyInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addItemToComanda();
        }
    });

    comandaProdNameInput.addEventListener('input', () => {
        const query = comandaProdNameInput.value.trim().toUpperCase();
        comandaProdSuggestions.innerHTML = '';
        
        if (query.length < 2) {
            comandaProdSuggestions.classList.add('hidden');
            return;
        }

        const matches = productDatabase.filter(p => p.name.includes(query)).slice(0, 5);
        
        if (matches.length > 0) {
            matches.forEach(product => {
                const item = document.createElement('div');
                item.className = 'suggestion-item';
                item.innerHTML = `<span>${product.name}</span>`;
                item.addEventListener('click', () => {
                    comandaProdNameInput.value = product.name;
                    comandaProdSuggestions.classList.add('hidden');
                    comandaProdQtyInput.focus();
                });
                comandaProdSuggestions.appendChild(item);
            });
            comandaProdSuggestions.classList.remove('hidden');
        } else {
            comandaProdSuggestions.classList.add('hidden');
        }
    });

    btnCloseManage.addEventListener('click', () => {
        comandaManageModal.classList.add('hidden');
        currentComandaId = null;
    });

    btnDeleteComanda.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja excluir esta comanda?')) {
            comandas = comandas.filter(c => c.id !== currentComandaId);
            saveComandas();
            renderComandas();
            comandaManageModal.classList.add('hidden');
            currentComandaId = null;
        }
    });

    btnFinalizeComanda.addEventListener('click', () => {
        const c = comandas.find(com => com.id === currentComandaId);
        if (!c || c.items.length === 0) {
            alert('A comanda está vazia.');
            return;
        }

        if (!confirm(`Finalizar a comanda de ${c.client}?\nEla será movida para a seção de Finalizadas.`)) {
            return;
        }

        // Mark as finalized (keep in list)
        c.status = 'finalizada';
        c.finalizedAt = new Date().toISOString();
        saveComandas();
        renderComandas();

        comandaManageModal.classList.add('hidden');
        currentComandaId = null;

        // Send to sheets
        sendToGoogleSheets(URL_PLANILHA_TROCO, {
            type: 'COMANDA',
            client: c.client,
            items: c.items.length
        });

        alert(`Comanda de ${c.client} finalizada!`);
    });

    window.deleteFinalizedComanda = function(id) {
        if (confirm('Excluir este registro de comanda finalizada?')) {
            comandas = comandas.filter(c => c.id !== id);
            saveComandas();
            renderComandas();
        }
    };

    // Initialize Comandas
    renderComandas();

    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!comandaProdNameInput.contains(e.target) && !comandaProdSuggestions.contains(e.target)) {
            comandaProdSuggestions.classList.add('hidden');
        }
    });

    // Initialize listeners for C-Frete
    const cfreteTotalInput = document.getElementById('cfrete-total');
    if (cfreteTotalInput) {
        cfreteTotalInput.addEventListener('input', window.calculateCfrete);
    }
    
    const tmovTotalInput = document.getElementById('tmov-saldo-total');
    if (tmovTotalInput) {
        tmovTotalInput.addEventListener('input', window.calculateTmovSaldo);
    }

    // --- Global Enter Key Navigation ---
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        const tag = document.activeElement.tagName;
        const type = document.activeElement.type;
        // Only act on text/number/password inputs (not buttons, textareas, selects)
        if (tag !== 'INPUT') return;
        if (type === 'submit' || type === 'button' || type === 'checkbox' || type === 'radio') return;
        // Don't intercept if event already handled (e.g. comanda Enter listeners)
        if (e.defaultPrevented) return;

        e.preventDefault();
        const allInputs = Array.from(document.querySelectorAll(
            'input:not([type=hidden]):not([type=submit]):not([type=button]):not([disabled])'
        )).filter(el => {
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null;
        });

        const idx = allInputs.indexOf(document.activeElement);
        if (idx >= 0 && idx < allInputs.length - 1) {
            allInputs[idx + 1].focus();
        }
    });

});

