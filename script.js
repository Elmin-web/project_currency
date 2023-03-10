const rates = document.querySelectorAll(".rates li");
const converted = document.querySelectorAll(".converted li");
const current_input = document.querySelector(".current_input");
const inputSpan = document.querySelector(".input_span");
const resultSpan = document.querySelector(".result_span");
const resultInput = document.querySelector(".result_input");
const options = document.querySelector(".options");
const optionsTo = document.querySelector(".options_to");
const activeFromCurrency = document.querySelector("#active_from_currency");
const activeToCurrency = document.querySelector("#active_to_currency");
let from = "RUB",
  to = "RUB";
const getCurrency = async (current, change, inputValue) => {
  const res = await fetch(
    `https://api.exchangerate.host/latest?base=${current}&symbols=${change}`
  );
  const data = await res.json();
  if (!inputValue) inputValue = 1;
  let calculate = data.rates[change] * inputValue;
  let result = 1 / data.rates[change];
  resultInput.innerText = `${parseFloat(calculate.toFixed(4))} ${change}`;
  inputSpan.innerText = `1 ${data.base} = ${parseFloat(
    data.rates[change].toFixed(4)
  )} ${change}`;
  resultSpan.innerText = `1 ${Object.keys(data.rates)[0]} = ${parseFloat(
    result.toFixed(4)
  )} ${current}`;
};

function check() {
  getCurrency(from, to, current_input.value);
}

window.addEventListener("load", check);
// add and remove active class

function toggleActive(elements, activeEl) {
  elements.forEach((el) => el.classList.remove("active"));
  activeEl.classList.add("active");
}

fetch(`https://api.exchangerate.host/latest?base=AZN`)
  .then((res) => res.json())
  .then((data) => {
    current_input.addEventListener("input", check);
    rates.forEach((el) =>
      el.addEventListener("click", (e) => {
        toggleActive(rates, e.target);
        from = e.target.innerText;
        check();
      })
    );
    converted.forEach((el) =>
      el.addEventListener("click", (e) => {
        toggleActive(converted, e.target);
        to = e.target.innerText;
        check();
      })
    );
    document.querySelector("#search_from").addEventListener("input", (e) => {
      let input = e.target;
      search(options, data, input);
    });
    document.querySelector("#search_to").addEventListener("input", (e) => {
      let input = e.target;
      let options_to = document.querySelector(".options_to");
      search(options_to, data, input, false);
    });
  });
//Search Currency
function search(optionsEl, data, input, isFrom = true) {
  let ratesArr = Object.keys(data.rates);
  ratesArr = ratesArr.filter((item) =>
    item.includes(input.value.toUpperCase())
  );
  optionsEl.innerHTML = "";
  ratesArr.forEach((rate) => {
    const li = document.createElement("li");
    li.innerText = rate;
    optionsEl.append(li);
    li.addEventListener("click", (e) => {
      optionsEl.innerHTML = "";
      input.value = "";
      if (isFrom) {
        from = e.target.innerText;
        activeFromCurrency.innerText = from;
        toggleActive(rates, activeFromCurrency);
        check();
      } else {
        to = e.target.innerText;
        activeToCurrency.innerText = to;
        toggleActive(converted, activeToCurrency);
        check();
      }
    });
  });
}
//reverse Currency
function reverse() {
  let tmp = from;
  from = to;
  to = tmp;
  check();
}

document.querySelector(".btn").addEventListener("click", reverse);

window.addEventListener("click", () => {
  options.innerHTML = "";
  optionsTo.innerHTML = "";
});
