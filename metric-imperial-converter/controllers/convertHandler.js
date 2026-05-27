function ConvertHandler() {
  
  this.getNum = function(input) {
    // Locate the first alphabetical character to split number from unit
    const firstAlphaIdx = input.search(/[a-zA-Z]/);
    if (firstAlphaIdx === 0) return 1; // Default to 1 if no number is supplied
    
    const numStr = input.slice(0, firstAlphaIdx);
    
    // Check for double fractions (e.g., 3/2/3)
    if ((numStr.match(/\//g) || []).length > 1) return 'invalid number';
    
    // Evaluate fractions or decimals safely
    try {
      if (numStr.includes('/')) {
        const parts = numStr.split('/');
        return parseFloat(parts[0]) / parseFloat(parts[1]);
      }
      return parseFloat(numStr);
    } catch (e) {
      return 'invalid number';
    }
  };
  
  this.getUnit = function(input) {
    const firstAlphaIdx = input.search(/[a-zA-Z]/);
    const unit = input.slice(firstAlphaIdx).toLowerCase();
    
    const validUnits = ['gal', 'l', 'lbs', 'kg', 'mi', 'km'];
    if (!validUnits.includes(unit)) return 'invalid unit';
    
    // Normalize 'l' to capital 'L' to pass specific FCC string assertions
    return unit === 'l' ? 'L' : unit;
  };
  
  this.getReturnUnit = function(initUnit) {
    const unitMap = {
      'gal': 'L',
      'L': 'gal',
      'lbs': 'kg',
      'kg': 'lbs',
      'mi': 'km',
      'km': 'mi'
    };
    return unitMap[initUnit];
  };

  this.spellOutUnit = function(unit) {
    const spellMap = {
      'gal': 'gallons',
      'L': 'liters',
      'lbs': 'pounds',
      'kg': 'kilograms',
      'mi': 'miles',
      'km': 'kilometers'
    };
    return spellMap[unit];
  };
  
  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    let result;
    
    switch (initUnit) {
      case 'gal': result = initNum * galToL; break;
      case 'L':   result = initNum / galToL; break;
      case 'lbs': result = initNum * lbsToKg; break;
      case 'kg':  result = initNum / lbsToKg; break;
      case 'mi':  result = initNum * miToKm; break;
      case 'km':  result = initNum / miToKm; break;
      default: return null;
    }
    
    return parseFloat(result.toFixed(5)); // Round precisely to 5 decimal places
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    return `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`;
  };
}

module.exports = ConvertHandler;
