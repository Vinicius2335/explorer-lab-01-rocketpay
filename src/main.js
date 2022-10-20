import "./css/index.css";
import IMask from "imask";

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path");
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path");
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type){
  const colors = {
    "visa": ["#436D00", "#2D57F2"],
    "mastercard": ["#DF6F29", "#C69347"],
    "default": ["black", "gray"],
  }

  ccBgColor01.setAttribute("fill", colors[type][0]);
  ccBgColor02.setAttribute("fill", colors[type][1]);
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

// setCardType("mastercard");

// disponibilizando uma biblioteca global
globalThis.setCardType = setCardType

/********************************
    SecurityCode
**********************************/

const securityCode = document.querySelector("#security-code");
// padrao da mascara para apenas 4 digitos
const securityCodePattern = {
  mask: "0000"
}
const securityCodeMasked = IMask(securityCode, securityCodePattern);

// on = addEventListener
securityCodeMasked.on("accept", () => {
  updateSercurityCode(securityCodeMasked.value);
});

function updateSercurityCode(code){
  const ccSecurity = document.querySelector(".cc-security .value");
  ccSecurity.innerText = code.length === 0 ? "123": code;
}

/********************************
    ExpirationDate
**********************************/

// mascara: mes/ano -> 01-12/min ano atual, max 10 anos(32)
const expirationDate = document.querySelector("#expiration-date");
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2)
    }
  }
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern);

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value);
});

function updateExpirationDate(date){
  const ccExpirationDate = document.querySelector(".cc-extra .value");
  ccExpirationDate.innerText = date.length === 0 ? "02/32" : date;
}

/********************************
    CardNumber
**********************************/

const cardNumber = document.querySelector("#card-number");
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard"
    },    
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default"
    },
  ],
  // função que executa toda vez que inserimos um digito no imput #card-number
  dispatch: function(appended, dynamicMasked){
    // subistitui tudo que não for digito por ""(vazio)
    const number = (dynamicMasked.value + appended).replace(/\D/g, "");

    // const foundMask = dynamicMasked.compiledMasks.find(({regex}) => number.match(regex));
    // ou
    const foundMask = dynamicMasked.compiledMasks.find(function(item){
      return number.match(item.regex);
    });

    // console.log(foundMask);

    return foundMask;
  }
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype;
  setCardType(cardType);
  updateCardNumber(cardNumberMasked.value);
});

function updateCardNumber(number){
  const ccNumber = document.querySelector(".cc-number");
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number;
}

/********************************
    AddButton
**********************************/

const addButton = document.querySelector("#add-card");
addButton.addEventListener("click", () => {
  alert("Cartão adicionado");
});

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
})

/********************************
    CardHolder
**********************************/

const cardHolder = document.querySelector("#card-holder");
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value");
  ccHolder.innerText = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value;
});



/*
      REGEX
  Usado para buscar padroes dentro de texto
  // procure na string todas as letras maiusculas de A-Z e devolva dentro de um Array
  const matches = 'aBC'.matche[/A-Z/];
  output: [B, C]

  // existe letras maiusculas de A-Z dentro da string ? true=1, false=0
  const index = 'aBC'.search[/A-Z/];
  output: 1

  // substitua todas os 'a' por 'A' da string
  const replace = 'aBC'.replace[/a/, 'A'];
  output: ABC

  regex \D = não digito
*/