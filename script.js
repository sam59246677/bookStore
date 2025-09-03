let cart = [];
let total = 0;

function addToCart(name, price) {
  let existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.qty++;
    existingItem.totalPrice += price;
  } else {
    cart.push({ name, price, qty: 1, totalPrice: price });
  }
  total += price;
  updateCart();
}

function updateCart() {
  const cartList = document.getElementById("cart-items");
  const totalEl = document.getElementById("total");
  cartList.innerHTML = "";

  cart.forEach((item, index) => {
    let li = document.createElement("li");
    li.textContent = `${item.name} - تعداد: ${item.qty} - جمع: ${item.totalPrice} تومان `;

    let plusBtn = document.createElement("button");
    plusBtn.textContent = "+";
    plusBtn.classList.add("plus-btn");
    plusBtn.onclick = () => { item.qty++; item.totalPrice += item.price; total += item.price; updateCart(); };

    let minusBtn = document.createElement("button");
    minusBtn.textContent = "-";
    minusBtn.classList.add("minus-btn");
    minusBtn.onclick = () => {
      if (item.qty > 1) { item.qty--; item.totalPrice -= item.price; total -= item.price; }
      else { total -= item.totalPrice; cart.splice(index, 1); }
      updateCart();
    };

    let removeBtn = document.createElement("button");
    removeBtn.textContent = "حذف";
    removeBtn.classList.add("remove-btn");
    removeBtn.onclick = () => { total -= item.totalPrice; cart.splice(index, 1); updateCart(); };

    li.appendChild(plusBtn);
    li.appendChild(minusBtn);
    li.appendChild(removeBtn);
    cartList.appendChild(li);
  });

  totalEl.textContent = total;
}

// عناصر مودال
const modal = document.getElementById("checkout-modal");
const checkoutBtn = document.getElementById("checkout-btn");
const closeBtn = document.querySelector(".close-btn");

const step1 = document.querySelector(".step-1");
const step2 = document.querySelector(".step-2");
const step3 = document.querySelector(".step-3");

const nextToReview = document.getElementById("next-to-review");
const backToInfo = document.getElementById("back-to-info");
const nextToConfirm = document.getElementById("next-to-confirm");
const submitBtn = document.getElementById("submit-order");

const reviewList = document.getElementById("order-review");
const reviewTotal = document.getElementById("review-total");

const progressBar = document.getElementById("progress-bar");
const stepCircles = document.querySelectorAll(".step-circle");

function updateProgress(step) {
  progressBar.style.width = ((step - 1) / (stepCircles.length - 1)) * 90 + "%";
  stepCircles.forEach((circle, index) => {
    if (index < step) circle.classList.add("active");
    else circle.classList.remove("active");
  });
}

// باز کردن مودال
checkoutBtn.onclick = () => {
  if (cart.length === 0) { alert("سبد خرید خالی است!"); return; }
  modal.classList.add("show");
  step1.style.display = "flex";
  step2.style.display = "none";
  step3.style.display = "none";
  updateProgress(1);
};

// بستن مودال
closeBtn.onclick = () => modal.classList.remove("show");
window.onclick = e => { if (e.target === modal) modal.classList.remove("show"); };

// مرحله ۱ → مرحله ۲
nextToReview.onclick = () => {
  const name = document.getElementById("cust-name").value.trim();
  const phone = document.getElementById("cust-phone").value.trim();
  const address = document.getElementById("cust-address").value.trim();
  if (!name || !phone || !address) { alert("لطفاً همه فیلدها را پر کنید"); return; }

  reviewList.innerHTML = "";
  cart.forEach(item => {
    let li = document.createElement("li");
    li.textContent = `${item.name} - تعداد: ${item.qty} - جمع: ${item.totalPrice} تومان`;
    reviewList.appendChild(li);
  });
  reviewTotal.textContent = total;

  step1.style.display = "none";
  step2.style.display = "flex";
  updateProgress(2);
};

// برگشت به مرحله ۱
backToInfo.onclick = () => { step2.style.display = "none"; step1.style.display = "flex"; updateProgress(1); };

// مرحله ۲ → مرحله ۳
nextToConfirm.onclick = () => { step2.style.display = "none"; step3.style.display = "flex"; updateProgress(3); };

// ارسال نهایی و رفتن به درگاه بانکی
submitBtn.onclick = async () => {
  const payload = {
    customer: {
      name: document.getElementById("cust-name").value,
      phone: document.getElementById("cust-phone").value,
      address: document.getElementById("cust-address").value
    },
    cart: cart.map(it => ({ name: it.name, qty: it.qty })),
    total
  };

  try {
    const resp = await fetch("http://localhost:3000/api/pay/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await resp.json();
    if (data.ok) {
      modal.classList.remove("show");
      window.location.href = data.payUrl;
    } else {
      alert("خطا در پرداخت: " + (data.message || ""));
    }
  } catch {
    alert("ارتباط با سرور برقرار نشد.");
  }
};
