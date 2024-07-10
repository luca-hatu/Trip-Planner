document.addEventListener('DOMContentLoaded', () => {
    const destinationInput = document.getElementById('destination');
    const placeInput = document.getElementById('place');
    const dateInput = document.getElementById('date');
    const addPlaceButton = document.getElementById('add-place');
    const placesListContainer = document.getElementById('places-list-container');
    const viewSummaryButton = document.getElementById('view-summary');
    const saveTripButton = document.getElementById('save-trip');
    const modal = document.getElementById('summary-modal');
    const summaryContent = document.getElementById('summary-content');
    const span = document.getElementsByClassName('close')[0];

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

            const placeActions = document.createElement('span');
            placeActions.classList.add('place-actions');

            const editButton = document.createElement('button');
            editButton.classList.add('edit-place');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => {
                placeInput.value = placeName.textContent;
                dateInput.value = date;
                listItem.remove();
            });

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-place');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                listItem.remove();
            });

            placeActions.appendChild(editButton);
            placeActions.appendChild(deleteButton);

            listItem.appendChild(placeName);
            listItem.appendChild(transportButtons);
            listItem.appendChild(placeActions);
            placesList.appendChild(listItem);

            placeInput.value = '';
            dateInput.value = '';
        }
    });

    function saveTripPlan() {
        const tripPlan = [];
        const dateContainers = document.querySelectorAll('.date-container');
        dateContainers.forEach(container => {
            const date = container.dataset.date;
            const places = [];
            container.querySelectorAll('li').forEach(item => {
                const place = item.querySelector('span').textContent;
                const selectedTransport = item.querySelector('.transportation-buttons .selected');
                const transportMode = selectedTransport ? selectedTransport.title.toLowerCase() : null;
                places.push({ place, transportMode });
            });
            tripPlan.push({ date, places });
        });
        localStorage.setItem('tripPlan', JSON.stringify(tripPlan));
    }

    function loadTripPlan() {
        const tripPlan = JSON.parse(localStorage.getItem('tripPlan'));
        if (tripPlan) {
            tripPlan.forEach(day => {
                const { date, places } = day;
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
                places.forEach(placeObj => {
                    const { place, transportMode } = placeObj;
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
                        if (transportMode === transport.mode) {
                            button.classList.add('selected');
                        }
                        button.addEventListener('click', () => {
                            const allButtons = transportButtons.querySelectorAll('button');
                            allButtons.forEach(btn => btn.classList.remove('selected'));
                            button.classList.add('selected');
                        });
                        transportButtons.appendChild(button);
                    });

                    const placeActions = document.createElement('span');
                    placeActions.classList.add('place-actions');

                    const editButton = document.createElement('button');
                    editButton.classList.add('edit-place');
                    editButton.textContent = 'Edit';
                    editButton.addEventListener('click', () => {
                        placeInput.value = placeName.textContent;
                        dateInput.value = date;
                        listItem.remove();
                    });

                    const deleteButton = document.createElement('button');
                    deleteButton.classList.add('delete-place');
                    deleteButton.textContent = 'Delete';
                    deleteButton.addEventListener('click', () => {
                        listItem.remove();
                    });

                    placeActions.appendChild(editButton);
                    placeActions.appendChild(deleteButton);

                    listItem.appendChild(placeName);
                    listItem.appendChild(transportButtons);
                    listItem.appendChild(placeActions);
                    placesList.appendChild(listItem);
                });
            });
        }
    }

    loadTripPlan();

    viewSummaryButton.addEventListener('click', () => {
        summaryContent.innerHTML = '';
        const tripPlan = JSON.parse(localStorage.getItem('tripPlan'));
        if (tripPlan) {
            tripPlan.forEach(day => {
                const { date, places } = day;
                const dateDiv = document.createElement('div');
                const dateTitle = document.createElement('h3');
                dateTitle.textContent = new Date(date).toDateString();
                dateDiv.appendChild(dateTitle);

                const placesList = document.createElement('ul');
                places.forEach(placeObj => {
                    const { place, transportMode } = placeObj;
                    const listItem = document.createElement('li');
                    listItem.textContent = `${place} - ${transportMode ? transportMode.charAt(0).toUpperCase() + transportMode.slice(1) : 'No transport selected'}`;
                    placesList.appendChild(listItem);
                });

                dateDiv.appendChild(placesList);
                summaryContent.appendChild(dateDiv);
            });
        }
        modal.style.display = 'block';
    });

    span.onclick = function () {
        modal.style.display = 'none';
    };

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    saveTripButton.addEventListener('click', saveTripPlan);
});
