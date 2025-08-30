let cart = [];
let total = 0;

function addToCart(name, price) {
  // بررسی اینکه آیا این کتاب قبلاً در سبد خرید هست یا نه
  let existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.qty += 1; // تعداد افزایش
    existingItem.totalPrice += price; // جمع همان کتاب
  } else {
    cart.push({ name, price, qty: 1, totalPrice: price });
  }

  total += price;
  updateCart();
}


// دکمه پرداخت
document.getElementById("checkout-btn").onclick = function () {
  if (cart.length === 0) {
    alert("سبد خرید شما خالی است!");
  } else {
    alert("✅ پرداخت با موفقیت انجام شد!\nجمع کل: " + total + " تومان");

    // بعد از پرداخت، سبد خرید خالی می‌شود
    cart = [];
    total = 0;
    updateCart();
  }
};



function updateCart() {
  const cartList = document.getElementById("cart-items");
  const totalEl = document.getElementById("total");

  cartList.innerHTML = "";

  cart.forEach((item, index) => {
    let li = document.createElement("li");
    li.textContent = `${item.name} - تعداد: ${item.qty} - جمع: ${item.totalPrice} تومان `;

    // ➕ دکمه افزایش
    let plusBtn = document.createElement("button");
    plusBtn.textContent = "+";
    plusBtn.classList.add("plus-btn");
    plusBtn.onclick = function () {
      item.qty += 1;
      item.totalPrice += item.price;
      total += item.price;
      updateCart();
    };

    // ➖ دکمه کاهش
    let minusBtn = document.createElement("button");
    minusBtn.textContent = "-";
    minusBtn.classList.add("minus-btn");
    minusBtn.onclick = function () {
      if (item.qty > 1) {
        item.qty -= 1;
        item.totalPrice -= item.price;
        total -= item.price;
      } else {
        // اگه رسید به 0، کلاً حذف می‌کنیم
        total -= item.totalPrice;
        cart.splice(index, 1);
      }
      updateCart();
    };

    // 🗑️ دکمه حذف کامل
    let removeBtn = document.createElement("button");
    removeBtn.textContent = "حذف";
    removeBtn.classList.add("remove-btn");
    removeBtn.onclick = function () {
      total -= item.totalPrice;
      cart.splice(index, 1);
      updateCart();
    };

    li.appendChild(plusBtn);
    li.appendChild(minusBtn);
    li.appendChild(removeBtn);
    cartList.appendChild(li);
  });

  totalEl.textContent = total;
}


