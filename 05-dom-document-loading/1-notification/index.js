export default class NotificationMessage {
  static subElements = null;

  constructor(
    notification = '',
    {
      duration = 2000,
      type = 'success'
    } = {}) {
    this.notification = notification;
    this.duration = duration;
    this.type = type;

    this.render();
  }

  get template() {
    return `
      <div class="notification ${this.type}" style="--value:20s">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">
            ${this.notification}
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.template;

    this.element = element.firstElementChild;

  }

  show(targetElement = document.body) {
    if (NotificationMessage.subElements) {
      NotificationMessage.subElements.remove();
    }
    NotificationMessage.subElements = this.element;
    targetElement.append(this.element);
    setTimeout(() => this.destroy(), this.duration);
  }

  remove () {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
  }

}
