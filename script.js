// Simulação de um banco de dados de produtos
const productsDatabase = {
    "7891234567890": { name: "Arroz", price: 19.99 },
    "7890987654321": { name: "Feijão", price: 8.99 },
    "7894561237890": { name: "Macarrão", price: 5.49 }
};

// Usuário e senha para login
const loginData = {
    username: 'gefin',
    password: '1234'
};

// Função de login
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === loginData.username && password === loginData.password) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('checkout-section').style.display = 'block';
    } else {
        document.getElementById('error-message').textContent = 'Usuário ou senha incorretos!';
    }
});

let total = 0;

// Função para adicionar produto manualmente
function addProduct() {
    const product = document.getElementById('product').value;
    const price = parseFloat(document.getElementById('price').value);

    if (product && price && price > 0) {
        addProductToList(product, price);
    } else {
        alert('Preencha os campos corretamente.');
    }
}

// Função para adicionar produto via código de barras
function addProductByBarcode() {
    const barcode = document.getElementById('barcode').value;
    if (productsDatabase[barcode]) {
        const product = productsDatabase[barcode].name;
        const price = productsDatabase[barcode].price;
        addProductToList(product, price);
        document.getElementById('barcode').value = ''; // Limpa o campo de código de barras
    } else {
        alert('Produto não encontrado.');
    }
}

// Função para escanear código de barras pela câmera usando QuaggaJS
function startScanner() {
    document.getElementById('scanner-container').style.display = 'block';
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#scanner-preview'), // Elemento onde o vídeo será exibido
            constraints: {
                width: 480,
                height: 320,
                facingMode: "environment" // Usa a câmera traseira em dispositivos móveis
            }
        },
        decoder: {
            readers: ["ean_reader"] // Lê códigos de barras no formato EAN (13 dígitos)
        }
    }, function(err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Scanner iniciado com sucesso");
        Quagga.start();
    });

    // Função que é chamada quando o código de barras é detectado
    Quagga.onDetected(function(data) {
        const code = data.codeResult.code;
        document.getElementById('barcode').value = code;
        addProductByBarcode(); // Adiciona o produto automaticamente
        Quagga.stop(); // Para o scanner após detectar o código
        document.getElementById('scanner-container').style.display = 'none';
    });
}


// Função para adicionar produto à lista e calcular o total
function addProductToList(product, price) {
    const productList = document.getElementById('product-list');
    const li = document.createElement('li');
    li.innerHTML = `${product} - R$ ${price.toFixed(2)}`;
    productList.appendChild(li);

    total += price;
    document.getElementById('total-price').textContent = total.toFixed(2);
}

// Função para finalizar compra
function finalizePurchase() {
    alert(`Compra finalizada! Total a pagar: R$ ${total.toFixed(2)}`);
    document.getElementById('product-list').innerHTML = '';
    document.getElementById('total-price').textContent = '0.00';
    total = 0;
}
