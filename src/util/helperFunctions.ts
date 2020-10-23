export const changeFrameBorderStyle = (color: string): void => {
  const frame = document.getElementById("buttonContainer");
  if (frame == null) return;
  frame.style.border = color;
};

export const getLineNumbers = (
  className: string
): { start: number; end: number } => {
  const eChar = className.indexOf("E");
  const endOfClassName = className.indexOf(" ");

  // -1 because array is zero indexed
  const start = parseInt(className.slice(1, eChar)) - 1;
  const end = parseInt(className.slice(eChar + 1, endOfClassName)) - 1;

  return { start, end };
};
