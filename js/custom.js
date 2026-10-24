document.addEventListener('DOMContentLoaded', function () {

    /* ========================================================================
       1. СКРИПТ ПОШУКУ ТЕКСТУ ТА ФІЛЬТРАЦІЇ НА СТОРІНЦІ ПОСЛУГ
       ======================================================================== */
    const searchInput = document.getElementById('serviceSearchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const serviceCards = document.querySelectorAll('.service-card');
    const resultCountText = document.getElementById('searchResultCount');
    const noResultsMessage = document.getElementById('noResultsMessage');

    function filterServices() {
        if (!searchInput || !categoryFilter) return;

        const query = searchInput.value.toLowerCase().trim();
        const selectedCategory = categoryFilter.value;
        let visibleCount = 0;

        serviceCards.forEach(function (card) {
            const cardCategory = card.getAttribute('data-category');
            const cardText = card.textContent.toLowerCase();

            const matchesQuery = cardText.includes(query);
            const matchesCategory = (selectedCategory === 'all') || (cardCategory === selectedCategory);

            if (matchesQuery && matchesCategory) {
                card.classList.remove('service-card--hidden');
                visibleCount++;
            } else {
                card.classList.add('service-card--hidden');
            }
        });

        if (resultCountText) {
            resultCountText.textContent = 'Знайдено послуг: ' + visibleCount;
        }

        if (noResultsMessage) {
            if (visibleCount === 0) {
                noResultsMessage.classList.remove('search-box__empty--hidden');
            } else {
                noResultsMessage.classList.add('search-box__empty--hidden');
            }
        }
    }

    if (searchInput && categoryFilter) {
        searchInput.addEventListener('input', filterServices);
        categoryFilter.addEventListener('change', filterServices);
    }

    /* ========================================================================
       2. РОЗГОРТАННЯ ПОВНОГО ОПИСУ ПОСЛУГИ (Кнопка "Більше")
       ======================================================================== */
    const toggleButtons = document.querySelectorAll('.js-toggle-more');

    toggleButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const body = btn.closest('.service-card__body');
            const moreBlock = body.querySelector('.service-card__more');

            if (moreBlock) {
                const isHidden = moreBlock.classList.contains('service-card__more--hidden');
                if (isHidden) {
                    moreBlock.classList.remove('service-card__more--hidden');
                    btn.textContent = 'Згорнути';
                } else {
                    moreBlock.classList.add('service-card__more--hidden');
                    btn.textContent = 'Більше';
                }
            }
        });
    });

    /* ========================================================================
       3. ВАЛІДАЦІЯ ДАНИХ ФОРМИ ЗАМОВЛЕННЯ (HTML + JS RegExp)
       ======================================================================== */
    const orderForm = document.getElementById('repairOrderForm');

    if (orderForm) {
        const nameInput = document.getElementById('clientName');
        const phoneInput = document.getElementById('clientPhone');
        const emailInput = document.getElementById('clientEmail');
        const deviceSelect = document.getElementById('deviceType');
        const issueTextarea = document.getElementById('issueDescription');
        const consentCheckbox = document.getElementById('termsConsent');
        const successBox = document.getElementById('formSuccessBox');

        function setFieldState(inputElement, errorId, isValid, baseClass) {
            const errorElement = document.getElementById(errorId);
            if (!isValid) {
                inputElement.classList.add(baseClass + '--error');
                inputElement.classList.remove(baseClass + '--valid');
                if (errorElement) errorElement.classList.add('order-form__error--visible');
            } else {
                inputElement.classList.remove(baseClass + '--error');
                inputElement.classList.add(baseClass + '--valid');
                if (errorElement) errorElement.classList.remove('order-form__error--visible');
            }
        }

        orderForm.addEventListener('submit', function (event) {
            event.preventDefault();

            // Регулярні вирази для перевірки полів
            const nameRegex = /^[А-ЯІЇЄҐа-яіїєґA-Za-z\s'-]{3,50}$/;
            const phoneRegex = /^\+380\d{9}$/;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            const isNameValid = nameRegex.test(nameInput.value.trim());
            const isPhoneValid = phoneRegex.test(phoneInput.value.trim());
            const isEmailValid = emailRegex.test(emailInput.value.trim());
            const isDeviceValid = deviceSelect.value !== '';
            const isIssueValid = issueTextarea.value.trim().length >= 10;
            const isConsentValid = consentCheckbox.checked;

            // Візуальне відображення результатів валідації
            setFieldState(nameInput, 'nameError', isNameValid, 'order-form__input');
            setFieldState(phoneInput, 'phoneError', isPhoneValid, 'order-form__input');
            setFieldState(emailInput, 'emailError', isEmailValid, 'order-form__input');
            setFieldState(deviceSelect, 'deviceError', isDeviceValid, 'order-form__select');
            setFieldState(issueTextarea, 'issueError', isIssueValid, 'order-form__textarea');

            const consentError = document.getElementById('consentError');
            if (!isConsentValid) {
                consentError.classList.add('order-form__error--visible');
            } else {
                consentError.classList.remove('order-form__error--visible');
            }

            // Якщо всі поля валідні — показуємо повідомлення про успіх і очищуємо форму
            if (isNameValid && isPhoneValid && isEmailValid && isDeviceValid && isIssueValid && isConsentValid) {
                successBox.classList.remove('order-form__success--hidden');
                orderForm.reset();

                // Прибираємо зелені рамки після очищення
                const allInputs = orderForm.querySelectorAll('input, select, textarea');
                allInputs.forEach(function (el) {
                    el.classList.remove('order-form__input--valid', 'order-form__select--valid', 'order-form__textarea--valid');
                });
            } else {
                successBox.classList.add('order-form__success--hidden');
            }
        });
    }

});