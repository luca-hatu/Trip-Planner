document.addEventListener('DOMContentLoaded', () => {
    const destinationInput = document.getElementById('destination');
    const placeInput = document.getElementById('place');
    const addPlaceButton = document.getElementById('add-place');
    const placesList = document.getElementById('places-list');

    addPlaceButton.addEventListener('click', () => {
        const place = placeInput.value.trim();
        if (place !== '') {
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
                    // Remove 'selected' class from all buttons
                    const allButtons = transportButtons.querySelectorAll('button');
                    allButtons.forEach(btn => btn.classList.remove('selected'));

                    // Add 'selected' class to the clicked button
                    button.classList.add('selected');

                    // Optionally, you can show an alert or update some other state
                    // alert(`You chose ${transport.mode} for ${place}`);
                });
                transportButtons.appendChild(button);
            });

            listItem.appendChild(placeName);
            listItem.appendChild(transportButtons);
            placesList.appendChild(listItem);

            placeInput.value = '';
            placeInput.focus();
        }
    });

    placeInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addPlaceButton.click();
        }
    });
});
