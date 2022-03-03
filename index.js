alert(`
Hei!

Velkommen til Handleliste-appen din.
Her kan du få informasjon om hva du må handle, hva du har nok av og hvilke varer du begynner å gå tom for. 

Slik bruker du applikasjonen:

1. Skriv inn varenavnet i tekstfeltet.
2. Du kan legge til varer i tre ulike kategorier. Velg kategori ved å bruke nedtrekksmenyen.
3. Dersom du velger kategorien "Kjøpe mer av", dukker det opp et prisfelt hvor du må fylle ut varens pris.
4. Trykk på "Legg til"-knappen for å legge varen i den valgte listen.

Happy shopping!`);

let needMore = [
  { name: "Ost", price: 50 },
  { name: "Egg", price: 53 },
];

let haveEnough = [{ name: "Smør" }];

let runningOutOf = [{ name: "Melk" }];

function emptyList(ul) {
  const liElements = ul.querySelectorAll(`li`);

  for (let i = 0; i < liElements.length; i++) {
    liElements[i].remove();
  }
}

function upsertList(ulId, list, icon) {
  const ul = document.getElementById(ulId);

  emptyList(ul);

  for (let i = 0; i < list.length; i++) {
    const li = document.createElement("li");
    li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

    if (list[i].price) {
      li.textContent = `${icon} ${list[i].name} ${list[i].price}kr `;
    } else {
      li.textContent = `${icon} ${list[i].name} `;
    }

    const button = document.createElement("button");
    button.textContent = "Slett";
    button.classList.add("btn", "btn-danger");

    button.onclick = () => {
      const answer = prompt(`Vil du slette varen ${list[i].name}? (ja / nei)`);

      if (answer.toLowerCase() === "ja") {
        list.splice(i, 1);
        upsertList(ulId, list, icon);
      }
    };

    li.appendChild(button);
    ul.appendChild(li);
  }

  if (list === needMore) {
    let total = 0;
    for (let i = 0; i < list.length; i++) {
      total += list[i].price;
    }

    const needMoreTotal = document.getElementById("needMoreTotal");
    needMoreTotal.textContent = `Totalpris: ${total}kr`;
  }
}

function findCorrectList(name) {
  if (name === "haveEnough") {
    return haveEnough;
  } else if (name === "runningOutOf") {
    return runningOutOf;
  } else {
    return needMore;
  }
}

function findCorrectIcon(name) {
  if (name === "haveEnough") {
    return "✅";
  } else if (name === "runningOutOf") {
    return "➖";
  } else {
    return "🛒";
  }
}

window.onload = () => {
  upsertList("needMore", needMore, findCorrectIcon("needMore"));
  upsertList("runningOutOf", runningOutOf, findCorrectIcon("runningOutOf"));
  upsertList("haveEnough", haveEnough, findCorrectIcon("haveEnough"));

  document.getElementById("add").onclick = () => {
    const inputEl = document.getElementById("shoppingInput");
    const categorySelect = document.getElementById("categorySelect");
    const list = findCorrectList(categorySelect.value);

    if (categorySelect.value === "needMore") {
      const priceInput = document.getElementById("priceInput");
      const priceNumber = parseInt(priceInput.value);
      if (Number.isNaN(priceNumber)) {
        alert("Du må skrive en pris");
      } else if (priceNumber <= 0) {
        alert("Prisen må være mer enn 0kr");
      } else {
        list.push({ name: inputEl.value, price: priceNumber });
      }
    } else {
      list.push({ name: inputEl.value });
    }

    upsertList(categorySelect.value, list, findCorrectIcon(categorySelect.value));
  };

  document.getElementById("categorySelect").onchange = onChangeCategorySelect;
};

function onChangeCategorySelect(event) {
  const priceInputLabel = document.getElementById("priceInputLabel");
  const categorySelect = event.target;

  if (categorySelect.value === "needMore") {
    priceInputLabel.classList.remove("d-none");
  } else {
    priceInputLabel.classList.add("d-none");
  }
}
