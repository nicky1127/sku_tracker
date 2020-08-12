var fs = require('fs');

const stockLevelCalculator = sku => {
  if (!sku) return Promise.reject(new TypeError('Please provide sku.'));
  let transactions;
  let stocks;
  try {
    const jsonString = fs.readFileSync('./transactions.json');
    transactions = JSON.parse(jsonString);
  } catch (err) {
    console.log(err);
    return Promise.reject(new Error('Can not parse the json file.'));
  }

  try {
    const jsonString = fs.readFileSync('./stock.json');
    stocks = JSON.parse(jsonString);
  } catch (err) {
    console.log(err);
    return Promise.reject(new Error('Can not parse the json file.'));
  }
  skuObj = stocks.find(stock => stock.sku === sku);
  tsnArr = transactions.filter(tsn => tsn.sku === sku);
  if (!skuObj && tsnArr.length === 0) return Promise.reject(new Error('SKU does not exist.'));

  initQty = skuObj ? skuObj.stock : 0;
  let qty = initQty;
  tsnArr.forEach(tsn => {
    if (tsn.type === 'order') qty += tsn.qty;
    else qty -= tsn.qty;
  });

  return Promise.resolve({ sku, qty });

};

// 'JKF995902/28/73'
stockLevelCalculator('JKF995902/28/73')
  .then(res => console.log('res', res))
  .catch(err => console.log('err', err));
