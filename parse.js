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
  let currentlyMeta = false;

  lines.forEach(line => {
    if (line.match(delimiter)) { // cut current section
      currentPoke = '';
      currentSection = '';
    }

    const section = sections.find(s => line.match(s));
    if (section) {
      currentSection = section;
    }

    if (currentPoke === '' && !currentSection) {
      const short = line.match(/ \| ([A-Za-z])+.+([A-Za-z])+/g);
      currentPoke = short ? short[0].substr(3, short[0].length) : '';
    }

    console.log(line, currentSection, currentPoke);
  })

}

fs.readFile('./data.txt', { encoding: 'utf-8' }, (err, data) => {
  readLines(data.split("\n"))
});
