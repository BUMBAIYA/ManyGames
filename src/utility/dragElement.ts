export function dragElement(
  draggableElement: HTMLElement,
  grabElement?: HTMLElement,
) {
  if (draggableElement === null) {
    console.error("Ref to draggable element is null");
    return;
  }
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (grabElement) {
    grabElement.onmousedown = dragMouseDown;
    grabElement.ontouchstart = dragTouchStart;
  } else {
    draggableElement.onmousedown = dragMouseDown;
    draggableElement.ontouchstart = dragTouchStart;
  }

  function dragMouseDown(e: MouseEvent) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    draggableElement.style.cursor = "grabbing";
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function dragTouchStart(e: TouchEvent) {
    e.preventDefault();
    console.log("Touched");
    const touch = e.changedTouches[0];
    pos3 = touch.clientX;
    pos4 = touch.clientY;
    draggableElement.style.cursor = "grabbing";
    document.ontouchend = closeDragElement;
    document.ontouchmove = elementDrag;
  }

  function elementDrag(e: MouseEvent | TouchEvent) {
    e = e || window.event;
    e.preventDefault();
    const isTouchEvent = e.type.startsWith("touch");
    const event = isTouchEvent
      ? (e as TouchEvent).changedTouches[0]
      : (e as MouseEvent);
    pos1 = pos3 - event.clientX;
    pos2 = pos4 - event.clientY;
    pos3 = event.clientX;
    pos4 = event.clientY;
    const boundingBox = draggableElement.getBoundingClientRect();
    draggableElement.style.cursor = "grabbing";
    var finalY = draggableElement.offsetTop - pos2;
    var finalX = draggableElement.offsetLeft - pos1;
    if (finalY < 1) {
      finalY = 0;
    }
    if (finalX < 1) {
      finalX = 0;
    }
    if (boundingBox.right > window.innerWidth) {
      finalX = window.innerWidth - draggableElement.offsetWidth - 1;
    }
    if (boundingBox.bottom > window.innerHeight) {
      finalY = window.innerHeight - draggableElement.offsetHeight - 1;
    }
    draggableElement.style.top = finalY + "px";
    draggableElement.style.left = finalX + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
    document.ontouchend = null;
    document.ontouchmove = null;
    draggableElement.style.cursor = "grab";
  }
}
