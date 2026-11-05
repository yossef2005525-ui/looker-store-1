// ===== Sample Products Database =====
const productsDB = [
    {
        id: 1,
        name: "بسكويت أولكر شاي سادة",
        desc: "كرتونة 12 علبة - طعم غني ومقرمش",
        price: 180.00,
        image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&auto=format&fit=crop&q=60"
    },
    {
        id: 2,
        name: "بسكويت أولكر فينجر كاكاو",
        desc: "كرتونة 24 علبة محشوة كاكاو",
        price: 240.00,
        image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=300&auto=format&fit=crop&q=60"
    },
    {
        id: 3,
        name: "بسكويت أولكر فينجر سادة",
        desc: "كرتونة 24 علبة زبدة فاخرة",
        price: 220.00,
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=60"
    },
    {
        id: 4,
        name: "أولكر نابوليتان شوكولاتة",
        desc: "علبة تجميعية شوكولاتة باللحليب",
        price: 310.00,
        image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=300&auto=format&fit=crop&q=60"
    }
];

// ===== App State =====
let customerData = {
    name: "",
    phone: "",
    address: "",
    rep: ""
};

let cart = [];

// ===== Initialization =====
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
});

// ===== Step Navigation Logic =====
function switchStep(stepNum) {
    document.getElementById("stepCustomer").classList.add("hidden");
    document.getElementById("stepCatalog").classList.add("hidden");
    document.getElementById("stepInvoice").classList.add("hidden");

    document.getElementById("stepIndicator1").classList.remove("active");
    document.getElementById("stepIndicator2").classList.remove("active");
    document.getElementById("stepIndicator3").classList.remove("active");

    if (stepNum === 1) {
        document.getElementById("stepCustomer").classList.remove("hidden");
        document.getElementById("stepIndicator1").classList.add("active");
    } else if (stepNum === 2) {
        document.getElementById("stepCatalog").classList.remove("hidden");
        document.getElementById("stepIndicator1").classList.add("active");
        document.getElementById("stepIndicator2").classList.add("active");
    } else if (stepNum === 3) {
        document.getElementById("stepInvoice").classList.remove("hidden");
        document.getElementById("stepIndicator1").classList.add("active");
        document.getElementById("stepIndicator2").classList.add("active");
        document.getElementById("stepIndicator3").classList.add("active");
    }
}

// ===== Step 1: Handle Customer Form Submission =====
function submitCustomerData(event) {
    event.preventDefault();
    
    customerData.name = document.getElementById("clientName").value.trim();
    customerData.phone = document.getElementById("clientPhone").value.trim();
    customerData.address = document.getElementById("clientAddress").value.trim();
    customerData.rep = document.getElementById("repName").value.trim() || "غير محدد";

    // Update Ribbon Display
    document.getElementById("ribbonName").innerText = customerData.name;
    document.getElementById("ribbonPhone").innerText = customerData.phone;
    document.getElementById("ribbonAddress").innerText = customerData.address;

    switchStep(2);
}

function editCustomerData() {
    switchStep(1);
}

// ===== Step 2: Render Catalog Products =====
function renderProducts() {
    const container = document.getElementById("productsContainer");
    container.innerHTML = "";

    productsDB.forEach(prod => {
        const prodCard = document.createElement("div");
        prodCard.className = "product-card";
        prodCard.innerHTML = `
            <img src="${prod.image}" alt="${prod.name}" class="product-img">
            <div class="product-info">
                <h4>${prod.name}</h4>
                <p class="product-desc">${prod.desc}</p>
                <div class="product-price">${prod.price.toFixed(2)} ج.م</div>
            </div>
            <div class="product-controls">
                <button class="qty-btn" onclick="adjustQty(${prod.id}, -1)">-</button>
                <input type="number" id="qty-${prod.id}" class="qty-input" value="1" min="1">
                <button class="qty-btn" onclick="adjustQty(${prod.id}, 1)">+</button>
                <button class="add-cart-btn" onclick="addToCart(${prod.id})">إضافة <i class="fa-solid fa-cart-plus"></i></button>
            </div>
        `;
        container.appendChild(prodCard);
    });
}

function adjustQty(productId, change) {
    const input = document.getElementById(`qty-${productId}`);
    let currentVal = parseInt(input.value) || 1;
    currentVal += change;
    if (currentVal < 1) currentVal = 1;
    input.value = currentVal;
}

