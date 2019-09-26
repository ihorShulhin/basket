    //----------------------------------------------------------------------//
var tbodyEU = document.getElementById('CDSEU').children[1];
var tbodyUSA = document.getElementById('CDSUSA').children[1];
var tbodyNorway = document.getElementById('CDSNorway').children[1];
var tbodyUK = document.getElementById('CDSUK').children[1];
var tbodyCart = document.getElementById('CDSCart').children[1];
let theadCart = document.getElementById('CDSCart').children[0];
var cartContent = [];
var cdContents = [];

document.body.onload = function() {
    var xhttp, txtDoc;

    xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            txtDoc = xhttp.responseText;
            var cds = JSON.parse(txtDoc);
            for (var i = 0; i < cds.length; i++) {
                var cdCatalog = new CdCatalog(cds[i].TITLE, cds[i].ARTIST, cds[i].COUNTRY, cds[i].COMPANY, cds[i].PRICE, cds[i].YEAR);

                cdCatalog.listLi();
                cdCatalog.addTable();
                cdCatalog.clickCart();
                cdContents.push(cdCatalog);
            }
        }
    }
    xhttp.open('GET', 'http://localhost:8080/homework24.Basket/ajax/cd_catalog4.json', true);
    xhttp.send();
}

function CdCatalog(title, artist, country, company, price, year) {
    this.title = title;
    this.artist = artist;
    this.country = country;
    this.company = company;
    this.price = price;
    this.year = year;
    this.count = 0;
    var self = this;
    this.trCurrent = document.createElement('tr');
    this.trCreate = function() {
        var tdTitle = document.createElement('td');
        tdTitle.innerHTML = this.title;

        var tdArtist = document.createElement('td');
        tdArtist.innerHTML = this.artist;

        var tdCountry = document.createElement('td');
        tdCountry.innerHTML = this.country;

        var tdCompany = document.createElement('td');
        tdCompany.innerHTML = this.company;

        var tdPrice = document.createElement('td');
        tdPrice.innerHTML = this.price;

        var tdYear = document.createElement('td');
        tdYear.innerHTML = this.year;

        var tdAdd = document.createElement('td');
        var btnAdd = document.createElement('input');
        btnAdd.setAttribute('type', 'button');
        btnAdd.setAttribute('id', 'btnAdd');
        btnAdd.setAttribute('value', 'добавить');
        btnAdd.style.width = '100%';
        tdAdd.appendChild(btnAdd);

        btnAdd.addEventListener('click', function() {
            var parentTr = this.parentElement.parentElement;

            var cdCart = new CdCatalog(parentTr.children[0].innerHTML, parentTr.children[1].innerHTML, self.country, parentTr.children[2].innerHTML, parentTr.children[3].innerHTML, parentTr.children[4].innerHTML);

            let indexBasket = isApsent(cdCart); // получаем индекс присутствуещго ранее в корзине товара или -1 в случае его отсутствия
            if (indexBasket == -1) {

                cartContent.push(cdCart);
                cdCart.count++;
                console.log(cdCart);
                cdCart.trCreate();

                var tdRemove = document.createElement('td');
                var btnRemove = document.createElement('input');
                btnRemove.setAttribute('type', 'button');
                btnRemove.setAttribute('id', 'btnRemove');
                btnRemove.setAttribute('value', 'удалить');
                btnRemove.style.width = '100%';
                tdRemove.appendChild(btnRemove);

                console.log(cdCart.trCurrent.children.length);
                cdCart.trCurrent.children[0].innerHTML = self.title
                cdCart.trCurrent.children[1].innerHTML = self.artist;
                cdCart.trCurrent.children[2].innerHTML = self.country;
                cdCart.trCurrent.children[3].innerHTML = self.company;
                cdCart.trCurrent.children[4].innerHTML = self.price;
                cdCart.trCurrent.children[5].innerHTML = self.year;

                cdCart.trCurrent.appendChild(tdRemove);

                let tdCount = document.createElement('td');
                tdCount.innerHTML = cdCart.count; // Добавляем ячейку с количеством внутри первичного добавления товара в корзину

                cdCart.trCurrent.appendChild(tdCount);


                tbodyCart.appendChild(cdCart.trCurrent);
                btnRemove.addEventListener('click', () => {
                    // console.log(cdCart.trCurrent.rowIndex);
                    var rowTableCart = cdCart.trCurrent.rowIndex;
                    let countDelCart = cartContent[rowTableCart - 1].count; // получаем индекс строки из соответствуещего удаляемого из массива корзины элемента по содержимому count

                    if (countDelCart == 1) { // если количество экземпляров товара в корзине равна 1, тоесть мы имеем последний товар
                        cartContent.splice(rowTableCart - 1, 1); // элементы массива нумеруются с 0, а индексы строк с 1, по этому делаем - 1, для того чтобы индекс соответсвовал элементам массива
                        tbodyCart.removeChild(cdCart.trCurrent);
                    } else { // иначе если товаров в корзине больше чем 1 ,то уменьшаем их количество на единицу
                        let delCart = cartContent[rowTableCart - 1];
                        delCart.count--;
                        delCart.trCurrent.children[7].innerHTML = delCart.count;
                    }
                });
        } else {
            // создаём переменную ссылающийся на добавляемый, НО существующий в корзине объект , при повторном клике его добавляем количестве.
            let addCart = cartContent[indexBasket];
            addCart.count++;
            addCart.trCurrent.children[7].innerHTML = addCart.count;
        }
        });

        this.trCurrent.appendChild(tdTitle);
        this.trCurrent.appendChild(tdArtist);
        this.trCurrent.appendChild(tdCompany);
        this.trCurrent.appendChild(tdPrice);
        this.trCurrent.appendChild(tdYear);
        this.trCurrent.appendChild(tdAdd);
    }
    this.addTable = function() {
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
    this.listLi = function() {
        var listLi = document.getElementById('listCountry').children;
        for (var i = 0; i < listLi.length; i++) {
            listLi[i].addEventListener('click', function() {
                var itemId = 'content' + this.id.substr(4);
                hideAll();
                document.getElementById(itemId).style.display = 'block';
                document.getElementById('cart').style.display = 'none';
            });
        }
    }

    function isApsent(cdCart) {
        let yesNo = -1; // переменная проверяющая наличие данного товара в массиве, 1 - товар есть, -1 - товара нету
        for (var i = 0; i < cartContent.length; i++) {
            if (cartContent[i].title == cdCart.title) {
                yesNo = i;
                break;
            }
        }
        return yesNo;
    }
    function hideAll() {
        var contents = document.getElementsByClassName('content');
        for (var i = 0; i < contents.length; i++) {
            contents[i].style.display = 'none';
        }
    }
    this.clickCart = function() {
        document.getElementById('iconCart').addEventListener('click', function() {
            hideAll();
            document.getElementById('cart').style.display = 'block';
        });
    }
}
