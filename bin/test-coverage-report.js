var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('./coverage/coverage.json', 'utf8'));

var statementsTotal = 0;
var statementsCovered = 0;
Object.keys(obj).forEach(function(s) {
  Object.keys(obj[s].s).forEach(function(key) {
    statementsTotal++;
    if(obj[s].s[key] === 1 ) {
      statementsCovered++;
    }
  });
});

console.log('Statements: ', statementsTotal);
console.log('Statements Covered', statementsCovered);

if(statementsCovered/statementsTotal !== 1) {
  console.log('build failed');
}

