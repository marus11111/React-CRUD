const showControls = (element) => {
  element.className = element.className.replace(' hide-controls', '');
  void element.offsetWidth;
  element.className += ' show-controls';
}

const hideControls = (element) => {
  element.className = element.className.replace(' show-controls', '');
  void element.offsetWidth;
  element.className += ' hide-controls';
}

const toggleControls = (element) => {
  /show-controls/.test(element.className) ?
    hideControls(element) :
    showControls(element);
}

export {
  showControls,
  hideControls,
  toggleControls
};
