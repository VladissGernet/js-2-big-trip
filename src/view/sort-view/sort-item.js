// Используем String.raw как тег для шаблонных строк,
// чтобы Prettier и редактор форматировали HTML внутри template literals корректно
const html = String.raw;

export default function createSortItemTemplate({
  name,
  isChecked,
  isDisabled,
}) {
  const lowerStr = name.toLowerCase();
  return html`
    <div class="trip-sort__item  trip-sort__item--${lowerStr}">
      <input
        id="sort-${lowerStr}"
        class="trip-sort__input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="sort-${lowerStr}"
        ${isDisabled && 'disabled'}
        ${isChecked && 'checked'}
      />
      <label class="trip-sort__btn" for="sort-${lowerStr}">${name}</label>
    </div>
  `;
}
