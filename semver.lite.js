function reduce(arr, fn, initVal) {
  var i = -1
  var len = arr.length;
  var result = initVal;

  while (++i < len) {
    result = fn(result, arr[i]);
  }
  return result;
}

function toParts(rangeOrVersion) {
  // Throw away pre-release and build info
  var index;
  if (((index = rangeOrVersion.indexOf('-')) > -1) || ((index = rangeOrVersion.indexOf('+')) > -1)) {
    rangeOrVersion = rangeOrVersion.slice(0, index);
  }
  var parts = rangeOrVersion.split('.');
  // Strip all funny business. We are not parsing carets or tildes atm.
  var i = -1
  var len = parts.length;
  var map = [];
  var part;

  while (++i < len) {
    part = parts[i].replace(/\D/, '');
    if (!part) {
      break;
    }
    map.push(part);
  }
  return map;
}

// In leiu of supporting them, I will abide a loose check for pre-release and build versions.
function valid (version) {
  return /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)([\+|-].*)?$/.test(version);
}

exports.valid = valid;

function validRange (range) {
  return /^.?\d+/.test(range);
}

exports.validRange = validRange;

// TODO(jj): supporting pre-release versions would be nice, but is not necessary.
function satisfies (versionParts, rangeParts) {
  for (var i = 0, len = versionParts.length; i < len; i++) {
    // All * or x have been stripped away
    if (isNaN(rangeParts[i])) {
      return true;
    }
    if (parseInt(versionParts[i], 10) > parseInt(rangeParts[i], 10)) {
      return false;
    }
  }
  return true;
}

function maxSatisfying (versions, range) {
  if (!validRange(range)) {
    return null;
  }
  var rangeParts = toParts(range);
  return reduce(versions, function(max, curr) {
    var currParts = toParts(curr);
    if (satisfies(currParts, rangeParts) ) {
      if (!max) {
        return curr;
      } else if (!satisfies(currParts, toParts(max))) {
        return curr;
      }
    }
    return max;
  }, null);
}

exports.maxSatisfying = maxSatisfying;
