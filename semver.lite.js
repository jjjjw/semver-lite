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
  if ((index = rangeOrVersion.indexOf('-') > -1) || (index = rangeOrVersion.indexOf('+') > -1)) {
    rangeOrVersion = rangeOrVersion.slice(index);
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

function toVersion(parts) {
  return parts && parts.join('.');
}

// In leiu of supporting them, I will abide a loose check for pre-release and build versions.
function valid (version) {
  return /v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(\+|-)/.test(version);
}

exports.valid = valid;

// TODO(jj): supporting pre-release versions would be nice, but is not necessary.
function satisfies (versionParts, rangeParts) {
  for (var i = versionParts.length - 1; i >= 0; i--) {
    // All * or x have been stripped away
    if (isNaN(rangeParts[i])) {
      continue;
    }
    // Silly because we are comparing strings, as we can in JS
    if (versionParts[i] > rangeParts[i]) {
      return false;
    }
  }
  return true;
}

function maxSatisfying (versions, range) {
  range = toParts(range);
  return toVersion(reduce(versions, function(max, curr) {
    curr = toParts(curr);
    if (satisfies(curr, range) ) {
      if (max && satisfies(curr, max)) {
        return max;
      }
      return curr;
    }
    return max;
  }, null));
}

exports.maxSatisfying = maxSatisfying;
