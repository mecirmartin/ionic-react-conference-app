export const areaStyle = {
  position: "fixed",
  backgroundColor: "rgba(0, 136, 204, 0.1)",
  zIndex: "2147483647",
  pointerEvents: "none",
};

export const xStyle = {
  position: "fixed",
  borderStyle: "dashed",
  borderColor: "rgb(0, 136, 204)",
  borderWidth: "1px 0",
  zIndex: "2147483647",
  left: "0",
  width: "100vw",
  pointerEvents: "none",
};

export const yStyle = {
  position: "fixed",
  borderStyle: "dashed",
  borderColor: "rgb(0, 136, 204)",
  borderWidth: "0 1px",
  zIndex: "2147483647",
  top: "0",
  height: "100vh",
  pointerEvents: "none",
};

export const getOffset = (element: EventTarget) => {
  const castedElement = element as HTMLElement;
  const styles = getComputedStyle(castedElement);

  const margin = {
    top: Math.max(parseInt(styles.marginTop!), 0),
    right: Math.max(parseInt(styles.marginRight!), 0),
    bottom: Math.max(parseInt(styles.marginBottom!), 0),
    left: Math.max(parseInt(styles.marginLeft!), 0),
  };

  const rect: any = {
    width: castedElement.offsetWidth + margin.right + margin.left,
    height: castedElement.offsetHeight + margin.top + margin.bottom,
    top: castedElement.offsetTop - margin.top,
    left: castedElement.offsetLeft - margin.left,
  };

  let parent: any = castedElement;
  while ((parent = parent.offsetParent)) {
    rect.top += parent.offsetTop;
    rect.left += parent.offsetLeft;
  }

  parent = castedElement;
  while ((parent = parent.parentElement)) {
    rect.top -= parent.scrollTop;
    rect.left -= parent.scrollLeft;
  }

  rect.right = rect.left + rect.width;
  rect.bottom = rect.top + rect.height;

  return rect;
};
