console.log('running...');

let cart = document.querySelectorAll('.add-cart');
let products = [{
        name: 'Product 1',
        tag: 'product1',
        price: 2,
        inCart: 0
    },
    {
        name: 'Product 2',
        tag: 'product2',
        price: 1,
        inCart: 0
    },
    {
        name: 'Product 3',
        tag: 'product3',
        price: 4,
        inCart: 0
    }
]

// un recorrido al cart buttom cuando da click incrementa mi valor
// en LocalStorage
for (let i = 0; i < cart.length; i++) {
    cart[i].addEventListener('click', () => {
        cartNumbers(products[i]);
        totalCost(products[i]);
    })
}

// LocalStorage para el boton del menu
const onLoadCartNumbers = () => {
    let productNumbers = localStorage.getItem('cartNumbers');
    if (productNumbers) {
        document.querySelector('.cart span').textContent = productNumbers;
    }
}

// Proceso para anadir al LocalStorage la cantidad de clicks del producto
const cartNumbers = (product) => {
    let productNumbers = localStorage.getItem('cartNumbers');
    productNumbers = parseInt(productNumbers);

    if (productNumbers) {
        localStorage.setItem('cartNumbers', productNumbers + 1);
        document.querySelector('.cart span').textContent = productNumbers + 1;
    } else {
        localStorage.setItem('cartNumbers', 1);
        document.querySelector('.cart span').textContent = 1;
    }
    setItems(product);
}

const setItems = (product) => {
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
    if (cartItems != null) {
        if (cartItems[product.tag] == undefined) {
            cartItems = {
                ...cartItems,
                [product.tag]: product
            }
        }
        cartItems[product.tag].inCart += 1;
    } else {
        product.inCart = 1;
        cartItems = {
            [product.tag]: product
        }
    }
    localStorage.setItem('productsInCart', JSON.stringify(cartItems));
}

const totalCost = (product) => {
    let cartCost = localStorage.getItem('totalCost');
    if (cartCost != null) {
        cartCost = parseInt(cartCost);
        localStorage.setItem('totalCost', cartCost + product.price);
    } else {
        localStorage.setItem('totalCost', product.price);
    }
}

// Muestro la lista del carrito
const displayCart = () => {
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
    let productContainer = document.querySelector('.products');
    let finalTotal = document.querySelector('.granTotalContainer');
    let cartCost = localStorage.getItem('totalCost');
    if (cartItems && productContainer) {
        productContainer.innerHTML = '';
        Object.values(cartItems).map(item => {
            productContainer.innerHTML += `
            <tr>
                <td>
                    <svg class="bi bi-x-circle-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.146-3.146a.5.5 0 0 0-.708-.708L8 7.293 4.854 4.146a.5.5 0 1 0-.708.708L7.293 8l-3.147 3.146a.5.5 0 0 0 .708.708L8 8.707l3.146 3.147a.5.5 0 0 0 .708-.708L8.707 8l3.147-3.146z"/>
                    </svg>
                    <img class="imgCart" src="/assets/img/${item.tag}.jpg">
                </td>
                <td>
                    $${item.price},00
                </td>
                <td>
                    <svg class="bi bi-arrow-left-circle-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-7.646 2.646a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L6.207 7.5H11a.5.5 0 0 1 0 1H6.207l2.147 2.146z"/>
                    </svg>
                        <span>${item.inCart}</span>
                    <svg class="bi bi-arrow-right-circle-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-8.354 2.646a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L9.793 7.5H5a.5.5 0 0 0 0 1h4.793l-2.147 2.146z"/>
                    </svg>
                </td>
                <td>
                    $${item.inCart * item.price},00
                </td>
            </tr>`
        });
        finalTotal.innerHTML += `
                <h4 class="granTotalTitle">
                    FINAl COST
                </h4>
                <h4>
                    $${cartCost},00
                </h4>`
    }

    paymentProcess(cartCost, cartItems);

}


// Aqui esta todo lo relacionado con ATH MOVIL, basicamente
// solo pido el total y los items.. 
//
// hay otros metodos del objeto que por el momento y 
// para este ejemplo no los implemente. 
const paymentProcess = (total, items)=>{
    ATHM_Checkout = {
        env: 'sandbox',
        publicToken: 'sandboxtoken01875617264',
        timeout: 600, //seconds
        orderType: '',
        theme: 'btn', // btn | btn-dark | btn-light
        lang: 'en', // es=spanish  en=english
        //Purpose information only, you should calculate
        total: 1,
        subtotal: 0,
        // metadata1: 'SKU0001', //optional
        // metadata2: 'SKU0001', //optional
    //Order without items set an empty array items: [],
       items: [
        //    {
        //        "name":"Mofongo Especial",
        //        "description":"Mofongo con Churrasco",
        //        "quantity":"1",
        //        "price":"9",
        //        "tax":"0",
        //        "metadata":"SKU001"
        //    }
       ],
        onCompletedPayment: function(response)
        {
            alert (JSON.stringify(response)); 
        },
        onCancelledPayment: function(response)
        {
            alert (JSON.stringify(response));
        },
        onExpiredPayment: function(response)
        {
            alert (JSON.stringify(response));
        }
    }

    const athMovil = ATHM_Checkout;
    athMovil['total'] = total;
    athMovil['items'] = items;
    console.log(athMovil);
    
}

// con local Storage mantengo el valor del boton Cart
onLoadCartNumbers();

displayCart();

