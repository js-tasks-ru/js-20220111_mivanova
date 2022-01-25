export default class ColumnChart {
  constructor(columnsData) {
    this.chartHeight = 50;
    if (columnsData) {
      this.formatHeading = columnsData.formatHeading;
      this.data = columnsData.data;
      this.label = columnsData.label;
      this.value = this.formatHeading ? this.formatHeading(columnsData.value) : columnsData.value;
      this.link = columnsData.link;
      this.render();
    } else {
      this.renderWithoutData();
    }
  }

  getColumnProps (data = this.data) {
    if (data) {
      const maxValue = Math.max(...data);
      const scale = 50 / maxValue;

      return data.map(item => `<div style="--value: ${String(Math.floor(item * scale))}" data-tooltip="${(item / maxValue * 100).toFixed(0) + '%'}"></div>`);
    }
  }

  getTemplate () {
    return `
      <div class="dashboard__chart_${this.label}">
      <div class="column-chart" style="--chart-height: 50">
        <div class="column-chart__title">
          Total ${this.label}
          <a href="${this.link}" class="column-chart__link">View all</a>
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">${this.value}</div>
          <div data-element="body" class="column-chart__chart">
            ${this.getColumnProps(this.data)?.join('')}
          </div>
        </div>
      </div>
    `
  }

  getEmptyTemplate () {
    return `
      <div class="column-chart column-chart_loading" style="--chart-height: 50">
        <div class="column-chart__title">
          Total ${this.label}
          <a class="column-chart__link" href="${this.link}">View all</a>
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header"></div>
          <div data-element="body" class="column-chart__chart"></div>
        </div>
      </div>
    `
  }

  renderWithoutData() {
    const element = document.createElement('div');
    element.innerHTML = this.getEmptyTemplate();
    this.element = element.firstElementChild;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
  }

  update (newData = this.data) {
    return this.getColumnProps(newData);
  }

  remove () {
    this.element?.remove();
  }

  destroy() {
    this.remove();
  }
}

