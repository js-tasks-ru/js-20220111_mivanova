import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  subElements = {};
  chartHeight = 50;
  data = [];
  totalValue = 0;

  constructor({
    label = '',
    link = '',
    url = '',
    range = {
      from: new Date('2020-04-06'),
      to: new Date('2020-05-06')
    },
    formatHeading = data => data
  } = {}) {
    this.url = url;
    this.range = range;
    this.label = label;
    this.link = link;
    this.formatHeading = formatHeading;
    this.render();
  }

  async getChartsData (from, to) {
    let url = new URL(`${BACKEND_URL}/${this.url}`);
    url.searchParams.set('from', from);
    url.searchParams.set('to', to);

    let response = await fetchJson(url);
    this.data = Object.values(response);

    return response;
  }

  get template() {
    return `
      <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          Total ${this.label}
          ${this.getLink()}
        </div>
        <div class="column-chart__container">
           <div data-element="header" class="column-chart__header">
             ${this.totalValue}
           </div>
          <div data-element="body" class="column-chart__chart">
            ${this.getColumnBody()}
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.template;

    this.element = element.firstElementChild;

    if (this.data.length) {
      this.element.classList.remove('column-chart_loading');
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

  getHeaderValue() {
    return `<div data-element="header" className="column-chart__header">
      ${this.formatHeading(this.totalValue)}
    </div>`;
  }

  getColumnBody() {
    const maxValue = Math.max(...this.data);
    const scale = this.chartHeight / maxValue;

    return this.data
      .map(item => {
        const percent = (item / maxValue * 100).toFixed(0);

        return `<div style="--value: ${Math.floor(item * scale)}" data-tooltip="${percent}%"></div>`;
      })
      .join('');
  }

  getLink() {
    return this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '';
  }

  update(from, to) {
    this.range.from = from;
    this.range.to = to;

    return this.getChartsData(from, to).then((response) => {
      this.totalValue = this.data.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0);
      this.subElements.body.innerHTML = this.getColumnBody();
      this.subElements.header.innerHTML = this.getHeaderValue();
      if (this.data.length) {
        this.element.classList.remove('column-chart_loading');
      }
      return response;
    });
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

