const API_URL = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-FSA-ET-WEB-FT-SF/events';

const state = {
  parties: [],
};

const partiesList = document.querySelector('#partiesList');
const addPartyForm = document.querySelector('#addParty');
addPartyForm.addEventListener('submit', partyPush);

async function getParties() {
  const response = await fetch(API_URL);
  const json = await response.json();
  state.parties = json.data;
}

function renderParties() {
  partiesList.innerHTML = state.parties.length ? '' : `<li>${error}</li>`;
  state.parties.forEach((party) => {
    const partyRow = document.createElement('li');
    partyRow.classList.add('party');
    partyRow.innerHTML = `
      <div>
        <strong>${party.name}</strong>
        <p>${party.date}</p>
        <p>${party.location}</p>
        <p>${party.description}</p>
      </div>
    `;
    partyRow.appendChild(createDeleteButton(party));
    partiesList.appendChild(partyRow);
  });
}

function createDeleteButton(party) {
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => deleteParty(party));
  return deleteButton;
}

async function render() {
  await getParties();
  renderParties();
}

render();

async function addParty(name, date, location, description) {
  const isoDate = new Date(date + ':00').toISOString();
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, date: isoDate, location, description }),
  });
  const json = await response.json();
  state.parties.push(json);
  render();
}

async function partyPush(event) {
  event.preventDefault();
  await addParty(
    addPartyForm.name.value,
    addPartyForm.date.value,
    addPartyForm.location.value,
    addPartyForm.description.value
  );
  addPartyForm.reset();
}

async function updatePartyList(id, name, date, location, description) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, date, location, description }),
  });
  const json = await response.json();
  render();
}

async function deleteParty(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  const json = await response.json();
  render();
}
