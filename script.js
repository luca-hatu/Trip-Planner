document.addEventListener('DOMContentLoaded', () => {
    const destinationInput = document.getElementById('destination');
    const placeInput = document.getElementById('place');
    const addPlaceButton = document.getElementById('add-place');
    const placesList = document.getElementById('places-list');

    addPlaceButton.addEventListener('click', () => {
        const place = placeInput.value.trim();
        if (place !== '') {
            const listItem = document.createElement('li');
            listItem.textContent = place;
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
