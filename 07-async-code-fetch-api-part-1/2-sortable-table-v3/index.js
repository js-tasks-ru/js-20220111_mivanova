import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  element;
  subElements = {};
  loading = false;
  data = [];
  start = 0;
  step = 30;
  end = this.start + this.step;

  onSortClick = event => {
    const column = event.target.closest('[data-sortable="true"]');

    const toggleOrder = order => {
      const orders = {
        asc: 'desc',
        desc: 'asc'
      };

      return orders[order];
    };

    if (column) {
      const { id, order } = column.dataset;
      const newOrder = toggleOrder(order);

      this.sorted = {
        id,
        order: newOrder
      };

      const arrow = column.querySelector('.sortable-table__sort-arrow');

      column.dataset.order = newOrder;

      if (!arrow) {
        column.append(this.subElements.arrow);
      }

      if (this.isSortLocally) {
        this.sortOnClient(id, newOrder);
      } else {
        this.sortOnServer(id, newOrder);
      }
    }
  };

  onScroll = async () => {
    const { id, order } = this.sorted;

    const height = document.body.offsetHeight;
    const screenHeight = window.innerHeight;

    const scrolled = window.scrollY;
    const threshold = height - screenHeight / 4;
    const position = scrolled + screenHeight;

    if (position >= threshold && !this.loading && !this.localScroll) {
      this.start = this.end;
      this.end = this.start + this.step;

      this.loading = true;

      const data = await this.fetchData(id, order, this.start, this.end);
      this.update(data);
      this.loading = false;
    }
  }

  constructor(header, {
    url = 'api/rest/products',
    sorted = {
      id: header.find(item => item.sortable).id,
      order: 'asc'
    },
    isSortLocally = false,
    step = 30,
    start = 1,
    end = start + step
  } = {}) {
    this.header = header;
    this.url = url;
    this.sorted = sorted;
    this.isSortLocally = isSortLocally;
    this.step = step;
    this.start = start;
    this.end = end;

    this.render();
  }

  async render() {
    const {id, order} = this.sorted;
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getTable(this.data);

    const element = wrapper.firstElementChild;

    this.element = element;
    this.subElements = this.getSubElements(element);

    const data = await this.fetchData(id, order, this.start, this.end);

    this.renderRows(data);

    this.initEventListeners();
  }

  initEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.onSortClick);
    window.addEventListener("scroll", this.onScroll);
  }

  async fetchData (id, order, start = this.start, end = this.end) {
    const url = new URL(`${BACKEND_URL}/${this.url}`);
    url.searchParams.set('_start', this.start);
    url.searchParams.set('_end', this.end);
    url.searchParams.set('_sort', id);
    url.searchParams.set('_order', order);

    this.element.classList.add('sortable-table_loading');

    const response = await fetchJson(url);

    this.element.classList.add('sortable-table_loading');

    return response;
  }

  sortOnClient (id, order) {
    const locales = ['ru'];
    const sortData = [...this.data];

    if (id === 'title') {
      sortData.sort((a, b) =>
        order === 'asc' ?
          a[id].localeCompare(b[id], locales) :
          b[id].localeCompare(a[id], locales)
      );
    } else {
      sortData.sort((a, b) =>
        order === 'asc' ?
          a[id] - b[id] :
          b[id] - a[id]
      );
    }

    return sortData;
  }

  async sortOnServer (id, order) {
    const start = 1;
    const end = start + this.step;

    const data = await this.fetchData(id, order, start, end);

    this.renderRows(data);
  }

  renderRows(data) {
    if (data.length) {
      this.element.classList.remove('sortable-table_empty');
      this.addRows(data);
    } else {
      this.element.classList.add('sortable-table_empty');
    }
  }

  addRows(data) {
    this.data = data;

    this.subElements.body.innerHTML = this.getTableRows(data);
  }

  getColumnHead() {
    return this.header.map(item => {
      const order = this.sorted.id === item.id ? this.sorted.order : 'asc';
      const isOrderExist = this.sorted.id === item.id ? this.sorted.order : '';
      if (isOrderExist) {
        return `<div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="${order}">
                    <span>${item.title}</span>
                    <span data-element="arrow" class="sortable-table__sort-arrow">
                       <span class="sort-arrow"></span>
                    </span>
                </div>`;
      }
      return `<div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="${order}">
                   <span>${item.title}</span>
              </div>`;
    }).join('');
  }

  getBody(data) {
    return `
      <div data-element="body" class="sortable-table__body">
        ${this.getTableRows(data)}
      </div>`;
  }

  getTableRows (data) {
    if (data.length) {
      return data.map(item => `
      <div class="sortable-table__row">
        ${this.getTableRow(item)}
      </div>`
      ).join('');
    }
  }

  getTableRow (item) {
    const cells = this.header.map(({id, template}) => {
      return {
        id,
        template
      };
    });
    return cells.map(({id, template}) => {
      return template
        ? template(item[id])
        : `<div class="sortable-table__cell">${item[id]}</div>`;
    }).join('');
  }

  getTable(data) {
    return `
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
              ${this.getColumnHead()}
        </div>
        ${this.getBody(data)}
      </div>`;
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }

  update(data) {
    const rows = document.createElement('div');

    this.data = [...this.data, ...data];

    rows.innerHTML = this.getTableRows(data);

    this.subElements.body.append(...rows.childNodes);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}
