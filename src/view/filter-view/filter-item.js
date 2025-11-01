// Используем String.raw как тег для шаблонных строк,
// чтобы Prettier и редактор форматировали HTML внутри template literals корректно
const html = String.raw;

export default function createFilterItemTemplate(value) {
  const lowerStr = value.toLowerCase();
  return html`
    <div class="trip-filters__filter">
      <input
        id="filter-${lowerStr}"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="${lowerStr}"
      />
      <label class="trip-filters__filter-label" for="filter-${lowerStr}"
        >${value}</label
      >
    </div>
  `;
}
