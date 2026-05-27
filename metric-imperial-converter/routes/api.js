const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  let convertHandler = new ConvertHandler();

  app.route('/api/convert').get((req, res) => {
    const input = req.query.input;
    if (!input) return res.send('invalid unit');

    const initNum = convertHandler.getNum(input);
    const initUnit = convertHandler.getUnit(input);
    
    // Validate edge-case inputs where numbers/units are flagged invalid
    if (initNum === 'invalid number' && initUnit === 'invalid unit') {
      return res.send('invalid number and unit');
    }
    if (initNum === 'invalid number' || isNaN(initNum)) {
      return res.send('invalid number');
    }
    if (initUnit === 'invalid unit') {
      return res.send('invalid unit');
    }
    
    const returnNum = convertHandler.convert(initNum, initUnit);
    const returnUnit = convertHandler.getReturnUnit(initUnit);
    const toString = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);
    
    res.json({
      initNum,
      initUnit,
      returnNum,
      returnUnit,
      string: toString
    });
  });
};
