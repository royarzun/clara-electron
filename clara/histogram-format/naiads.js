
function draw(dataObject) {
  if (dataObject.h1f) require('./naiads_modules/1_d_histogram').oneDimensionalHisto(dataObject.h1f);
  if (dataObject.h2f) require('./naiads_modules/2_d_histogram').twoDimensionalHisto(dataObject.h2f);
  if (dataObject.p1f) require('./naiads_modules/1_d_profile').oneDimensionalProfile(dataObject.p1f);
  if (dataObject.p2f) require('./naiads_modules/2_d_profile').twoDimensionalProfile(dataObject.p2f);
}

exports.draw = draw;
