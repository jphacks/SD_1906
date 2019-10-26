var getPast = (function() {
    var lastDate = NaN;
    return function() {
      var now = Date.now();
      var past = now - lastDate;
      lastDate = now;
      return past;
    };
  })();