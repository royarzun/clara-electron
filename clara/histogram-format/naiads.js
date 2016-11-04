function draw(tObject) {
  for (var i = 0; i < tObject.length; i++) {
        if (tObject[i]) {
          var object = JSON.parse(String(tObject[i]));
          if ('h1f' in object) require('./naiads_modules/1_d_histogram').oneDimensionalHisto(object.h1f);
          if ('h2f' in object) require('./naiads_modules/2_d_histogram').twoDimensionalHisto(object.h2f);
          if ('p1f' in object) require('./naiads_modules/1_d_profile').oneDimensionalProfile(object.p1f);
          if ('p2f' in object) require('./naiads_modules/2_d_profile').twoDimensionalProfile(object.p2f);
    }
  }
}

exports.draw = draw;
exports.dataObjects = ['h1f', 'h2f', 'p1f', 'p2f'];
exports.dataType = "binary/array-string";
