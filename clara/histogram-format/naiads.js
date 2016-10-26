function draw(tObject) {
    if ('h1f' in tObject) require('./naiads_modules/1_d_histogram').oneDimensionalHisto(tObject.h1f);
    if ('h2f' in tObject) require('./naiads_modules/2_d_histogram').twoDimensionalHisto(tObject.h2f);
    if ('p1f' in tObject) require('./naiads_modules/1_d_profile').oneDimensionalProfile(tObject.p1f);
    if ('p2f' in tObject) require('./naiads_modules/2_d_profile').twoDimensionalProfile(tObject.p2f);
}

exports.draw = draw;
