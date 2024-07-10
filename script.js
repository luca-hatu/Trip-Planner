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
    const saveModal = document.getElementById('save-modal');
    const saveSpan = saveModal.getElementsByClassName('close')[0];
    const confirmSaveButton = document.getElementById('confirm-save');
    const tripNameInput = document.getElementById('trip-name');
    const loadModal = document.getElementById('load-modal');
    const loadSpan = loadModal.getElementsByClassName('close')[0];
    const loadTripsButton = document.getElementById('load-trips');
    const tripList = document.getElementById('trip-list');

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

    function saveTripPlan(tripName) {
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
        const savedTrips = JSON.parse(localStorage.getItem('savedTrips')) || {};
        savedTrips[tripName] = tripPlan;
        localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
    }

    function loadTripPlan(tripName) {
        const savedTrips = JSON.parse(localStorage.getItem('savedTrips'));
        const tripPlan = savedTrips[tripName];
        if (tripPlan) {
            placesListContainer.innerHTML = '';
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

    loadTripsButton.addEventListener('click', () => {
        tripList.innerHTML = '';
        const savedTrips = JSON.parse(localStorage.getItem('savedTrips')) || {};
        for (const tripName in savedTrips) {
            const tripItem = document.createElement('div');
            tripItem.textContent = tripName;
            tripItem.classList.add('trip-item');
            tripItem.addEventListener('click', () => {
                loadTripPlan(tripName);
                loadModal.style.display = 'none';
            });
            tripList.appendChild(tripItem);
        }
        loadModal.style.display = 'block';
    });

    viewSummaryButton.addEventListener('click', () => {
        summaryContent.innerHTML = '';
        const dateContainers = document.querySelectorAll('.date-container');
        dateContainers.forEach(container => {
            const date = container.dataset.date;
            const dateDiv = document.createElement('div');
            const dateTitle = document.createElement('h3');
            dateTitle.textContent = new Date(date).toDateString();
            dateDiv.appendChild(dateTitle);

            const placesList = document.createElement('ul');
            container.querySelectorAll('li').forEach(item => {
                const place = item.querySelector('span').textContent;
                const selectedTransport = item.querySelector('.transportation-buttons .selected i');
                const transportIcon = selectedTransport ? selectedTransport.cloneNode(true) : null;
                const listItem = document.createElement('li');
                const placeName = document.createElement('span');
                placeName.textContent = place;

                listItem.appendChild(placeName);
                if (transportIcon) {
                    transportIcon.style.marginLeft = '10px';
                    listItem.appendChild(transportIcon);
                }
                placesList.appendChild(listItem);
            });

            dateDiv.appendChild(placesList);
            summaryContent.appendChild(dateDiv);
        });
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

    saveTripButton.addEventListener('click', () => {
        tripNameInput.value = '';
        saveModal.style.display = 'block';
    });

    confirmSaveButton.addEventListener('click', () => {
        const tripName = tripNameInput.value.trim();
        if (tripName) {
            saveTripPlan(tripName);
            saveModal.style.display = 'none';
        } else {
            alert('Please enter a trip name.');
        }
    });

    saveSpan.onclick = function () {
        saveModal.style.display = 'none';
    };

    loadSpan.onclick = function () {
        loadModal.style.display = 'none';
    };

    window.onclick = function (event) {
        if (event.target == saveModal || event.target == loadModal) {
            saveModal.style.display = 'none';
            loadModal.style.display = 'none';
        }
    };
});