// ===== Cart Management =====
function addToCart(productId) {
    const qtyInput = document.getElementById(`qty-${productId}`);
    const qty = parseInt(qtyInput.value) || 1;
    const product = productsDB.find(p => p.id === productId);

    const existingIndex = cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
        cart[existingIndex].qty += qty;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            qty: qty
        });
    }

    qtyInput.value = 1; // Reset input quantity
    updateCartUI();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function updateCartUI() {
    const cartItemsList = document.getElementById("cartItemsList");
    const cartCountBadge = document.getElementById("cartCountBadge");
    const cartTotalItems = document.getElementById("cartTotalItems");
    const cartTotalPrice = document.getElementById("cartTotalPrice");
    const checkoutBtn = document.getElementById("checkoutBtn");

    cartItemsList.innerHTML = "";

    if (cart.length === 0) {
        cartItemsList.innerHTML = `
            <div class="empty-cart-msg">
                <i class="fa-solid fa-basket-shopping"></i>
                <p>السلة فارغة حالياً. قم بإضافة منتجات من القائمة.</p>
            </div>
        `;
        cartCountBadge.innerText = "0";
        cartTotalItems.innerText = "0";
        cartTotalPrice.innerText = "0.00";
        checkoutBtn.disabled = true;
        return;
    }

    let totalQty = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        totalQty += item.qty;
        totalPrice += itemTotal;

        const row = document.createElement("div");
        row.className = "cart-item-row";
        row.innerHTML = `
            <div class="cart-item-details">
                <strong>${item.name}</strong>
                <small>${item.qty} × ${item.price.toFixed(2)} = ${itemTotal.toFixed(2)} ج.م</small>
            </div>
            <div class="cart-item-actions">
                <button class="delete-item-btn" onclick="removeFromCart(${item.id})" title="حذف">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
        cartItemsList.appendChild(row);
    });

    cartCountBadge.innerText = cart.length;
    cartTotalItems.innerText = totalQty;
    cartTotalPrice.innerText = totalPrice.toFixed(2);
    checkoutBtn.disabled = false;
}

// ===== Step 3: Invoice Logic =====
function goToInvoice() {
    if (cart.length === 0) return;

    // Populate Customer Data in Invoice
    document.getElementById("invClientName").innerText = customerData.name;
    document.getElementById("invClientPhone").innerText = customerData.phone;
    document.getElementById("invClientAddress").innerText = customerData.address;
    document.getElementById("invRepName").innerText = customerData.rep;

    // Generate Invoice Number & Dates
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    document.getElementById("invNumber").innerText = `LK-2026-${randomNum}`;
    
    const now = new Date();
    document.getElementById("invDate").innerText = now.toLocaleDateString('ar-EG');
    document.getElementById("invTime").innerText = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    // Populate Invoice Table
    const tableBody = document.getElementById("invTableBody");
    tableBody.innerHTML = "";
    
    let grandTotal = 0;

    cart.forEach((item, index) => {
        const total = item.price * item.qty;
        grandTotal += total;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${item.name}</strong></td>
            <td>${item.price.toFixed(2)} ج.م</td>
            <td>${item.qty}</td>
            <td><strong>${total.toFixed(2)} ج.م</strong></td>
        `;
        tableBody.appendChild(tr);
    });

    document.getElementById("invGrandTotal").innerText = `${grandTotal.toFixed(2)} ج.م`;

    switchStep(3);
}

function backToCatalog() {
    switchStep(2);
}

// ===== WhatsApp Order Sharing =====
function sendViaWhatsApp() {
    let grandTotal = 0;
    let itemsText = "";

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        grandTotal += itemTotal;
        itemsText += `${index + 1}. *${item.name}* 
   الكمية: ${item.qty} | السعر: ${itemTotal.toFixed(2)} ج.م
`;
    });

    const invNum = document.getElementById("invNumber").innerText;

    const message = 
`🧾 *طلب فاتورة جديدة - متجر لوكير*
----------------------------------
🔢 *رقم الفاتورة:* ${invNum}

👤 *بيانات العميل:*
• *الاسم:* ${customerData.name}
• *الهاتف:* ${customerData.phone}
• *العنوان:* ${customerData.address}
• *المندوب:* ${customerData.rep}

📦 *تفاصيل المنتجات:*
${itemsText}
----------------------------------
💰 *الإجمالي الكلي:* *${grandTotal.toFixed(2)} ج.م*
----------------------------------
شكراً لتواصلكم معنا!`;

    const encodedMessage = encodeURIComponent(message);
    let targetPhone = customerData.phone.replace(/[^0-9]/g, '');
    
    // Add Egypt country code if not present
    if (targetPhone.startsWith("01")) {
        targetPhone = "2" + targetPhone;
    }

    const waUrl = `https://wa.me/${targetPhone}?text=${encodedMessage}`;
    window.open(waUrl, "_blank");
}
