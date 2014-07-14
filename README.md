Caffeine Free Semver
===

## Anti-Features

- No pre-release or build version parsing whatsoever.
- Ranges are limited to simple combinations of version and wildcard. E.g. `'1.x'` or `'v1'` will work, but `'^1.0.0'` will not.


## API

```
semverLite.valid(version);
```

Returns true if the version is valid semver.

```
semverLite.maxSatisfying(versions, range);
```

Returns the greatest version that satisfies the range.

## Ranges

Nothing fancy, a range should look like an abbreviated version.

Valid ranges include:

```
var validRanges = ['1.1.x', 'v1', '=1', '1.x', '1', 'x'];
```

Something like `'1.x.3'` does not work, that would be silly.
