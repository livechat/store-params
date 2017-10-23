# store-params
store-params is lightweight, vanilla javascript library for storing URL params in cookies, localStorage or sessionStorage

## Getting Started
`npm install store-params --save` or download and insert `store-params.min.js`

```html
<script src="store-params.min.js"></script>
<script>
  var storage = new StoreParams();
</script>
```
```html
<script>
  // Also can pass in optional settings block
  var storage = new StoreParams({
    storage: 'cookies',
    cookieDuration: 14,
    cookieDomain: 'www.example.com',
    storeUTMs: true,
    storeReferrer: true,
    include: [
      {
        param: 'a',
        storage: 'varA'
      },
      {
        param: 'b',
        storage: 'varB'
      }
    ],
    exclude: [
      'utm_source'
    ]
  });
</script>
```
## Use Cases

### Capturing UTM params
By default library will store all UTM params (utm_medium, utm_campaign, utm_term, utm_content). This can be disabled by setting `storeUTMs` option to `false`. 

### Capturing Referrer URL
Also by default library will store referrer URL as `referrer`. It can be disabled by setting `storeReferrer` option to `false`

### Capturing custom URL params
You can store any URL param with this library. Just add list of URL to include option.

```html
<script>
  // Storing a, b and c params
  var storage = new StoreParams({
    include: [
      {
        param: 'a'
      },
      {
        param: 'b'
      },
      {
        param: 'c'
      }
    ]
  });
</script>
```

## Configuration options

**storage**
Type of storage
```
default: 'cookies'
options: 'cookies', 'localStorage', 'sessionStorage'
```

**cookieDuration**
Cookie duration in days for cookie storage
```
default: 14
options: integer
```

**cookieDomain**
Cookie domain for cookie storage
```
default: location.hostname without www.
options: string
```

**storeUTMs**
Store UTM params
```
default: true
options: boolean (true / false)
```

**storeReferrer**
Store referrer URL
```
default: true
options: boolean (true / false)
```

**include**
List of custom URL params to be stored.
```
default: ''
options: array of objects with param and storage (optional) keys. 

Example:
[
  {
    param: 'a',
    storage: 'varA'
  }
]
```

**exclude**
Excluded URL params
```
default: ''
options: array of URL params. 

Example:
['utm_source', 'utm_medium']
```