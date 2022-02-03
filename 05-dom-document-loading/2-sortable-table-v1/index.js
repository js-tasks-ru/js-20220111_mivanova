export default class SortableTable {
  subElements = {};
  static headers = [];
  static fieldValue = '';
  static orderValue = '';
  static row = '';

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.render();
  }

  getColumnHead() {
    SortableTable.headers = [];
    return this.headerConfig
      .map(item => {
        SortableTable.headers.push(item.id);
        if (SortableTable.fieldValue === item.id){
          return `<div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="${SortableTable.orderValue}">
                    <span>${item.title}</span>
                    <span data-element="arrow" class="sortable-table__sort-arrow">
                      <span class="sort-arrow"></span>
                    </span>
                </div>`
        }
        return `<div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}">
                    <span>${item.title}</span>
                </div>`;
      })
      .join('');
  }

  getRows(item) {
    SortableTable.row = '';
    if (Object.keys(item).length) {
      for (const key of SortableTable.headers) {
        if (key === 'images') {
          SortableTable.row += `<div class="sortable-table__cell">
                     <img class="sortable-table-image" alt="Image" src="${item[key][0].url}">
                  </div>`
        } else {
          SortableTable.row += `<div class="sortable-table__cell">${item[key]}</div>`
        }
      }
      return SortableTable.row;
    }
  }

  getColumnBody() {
    if (this.data.length) {
      return this.data
        .map(item => {
          return `<a href="" class="sortable-table__row">
                    ${this.getRows(item)}
                 </a>
                `
        })
        .join('');
    }
  }

  get template() {
    return this.data.length > 0 ? `
        <div class="sortable-table">
            <div data-element="header" class="sortable-table__header sortable-table__row">
              ${this.getColumnHead()}
            </div>

            <div data-element="body" class="sortable-table__body">
                ${this.getColumnBody()}
            </div>

        </div>
        <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
    ` : `<div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
          <div>
            <p>No products satisfies your filter criteria</p>
            <button type="button" class="button-primary-outline">Reset all filters</button>
          </div>
        </div>`;
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.template;

    this.element = element.firstElementChild;

    if (this.data.length) {
      this.element.classList.remove('loading-line');
    }

    this.subElements = this.getSubElements();
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }

  sort(fieldValue, orderValue) {
    const locales = ['ru'];
    const options = { caseFirst: 'upper' };
    SortableTable.fieldValue = '';
    SortableTable.orderValue = '';

    if (fieldValue === 'title') {
      this.data = this.data.sort((a, b) =>
        orderValue === 'asc' ?
          a[fieldValue].localeCompare(b[fieldValue], locales, options) :
          b[fieldValue].localeCompare(a[fieldValue], locales, options)
      );
    } else {
      this.data = this.data.sort((a, b) =>
        orderValue === 'asc' ?
          a[fieldValue] - b[fieldValue] :
          b[fieldValue] - a[fieldValue]
      );
    }
    SortableTable.fieldValue = fieldValue;
    SortableTable.orderValue = orderValue;

    this.update(this.data);
  }

  update(data) {
    this.data = data;

    this.subElements.body.innerHTML = this.getColumnBody(data);
    this.subElements.header.innerHTML = this.getColumnHead();
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }

}

