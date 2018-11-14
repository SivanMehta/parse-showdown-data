const fs = require('fs');

// regexes
const delimiter = /\+-{30,}\+/;
const name = / \| ([A-Za-z])+.+([A-Za-z])+/g;
const sections = [
  'Abilities',
  'Items',
  'Spreads',
  'Moves',
  'Teammates',
  'Checks and Counters',
]

const meta = /Raw count/;

function readLines(lines) {
  const data = {};
  let currentPoke = '';
  let currentSection = '';
  let delimitersInARow = 0;

  lines.forEach(line => {
    if (line.match(delimiter)) { // cut current section
      delimitersInARow ++;
      if(delimitersInARow == 2) {
        currentPoke = '';
        currentSection = '';
        delimitersInARow = 0;
      }
    } else {
      delimitersInARow = 0;
    }

    const section = sections.find(s => line.match(s));
    let inASection = false;
    if (section) {
      currentSection = section;
      inASection = true;
    }

    if (currentPoke === '' && !currentSection) {
      const short = line.match(/ \| ([A-Za-z])+.+([A-Za-z])+/g);
      currentPoke = short ? short[0].substr(3, short[0].length) : '';
      data[currentPoke] = {};
    }

    if(inASection) {
      data[currentPoke][currentSection] = [];
    } else if (currentSection.length > 0 && currentPoke.length > 0 && !inASection) {
      const isData = line.split("|")[1];

      const parsed = isData ? isData.trim() : null;

      if(parsed) {
        data[currentPoke][currentSection].push(parsed);
      }

    }
  });

  console.log(JSON.stringify(data, null, 2));
}

fs.readFile('./raw/gen7ubers-1760.txt', { encoding: 'utf-8' }, (err, data) => {
  readLines(data.split("\n"))
});
