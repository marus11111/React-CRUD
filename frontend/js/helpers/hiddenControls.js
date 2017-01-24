//shows and hides controls to remove image and remove/edit posts from list level

const showControls = (element) => {
  element.className = element.className.replace(/\s{1}hide-controls/g, '');
  void element.offsetWidth;
  element.className += ' show-controls';
}

const hideControls = (element) => {
  element.className = element.className.replace(/\s{1}show-controls/g, '');
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
