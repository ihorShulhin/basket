document.body.onload = function() {
    var xhttp, txtDoc;

    xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            txtDoc = xhttp.responseText;
            var cds = JSON.parse(txtDoc);
            for (var i = 0; i < cds.length; i++) {
                let cdCatalog = new CdCatalog(cds[i].TITLE, cds[i].ARTIST, cds[i].COUNTRY, cds[i].COMPANY, cds[i].PRICE, cds[i].YEAR);

                cdCatalog.listLi();
                cdCatalog.addTable();
                cdCatalog.clickCart();
                cdCatalog.buttonAdd();
                cdContent.push(cdCatalog);
            }
        }
    }
    xhttp.open('GET', 'http://localhost:8080/homework24.Basket/ajax/cd_catalog4.json', true);
    xhttp.send();
}

let tbodyEU = document.getElementById('CDSEU').children[1];
let tbodyUSA = document.getElementById('CDSUSA').children[1];
let tbodyNorway = document.getElementById('CDSNorway').children[1];
let tbodyUK = document.getElementById('CDSUK').children[1];
let tbodyCart = document.getElementById('CDSCart').children[1];
let cdContent = [];
let cartContent = [] // массив для хранения добавляемы элементов (строки) в корзину

function CdCatalog (title, artist, country, company, price, year) {
    this.title = title;
    this.artist = artist;
    this.country = country;
    this.company = company;
    this.price = price;
    this.year = year;
    this.count = 0; // количество изначально 0
    let btnAdd = document.createElement('input'); // переменная в которой находится кнопка button , при нажатии на которую добавляем содержимое строки в корзину, делаем её глобальной переменной, чтобы можно было обратиться к ней отовсюду в КОНСТРУКТОРЕ
    let btnRemove = document.createElement('input'); // переменная в которой находится кнопка button , при нажатии на которую удаляем содержимое строки из корзины, делаем её глобальной переменной, чтобы можно было обратиться к ней отовсюду в КОНСТРУКТОРЕ
    let self = this; // записываем this в переменную self (замыкание), self используется для поддержания ссылки на исходный this даже при изменении контекста;
    this.trCurrent = document.createElement('tr');
    this.trCreate = function() { // метод для создания строк и ячеек в таблице
        // создаём ячейки (td) для добавление в строку
        let tdTitle = document.createElement('td');
        tdTitle.innerHTML = this.title;

        let tdArtist = document.createElement('td');
        tdArtist.innerHTML = this.artist;

        let tdCompany = document.createElement('td');
        tdCompany.innerHTML = this.company;

        let tdPrice = document.createElement('td');
        tdPrice.innerHTML = this.price;

        let tdYear = document.createElement('td');
        tdYear.innerHTML = this.year;

        let tdAdd = document.createElement('td');
        btnAdd.setAttribute('type', 'button');
        btnAdd.setAttribute('value', 'Add');
        btnAdd.style.width = '100%';
        tdAdd.appendChild(btnAdd);

        // добавляем ячейки (td)  в нашу строку this.trCurrent
        this.trCurrent.appendChild(tdTitle);
        this.trCurrent.appendChild(tdArtist);
        this.trCurrent.appendChild(tdCompany);
        this.trCurrent.appendChild(tdPrice);
        this.trCurrent.appendChild(tdYear);
        this.trCurrent.appendChild(tdAdd);
    }
    this.buttonAdd = function() { // метод добавления строки в таблицу при клике на кнопку btnAdd
        btnAdd.onclick = function() {
            let parentTr = this.parentElement.parentElement.children;
            // console.log(parentTr);

                // создаём обьект ,элементы которого добавляем в массив cartConent для хранения и добавления в таблицу с корзиной
                var cdCart = new CdCatalog(parentTr[0].innerHTML, parentTr[1].innerHTML, self.country, parentTr[2].innerHTML, parentTr[3].innerHTML, parentTr[4].innerHTML);

                let indexCart = isAbsent(cdCart); // получаем индекс присутствуещго ранее в корзине товара или -1 в случае его отсутствия и записываем результат работы функции в переменную
                if (indexCart == -1) {
                    cartContent.push(cdCart); // обьект пушим в массив
                    cdCart.count++;
                    console.log(cartContent);

                    cdCart.trCreate();
                    // кнопка удаления из таблицы и массива элемента (строки)
                    let btnRemove = document.createElement('input');
                    let tdRemove = document.createElement('td');
                    btnRemove.setAttribute('type', 'button');
                    btnRemove.setAttribute('value', 'Remove');
                    btnRemove.style.width = '100%';
                    tdRemove.appendChild(btnRemove);
                    // ячейка tdCount ,в которой хранится значение количества элементов
                    cdCart.trCurrent.children[0].innerHTML = self.title;
                    cdCart.trCurrent.children[1].innerHTML = self.artist;
                    cdCart.trCurrent.children[2].innerHTML = self.country;
                    cdCart.trCurrent.children[3].innerHTML = self.company;
                    cdCart.trCurrent.children[4].innerHTML = self.price;
                    cdCart.trCurrent.children[5].innerHTML = self.year;
                    cdCart.trCurrent.appendChild(tdRemove);

                    let tdCount = document.createElement('td');
                    tdCount.innerHTML = cdCart.count;
                    cdCart.trCurrent.appendChild(tdCount);

                    tbodyCart.appendChild(cdCart.trCurrent);

                    btnRemove.onclick = function() {
                        let rowTableCart = this.parentElement.parentElement.rowIndex - 1; // в переменную rowTableCart записываем индекс строки ,которую удаляем при клике на btnRemove, rowIndex - 1 - так как в таблице строки начаинаются с 1 позиции , а в массиве с 0
                        let countDelCart = cartContent[rowTableCart].count; //получаем индекс строки из соответствуещего удаляемого из массива корзины элемента по содержимому count

                        if (countDelCart == 1) {
                            cartContent.splice(rowTableCart, 1); // удаление из массива 1го элемента  по его индексу
                            tbodyCart.removeChild(cdCart.trCurrent); // удаление строки из таблицы
                        } else { // иначе если в массиве или в таблице количество больше 1 ,то убавляем count из массива и таблицы до 1го
                            let delCart = cartContent[rowTableCart];
                            delCart.count--; // уменьшения count на 1
                            delCart.trCurrent.children[7].innerHTML = delCart.count;
                        }
                    }

                } else { // иначе если в пеменную вернулось значение 1, то меняем количество ++ содержимое в ячейке (tdCount), изначально 0
                    let addCart = cartContent[indexCart]; // cartContent[indexCart] - элемент в массиве, под каким индексом элемент находится в массиве , addCart - наш конкретный элемент в массиве (обьект), на кнопку btnAdd которого кликнули в таблице
                    addCart.count++;
                    addCart.trCurrent.children[7].innerHTML = addCart.count;
                }
        };
    }
    this.addTable = function() { // метод добавления созданных строк в таблицу , кликнув на нужную нам 'страну' (li) в tbody добавляется содержимое таблицы соответствующей стране
        this.trCreate();

        switch (this.country) {
            case 'EU':
                tbodyEU.appendChild(this.trCurrent);
                break;
            case 'USA':
                tbodyUSA.appendChild(this.trCurrent);
                break;
            case 'Norway':
                tbodyNorway.appendChild(this.trCurrent);
                break;
            case 'UK':
                tbodyUK.appendChild(this.trCurrent);
                break;
        }
    }
    this.listLi = function() { // метод , при котором кликая по нужной нам (li) отображается соответсвующая таблица
        let listLi = document.getElementById('listCountry').children;

        for (var i = 0; i < listLi.length; i++) {
            listLi[i].addEventListener('click', function() {
                let itemId = 'content' + this.id.substr(4);
                hideAll();
                document.getElementById(itemId).style.display = 'block';
                document.getElementById('cart').style.display = 'none';
            });
        }
    }
    function hideAll() { // функция скрытия таблицы, если клик был на другом (li), соответственно потом нужно вывести на экран таблицу кликнутой (Li)
        let contentsTable = document.getElementsByClassName('content');
        for (var i = 0; i < contentsTable.length; i++) {
            contentsTable[i].style.display = 'none';
        }
    }
    function isAbsent(cdCart) { // функция для проверки элементов в массиве cartConent, для того чтобы повторно не добавлять в массив и в таблицу tbodyCart кликнутые элементы
        let isAbsent = -1; // -1 - изначально элементов нет в массиве и в табл

        for (var i = 0; i < cartContent.length; i++) {
            // если в массиве есть элемент ,который мы добавляем , то переменная принимает значение i - позиция элемента в массиве
            if (cartContent[i].title == cdCart.title) {
                isAbsent = i; // записыв позиц элемента в массиве в переменную
                break; // присваиваем isAbsent = 1 и выходим из цикла
            }
        }
        console.log(isAbsent);
        return isAbsent; // возвращаем полученое значение по условию if
    }
    this.clickCart = function() { // метод, при нажатии на корзину, все блоки скрывается , а блок с корзиной выводится на экран
        document.getElementById('iconCart').addEventListener('click', function() {
            hideAll();
            document.getElementById('cart').style.display = 'block';
        });
    }
}
