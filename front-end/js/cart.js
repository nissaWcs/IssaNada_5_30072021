if (cartStorage == 0){
    let productsTable = document.querySelector("#cart-tablebody");
    productsTable.innerHTML += `
                <tr>
                <td colspan="3" class="text-center font-weight-bold"> Votre panier est vide</td>
                </tr>
    `;
}else{
    for(product of cartStorage){
        productsDisplay(product);
    };
};

//Dsiplaying the function for total sum of the shopcart
const totalCart = document.querySelector("#total-cart");
totalCart.innerHTML +=
        `<td>Total Panier</td>
        <td></td>
        <td>${calculation()}</td>`;    



//Note for indexRef: defining the indexation property for adding and removing products -
//by targeting data-index attribute in innerHtml content here above

//add item by plus button
let addWPlus = document.getElementsByClassName("addPlus");
for (adding of addWPlus) {
    adding.addEventListener("click", (event) => {
    let indexRef = event.target.getAttribute("data-index");
    cartStorage[indexRef].quantity++;
    localStorage.setItem("cameras", JSON.stringify(cartStorage));
    location.reload();
    });
};

//remove item by minus button
let remWMinus = document.getElementsByClassName("removeMinus");
for (removing of remWMinus) {
    removing.addEventListener("click", (event) => {
        let indexRef = event.target.getAttribute("data-index");
        //prevent clicking on minus button if the item quantity is 1
        if (cartStorage[indexRef].quantity === 1){
            remWMinus.disabled = true;
        //remove one item with the minus button if the quantity more than 1    
        }else{
            cartStorage[indexRef].quantity--;
        }
        localStorage.setItem("cameras", JSON.stringify(cartStorage));
        location.reload();
    });
};

//deleting individual item
let dltWTrash = document.getElementsByClassName("deleteTrash");
for (deleting of dltWTrash){
    deleting.addEventListener("click", (event) => {
        let indexRef = event.target.getAttribute("data-index");
        cartStorage.splice(indexRef, 1);
        localStorage.setItem("cameras", JSON.stringify(cartStorage));
        location.reload();
    });
};


//Clear cart
const emptyCart = document.querySelector("#emptyCart");
emptyCart.addEventListener('click', (empty) =>{
    empty.preventDefault();
    localStorage.clear();
    location.reload();
});


//setting input rules for form validation

//setting constants for the form div, the submit button and the checkbox
const orderForm = document.querySelector("#orderForm");
const submitForm = document.querySelector("#submitBtn");
const checkBox = document.querySelector("#checkbox");

//setting constants for the regex conditions
/*for names one or more strings from characters between a and z (lower and upper cases) 
with possible accent letters with one white space or - only, 
or one or more strings with no space or -*/
const condName = /^(([a-zA-ZÀ-ÿ]+[\s\-]{1}[a-zA-ZÀ-ÿ]+)|([a-zA-ZÀ-ÿ]+))$/;
/*for emails one or more strings from characters between a and z (lower and upper cases) 
and/or entire number and/or dots dashes then @ symbole, then two or more characters 
with the same rules with no special characters then a dot and then lowercases between 2 and 4 letters*/
const condMail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}\.[a-z]{2,4}$/;
//for city name same as names but limited to 10 characters
const condCity = /^(([a-zA-ZÀ-ÿ]+[\s\-]{1}[a-zA-ZÀ-ÿ]+)|([a-zA-ZÀ-ÿ]+)){1,10}$/;
/*for zip code a non-capturing group of 5digits, first two ange from 01 to 98 
(\d indicates for each of this cases we have only one digit) then the rest is limited to 3 digits*/
const condZip = /^(?:[0-8]\d|9[0-8])\d{3}$/;
//for address same as names but with possibility of numbers and limited to 10 characters by string
const condAddress = /^(([a-zA-ZÀ-ÿ0-9]+[\s\-]{1}[a-zA-ZÀ-ÿ0-9]+)){1,10}$/;

//setting the contactInfo object to use later in the confirmation page

    
    //setting the event listener in case of click on the submit button
    //setting the function for the command form
    submitForm.addEventListener("click", (validate) =>{
        validate.preventDefault();
        let contactInfo = {
            firstName: document.querySelector("#firstName").value,
            lastName: document.querySelector("#lastName").value,
            inputEmail: document.querySelector("#inputEmail").value,
            inputAddress: document.querySelector("#inputAddress").value,
            inputCity: document.querySelector("#inputCity").value,
            inputZip: document.querySelector("#inputZip").value,
        };
        
    
        //setting the loop for the successful input
        if (
            (condName.test(contactInfo.firstName) === true) &
            (condName.test(contactInfo.lastName) === true) &
            (condMail.test(contactInfo.inputEmail) === true) &
            (condCity.test(contactInfo.inputCity) === true) &
            (condZip.test(contactInfo.inputZip) === true) &
            (condAddress.test(contactInfo.inputAddress) === true) &
            (checkBox.checked === true) 
            ) {
                let products = [];
                for (list of cartStorage){
                    products.push(list.id);            
                };
                
                //setting the order id random operation
                let orderId = Math.floor((1 + Math.random())* 0x10000)
                    .toString(16)
                    .substring(1);
                    localStorage.setItem("orderId", orderId);
            
                //the post method
                fetch("http://localhost:3000/api/cameras/order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ contactInfo, products }),
                })
                    .then((response) => response.json())
                    .then(() => {
                        let order = {
                            contactInfo,
                            products,
                            orderId
                        };
                        localStorage.setItem("order", JSON.stringify(order));
                        document.location.href = "confirmation.html";
                    })
                    
                .catch((erreur) => console.log("erreur : " + erreur));
            
            }else{   
            //setting the loop for the non-successful input
            alert("Merci de respecter les consignes de saisie et de remplir et cocher tous les champs!");
        };
    });
    
    
    
    
    
        
