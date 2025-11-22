



document.addEventListener('DOMContentLoaded', function() {
    const selectedValue = document.getElementById('selected-value');
    const radioInputs = document.querySelectorAll('#options input[type="radio"]'); 
    const toggleCheckbox = document.getElementById('options-view-button');
    const defaultText = "Selecione o gênero";
    let currentSelectedRadio = null;
    selectedValue.textContent = defaultText;

    radioInputs.forEach(r => r.checked = false);
    radioInputs.forEach(radio => {
        radio.addEventListener('click', function(event) {
            if (this === currentSelectedRadio) {
                this.checked = false;
                currentSelectedRadio = null;
                selectedValue.textContent = defaultText;
            } else {
                if (currentSelectedRadio) currentSelectedRadio.checked = false;
                this.checked = true;
                currentSelectedRadio = this;
                selectedValue.textContent = this.dataset.label;
            }
            if (toggleCheckbox) {
                setTimeout(() => toggleCheckbox.checked = false, 50);
            }
        });
    });
});