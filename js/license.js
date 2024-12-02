document.addEventListener('DOMContentLoaded', () => {
    const popup = new bootstrap.Modal(document.getElementById('licensePopup'), {
        backdrop: 'static',  // Запрещает закрытие при клике вне окна
        keyboard: false      // Запрещает закрытие с помощью клавиши Esc
    });
    const agreeButton = document.getElementById('agreeButton');
    const closeButton = document.getElementById('closePopup'); // Кнопка крестика

    // Проверяем, есть ли запись о принятии соглашения в localStorage
    const hasAgreed = localStorage.getItem('agreedToLicense');

    if (!hasAgreed) {
        // Показываем pop-up, если соглашение не было принято
        popup.show();
    }

    // Обработка нажатия кнопки "Я согласен"
    agreeButton.addEventListener('click', () => {
        localStorage.setItem('agreedToLicense', 'true');
    });

    // Запрещаем закрывать pop-up через крестик
    closeButton.addEventListener('click', (e) => {
        e.preventDefault(); // Отменяем действие по умолчанию (закрытие)
    });
});