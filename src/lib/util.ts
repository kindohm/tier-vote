export function randInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

export const randItem = (arr: any[]) => {
  return arr[randInt(0, arr.length - 1)];
};
