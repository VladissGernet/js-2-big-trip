/**
 * Теговая функция для шаблонных строк HTML.
 * Использует `String.raw` для корректного форматирования HTML в редакторах (Prettier, VS Code).
 * Предотвращает интерполяцию escape-последовательностей (\\n → \n вместо новой строки).
 *
 * @example
 * ```
 * const item = 'Point';
 * html`<li>${item}</li>` // → "<li>Point</li>"
 * ```
 *
 * @param {TemplateStringsArray} strings - Массив строк шаблона
 * @param {...any[]} values - Значения для интерполяции
 * @returns {string} HTML-разметка без escape-последовательностей
 */
export const html = String.raw;
