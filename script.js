document.addEventListener('DOMContentLoaded', () => {
    const addPlaceButton = document.getElementById('add-place');
    const placesListContainer = document.getElementById('places-list-container');
    const viewSummaryButton = document.getElementById('view-summary');
    const saveTripButton = document.getElementById('save-trip');
    const loadTripsButton = document.getElementById('load-trips');
    const summaryModal = document.getElementById('summary-modal');
    const saveModal = document.getElementById('save-modal');
    const loadModal = document.getElementById('load-modal');
    const itineraryModal = document.getElementById('itinerary-modal');
    const detailsModal = document.getElementById('details-modal');
    const shareModal = document.getElementById('share-modal');
    const span = summaryModal.getElementsByClassName('close')[0];
    const saveSpan = saveModal.getElementsByClassName('close')[0];
    const loadSpan = loadModal.getElementsByClassName('close')[0];
    const itinerarySpan = itineraryModal.getElementsByClassName('close')[0];
    const detailsSpan = detailsModal.getElementsByClassName('close')[0];
    const shareSpan = shareModal.getElementsByClassName('close')[0];
    const saveItineraryButton = document.getElementById('save-itinerary');
    const confirmSaveButton = document.getElementById('confirm-save');
    const copyLinkButton = document.getElementById('copy-link');
    const destinationInput = document.getElementById('destination');
    const placeInput = document.getElementById('place');
    const dateInput = document.getElementById('date');
    const entryPriceInput = document.getElementById('entry-price');
    const transportPriceInput = document.getElementById('transport-price');
    const descriptionInput = document.getElementById('description');
    const tripNameInput = document.getElementById('trip-name');
    const stationInput = document.getElementById('station');
    const lineInput = document.getElementById('line');
    const directionInput = document.getElementById('direction');
    const summaryContent = document.getElementById('summary-content');
    const totalCostElement = document.getElementById('total-cost');
    const tripList = document.getElementById('trip-list');
    const shareLinkInput = document.getElementById('share-link');
    const detailsContent = document.getElementById('details-content');
    let currentPlaceItem = null;

    addPlaceButton.addEventListener('click', () => {
        const place = placeInput.value.trim();
        const date = dateInput.value;
        const entryPrice = parseFloat(entryPriceInput.value) || 0;
        const transportPrice = parseFloat(transportPriceInput.value) || 0;
        const description = descriptionInput.value.trim();

        if (place && date) {
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
            placeName.classList.add('place-name');

            const transportIcons = ['walking', 'car', 'bus', 'train'].map(type => {
                const icon = document.createElement('i');
                icon.classList.add('fas', `fa-${type}`, 'transport-icon');
                icon.dataset.transportType = type;

                icon.addEventListener('click', () => {
                    listItem.dataset.transportType = type;
                    transportIcons.forEach(icon => icon.classList.remove('selected'));
                    icon.classList.add('selected');
                });

                return icon;
            });

            const placeActions = document.createElement('div');
            placeActions.classList.add('place-actions');

            const shareButton = document.createElement('button');
            shareButton.classList.add('share-button');
            shareButton.innerHTML = '<i class="fas fa-share"></i> Share';
            shareButton.addEventListener('click', () => {
                const url = window.location.href.split('#')[0];
                const shareUrl = `${url}#trip=${encodeURIComponent(JSON.stringify(listItem.dataset))}`;
                shareLinkInput.value = shareUrl;
                shareModal.style.display = 'block';
            });

            const itineraryButton = document.createElement('button');
            itineraryButton.classList.add('itinerary-button');
            itineraryButton.textContent = 'Itinerary';
            itineraryButton.addEventListener('click', () => {
                currentPlaceItem = listItem;
                itineraryModal.style.display = 'block';
            });

            const viewDetailsButton = document.createElement('button');
            viewDetailsButton.classList.add('view-details');
            viewDetailsButton.textContent = 'Details';
            viewDetailsButton.addEventListener('click', () => {
                detailsContent.innerHTML = `
                    <p><strong>Place:</strong> ${place}</p>
                    <p><strong>Date:</strong> ${new Date(date).toDateString()}</p>
                    <p><strong>Entry Price:</strong> $${entryPrice.toFixed(2)}</p>
                    <p><strong>Transport Price:</strong> $${transportPrice.toFixed(2)}</p>
                    <p><strong>Transport Type:</strong> ${listItem.dataset.transportType || 'Not set'}</p>
                    <p><strong>Description:</strong> ${description}</p>
                    <p><strong>Itinerary:</strong> ${listItem.dataset.itinerary || 'Not set'}</p>
                `;
                detailsModal.style.display = 'block';
            });

            const editButton = document.createElement('button');
            editButton.classList.add('edit-place');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => {
                placeInput.value = placeName.textContent;
                dateInput.value = date;
                entryPriceInput.value = entryPrice;
                transportPriceInput.value = transportPrice;
                descriptionInput.value = description;
                listItem.remove();
            });

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-place');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                listItem.remove();
            });

            transportIcons.forEach(icon => placeActions.appendChild(icon));
            placeActions.appendChild(shareButton);
            placeActions.appendChild(itineraryButton);
            placeActions.appendChild(viewDetailsButton);
            placeActions.appendChild(editButton);
            placeActions.appendChild(deleteButton);
            listItem.appendChild(placeName);
            listItem.appendChild(placeActions);
            listItem.dataset.entryPrice = entryPrice;
            listItem.dataset.transportPrice = transportPrice;
            listItem.dataset.description = description;
            placesList.appendChild(listItem);

            placeInput.value = '';
            dateInput.value = '';
            entryPriceInput.value = '';
            transportPriceInput.value = '';
            descriptionInput.value = '';
        }
    });

    viewSummaryButton.addEventListener('click', () => {
        const dateContainers = document.querySelectorAll('.date-container');
        let totalCost = 0;

        summaryContent.innerHTML = '';
        dateContainers.forEach(dateContainer => {
            const date = dateContainer.dataset.date;
            const placesList = dateContainer.querySelector('ul');
            const places = placesList.querySelectorAll('li');

            places.forEach(place => {
                const placeName = place.querySelector('.place-name').textContent;
                const entryPrice = parseFloat(place.dataset.entryPrice) || 0;
                const transportPrice = parseFloat(place.dataset.transportPrice) || 0;
                const transportType = place.dataset.transportType || 'Not set';
                const description = place.dataset.description || '';
                const itinerary = place.dataset.itinerary || 'Not set';

                totalCost += entryPrice + transportPrice;

                const placeSummary = document.createElement('div');
                placeSummary.classList.add('place-summary');
                placeSummary.innerHTML = `
                    <p><strong>Place:</strong> ${placeName}</p>
                    <p><strong>Date:</strong> ${new Date(date).toDateString()}</p>
                    <p><strong>Entry Price:</strong> $${entryPrice.toFixed(2)}</p>
                    <p><strong>Transport Price:</strong> $${transportPrice.toFixed(2)}</p>
                    <p><strong>Transport Type:</strong> ${transportType}</p>
                    <p><strong>Description:</strong> ${description}</p>
                    <p><strong>Itinerary:</strong> ${itinerary}</p>
                `;

                summaryContent.appendChild(placeSummary);
            });
        });

        totalCostElement.textContent = totalCost.toFixed(2);
        summaryModal.style.display = 'block';
    });

    saveTripButton.addEventListener('click', () => {
        saveModal.style.display = 'block';
    });

    loadTripsButton.addEventListener('click', () => {
        loadModal.style.display = 'block';
        loadTripList();
    });

    function loadTripList() {
        tripList.innerHTML = '';
        Object.keys(localStorage).forEach(key => {
            if (key !== 'length' && key !== 'key') {
                const tripItem = document.createElement('div');
                tripItem.classList.add('trip-item');
                tripItem.textContent = key;
                tripItem.addEventListener('click', () => {
                    const tripData = JSON.parse(localStorage.getItem(key));
                    loadTripDetails(tripData);
                    loadModal.style.display = 'none';
                });
                tripList.appendChild(tripItem);
            }
        });
    }

    function loadTripDetails(tripData) {
        destinationInput.value = tripData.destination;
        placesListContainer.innerHTML = '';
        tripData.places.forEach(placeData => {
            let dateContainer = document.querySelector(`[data-date="${placeData.date}"]`);
            if (!dateContainer) {
                dateContainer = document.createElement('div');
                dateContainer.classList.add('date-container');
                dateContainer.dataset.date = placeData.date;

                const dateTitle = document.createElement('h3');
                dateTitle.textContent = new Date(placeData.date).toDateString();
                dateContainer.appendChild(dateTitle);

                const placesList = document.createElement('ul');
                dateContainer.appendChild(placesList);

                placesListContainer.appendChild(dateContainer);
            }

            const placesList = dateContainer.querySelector('ul');

            const listItem = document.createElement('li');

            const placeName = document.createElement('span');
            placeName.textContent = placeData.name;
            placeName.classList.add('place-name');

            const transportIcons = ['walking', 'car', 'bus', 'train'].map(type => {
                const icon = document.createElement('i');
                icon.classList.add('fas', `fa-${type}`, 'transport-icon');
                icon.dataset.transportType = type;

                if (placeData.transportType === type) {
                    icon.classList.add('selected');
                }

                icon.addEventListener('click', () => {
                    listItem.dataset.transportType = type;
                    transportIcons.forEach(icon => icon.classList.remove('selected'));
                    icon.classList.add('selected');
                });

                return icon;
            });

            const placeActions = document.createElement('div');
            placeActions.classList.add('place-actions');

            const shareButton = document.createElement('button');
            shareButton.classList.add('share-button');
            shareButton.innerHTML = '<i class="fas fa-share"></i> Share';
            shareButton.addEventListener('click', () => {
                const url = window.location.href.split('#')[0];
                const shareUrl = `${url}#trip=${encodeURIComponent(JSON.stringify(listItem.dataset))}`;
                shareLinkInput.value = shareUrl;
                shareModal.style.display = 'block';
            });

            const itineraryButton = document.createElement('button');
            itineraryButton.classList.add('itinerary-button');
            itineraryButton.textContent = 'Itinerary';
            itineraryButton.addEventListener('click', () => {
                currentPlaceItem = listItem;
                itineraryModal.style.display = 'block';
            });

            const viewDetailsButton = document.createElement('button');
            viewDetailsButton.classList.add('view-details');
            viewDetailsButton.textContent = 'Details';
            viewDetailsButton.addEventListener('click', () => {
                detailsContent.innerHTML = `
                    <p><strong>Place:</strong> ${placeData.name}</p>
                    <p><strong>Date:</strong> ${new Date(placeData.date).toDateString()}</p>
                    <p><strong>Entry Price:</strong> $${placeData.entryPrice.toFixed(2)}</p>
                    <p><strong>Transport Price:</strong> $${placeData.transportPrice.toFixed(2)}</p>
                    <p><strong>Transport Type:</strong> ${placeData.transportType || 'Not set'}</p>
                    <p><strong>Description:</strong> ${placeData.description}</p>
                    <p><strong>Itinerary:</strong> ${placeData.itinerary || 'Not set'}</p>
                `;
                detailsModal.style.display = 'block';
            });

            const editButton = document.createElement('button');
            editButton.classList.add('edit-place');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => {
                placeInput.value = placeName.textContent;
                dateInput.value = placeData.date;
                entryPriceInput.value = placeData.entryPrice;
                transportPriceInput.value = placeData.transportPrice;
                descriptionInput.value = placeData.description;
                listItem.remove();
            });

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-place');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                listItem.remove();
            });

            transportIcons.forEach(icon => placeActions.appendChild(icon));
            placeActions.appendChild(shareButton);
            placeActions.appendChild(itineraryButton);
            placeActions.appendChild(viewDetailsButton);
            placeActions.appendChild(editButton);
            placeActions.appendChild(deleteButton);
            listItem.appendChild(placeName);
            listItem.appendChild(placeActions);
            listItem.dataset.entryPrice = placeData.entryPrice;
            listItem.dataset.transportPrice = placeData.transportPrice;
            listItem.dataset.description = placeData.description;
            listItem.dataset.itinerary = placeData.itinerary;
            placesList.appendChild(listItem);
        });
    }

    confirmSaveButton.addEventListener('click', () => {
        const tripName = tripNameInput.value.trim();
        if (tripName) {
            const tripData = {
                destination: destinationInput.value,
                places: []
            };

            const dateContainers = document.querySelectorAll('.date-container');
            dateContainers.forEach(dateContainer => {
                const date = dateContainer.dataset.date;
                const placesList = dateContainer.querySelector('ul');
                const places = placesList.querySelectorAll('li');

                places.forEach(place => {
                    const placeData = {
                        name: place.querySelector('.place-name').textContent,
                        date: date,
                        entryPrice: parseFloat(place.dataset.entryPrice) || 0,
                        transportPrice: parseFloat(place.dataset.transportPrice) || 0,
                        transportType: place.dataset.transportType || 'Not set',
                        description: place.dataset.description || '',
                        itinerary: place.dataset.itinerary || ''
                    };
                    tripData.places.push(placeData);
                });
            });

            localStorage.setItem(tripName, JSON.stringify(tripData));
            alert('Trip saved successfully!');
            saveModal.style.display = 'none';
        } else {
            alert('Please enter a trip name.');
        }
    });

    span.onclick = function() {
        summaryModal.style.display = 'none';
    };

    saveSpan.onclick = function() {
        saveModal.style.display = 'none';
    };

    loadSpan.onclick = function() {
        loadModal.style.display = 'none';
    };

    itinerarySpan.onclick = function() {
        itineraryModal.style.display = 'none';
    };

    detailsSpan.onclick = function() {
        detailsModal.style.display = 'none';
    };

    shareSpan.onclick = function() {
        shareModal.style.display = 'none';
    };

    saveItineraryButton.addEventListener('click', () => {
        if (currentPlaceItem) {
            const station = stationInput.value.trim();
            const line = lineInput.value.trim();
            const direction = directionInput.value.trim();

            if (station !== '' && line !== '' && direction !== '') {
                const itinerary = `Station: ${station}, Line: ${line}, Direction: ${direction}`;
                currentPlaceItem.dataset.itinerary = itinerary;

                itineraryModal.style.display = 'none';
                stationInput.value = '';
                lineInput.value = '';
                directionInput.value = '';
            }
        }
    });

    copyLinkButton.addEventListener('click', () => {
        shareLinkInput.select();
        shareLinkInput.setSelectionRange(0, 99999); /* For mobile devices */
        document.execCommand('copy');
        alert('Link copied to clipboard');
    });

    window.onclick = function(event) {
        if (event.target == summaryModal) {
            summaryModal.style.display = 'none';
        } else if (event.target == saveModal) {
            saveModal.style.display = 'none';
        } else if (event.target == loadModal) {
            loadModal.style.display = 'none';
        } else if (event.target == itineraryModal) {
            itineraryModal.style.display = 'none';
        } else if (event.target == detailsModal) {
            detailsModal.style.display = 'none';
        } else if (event.target == shareModal) {
            shareModal.style.display = 'none';
        }
    };
});

