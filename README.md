
`<app-dexie>` A database wrapper for ARC
It contains access to old database structure. New Database is different and this element should be
used to move the data from old structure to the new one.

This element listen for the `old-database-request` event. This event will return a `database`
property in the `detail` object containing a promise that will resolve with handler to the Dexie
or reject during the error.

### Example
```
<app-dexie></app-dexie>
```

