class TraversableArray extends Array {
  current = -1;
  next() {
    return this.current < this.length - 1
      ? this[++this.current]
      : this[this.current];
  }
  prev() {
    return this.current > 0 ? this[--this.current] : this[this.current];
  }
}

console.log("called !");

const translations = window.api.getTranslations();
const lines = Object.fromEntries(
  Object.entries(translations).map(([chapter, trans]) => [
    chapter,
    new TraversableArray(...trans),
  ])
);

export default lines;
