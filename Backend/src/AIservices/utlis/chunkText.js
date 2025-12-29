function chunkText(text, chunkSize = 10000) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    chunks.push(text.slice(start, start + chunkSize));
    start += chunkSize;
  }
  console.log("chunktext",chunks.length);
  return chunks;
}

module.exports = chunkText;
