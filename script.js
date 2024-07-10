document.addEventListener('DOMContentLoaded', () => {
    const destinationInput = document.getElementById('destination');
    const placeInput = document.getElementById('place');
    const dateInput = document.getElementById('date');
    const addPlaceButton = document.getElementById('add-place');
    const placesListContainer = document.getElementById('places-list-container');

    addPlaceButton.addEventListener('click', () => {
        const place = placeInput.value.trim();
        const date = dateInput.value;
        if (place !== '' && date !== '') {
            let dateContainer = document.querySelector(`[data-date="${date}"]`);
            if (!dateContainer) {
                dateContainer = document.createElement('div');
                dateContainer.classList.add('date-container');
                dateContainer.dataset.date = date;

                const dateTitle = document.createElement('h3');
                dateTitle.textContent = new Date(date).toDateString();
                dateContainer.appendChild(dateTitle);

                const placesList = document.createElement('ul');
                dateContainer.appendChild(placesList);

                placesListContainer.appendChild(dateContainer);
            }

            const placesList = dateContainer.querySelector('ul');

            const listItem = document.createElement('li');

            const placeName = document.createElement('span');
            placeName.textContent = place;

            const transportButtons = document.createElement('div');
            transportButtons.classList.add('transportation-buttons');

            const transports = [
                { mode: 'train', icon: 'fas fa-train' },
                { mode: 'bus', icon: 'fas fa-bus' },
                { mode: 'bike', icon: 'fas fa-bicycle' },
                { mode: 'foot', icon: 'fas fa-walking' }
            ];

            transports.forEach(transport => {
                const button = document.createElement('button');
                button.innerHTML = `<i class="${transport.icon}"></i>`;
                button.title = transport.mode.charAt(0).toUpperCase() + transport.mode.slice(1);
                button.addEventListener('click', () => {
                    const allButtons = transportButtons.querySelectorAll('button');
                    allButtons.forEach(btn => btn.classList.remove('selected'));
                    button.classList.add('selected');
                });
                transportButtons.appendChild(button);
            });

            listItem.appendChild(placeName);
            listItem.appendChild(transportButtons);
            placesList.appendChild(listItem);

            placeInput.value = '';
            dateInput.value = '';
            placeInput.focus();
        }
    });

    placeInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addPlaceButton.click();
        }
    });

    dateInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addPlaceButton.click();
        }
    });
});
