import { catalogList, modalProductBtn, countAmount, orderCount, orderList } from "./elements.js";
import { getData } from "./getData.js";
import { API_URL, PREFIX_PRODUCT } from './const.js';


//** получение данных корзины через локалстораж */

export const getCart = () => {
    const cartList = localStorage.getItem('cart');
    if (cartList) {
        return JSON.parse(cartList);
    } else {
        return [];
    }
};

const renderCartList = async () => {
    const cartList = getCart();
    const allIdProduct = cartList.map(item => item.id);
    const data = await getData(`${API_URL}${PREFIX_PRODUCT}?list=${allIdProduct}`);

    const countProduct = cartList.reduce((acc, item) => acc + item.count, 0);
    orderCount.textContent = countProduct;

    const cartItems = data.map(item => {
        const li = document.createElement('li');
        li.classList.add('order__item');
        li.dataset.idProduct = item.id;

        const product = cartList.find((cartItem => cartItem.id === item.id));

        li.innerHTML = `

        <img src="img/burger1.jpg" alt="Супер сырный" class="order__image">

            <div class="order__product">
                <h3 class="order__product-title">Супер сырный</h3>

                <p class="order__product-weight">512г</p>

                <p class="order__product-price">550₽</p>
            </div>

            <div class="order__product-count count">
                <button class="count__minus">-</button>

                <p class="count__amount">1</p>

                <button class="count__plus">+</button>
            </div>
        `;
    });

    orderList.textContent = '';
    orderList.append(...cartItems);
};

//** обновление данных корзины через локалстораж*/

const updateCartList = (cartList) => {
    localStorage.setItem('cart', JSON.stringify(cartList));
    renderCartList();
};


const addCart = (id, count = 1) => {
    const cartList = getCart();
    const product = cartList.find((item) => item.id === id);

    if (product) {
        product.count += count;
    } else {
        cartList.push({ id , count });
    }

    updateCartList(cartList);
};

const removeCart = (id) => {

};

const cartController = () => {
    catalogList.addEventListener('click', ({ target }) => {
        if (target.closest('.product__add')) {
            addCart(target.closest('.product').dataset.idProduct);
        }
    });

    modalProductBtn.addEventListener('click', () => {
        addCart(
           modalProductBtn.dataset.idProduct,
           parseInt(countAmount.textContent),
       );
    });
}; 

export const cartInit = () => {
    cartController();
    renderCartList();
};