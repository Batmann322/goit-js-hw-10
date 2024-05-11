import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const datetimePicker = flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    if (selectedDate < new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topCenter',
      });
      document.querySelector('[data-start]').disabled = true;
    } else {
      document.querySelector('[data-start]').disabled = false;
    }
  },
});

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

document.querySelector('[data-start]').addEventListener('click', () => {
  datetimePicker.destroy();

  const selectedDate = datetimePicker.selectedDates[0];

  document.querySelector('[data-start]').disabled = true;
  document.querySelector('#datetime-picker').disabled = true;

  const timerInterval = setInterval(() => {
    const difference = selectedDate - new Date();

    if (difference <= 0) {
      clearInterval(timerInterval);
      updateTimerUI({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      iziToast.success({
        title: 'Success',
        message: 'Countdown timer has ended!',
      });

      document.querySelector('[data-start]').disabled = false;
      document.querySelector('#datetime-picker').disabled = false;
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(difference);

    updateTimerUI({ days, hours, minutes, seconds });
  }, 1000);
});

function updateTimerUI({ days, hours, minutes, seconds }) {
  document.querySelector('[data-days]').textContent = addLeadingZero(days);
  document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
  document.querySelector('[data-minutes]').textContent =
    addLeadingZero(minutes);
  document.querySelector('[data-seconds]').textContent =
    addLeadingZero(seconds);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  return { days, hours, minutes, seconds };
}
