(function() {
  'use strict';

  /**
   * This script initialized old type of database in ARC.
   * It is required to initialize old database in order to use old stored data and migrate it to
   * new structure.
   */

  class OldAppDexie {
    constructor() {
      this.db = undefined;
    }
    init() {
      return new Dexie.Promise((resolve, reject) => {
        var db = this._getDb();
        this._mapsObjects(db);
        this._addHooks(db);

        db.open()
        .then(() => {
          this.db = db;
          resolve(db);
        })
        .catch((error) => {
          console.error('IDB open main catch block', error);
          reject(error);
        });
      });
    }

    /**
     * Returns a handler to the database object.
     */
    _getDb(opts) {
      opts = opts || {};
      var db = new Dexie('arc');
      db.version(1)
        .stores({
          headers: '&[key+type],key,type',
          statuses: '&key',
          historyUrls: '&url',
          historySockets: '&url',
          requestObject: '++id,url,method,[url+method],type,_name',
          serverExportObjects: '[serverId+requestId],serverId,requestId',
          projectObjects: '++id,*requestIds'
        });
      db.version(2)
        .stores({
          headers: '&[key+type],key,type',
          statuses: '&key',
          historyUrls: '&url',
          historySockets: '&url',
          requestObject: '++id,url,method,[url+method],type,_name',
          serverExportObjects: '[serverId+requestId],serverId,requestId',
          projectObjects: '++id,*requestIds',
          variables: '++id,variable,type'
        });
      db.version(3)
        .stores({
          headers: '&[key+type],key,type',
          statuses: '&key',
          historyUrls: '&url',
          historySockets: '&url',
          requestObject: '++id,url,method,[url+method],type,_name',
          serverExportObjects: '[serverId+requestId],serverId,requestId',
          projectObjects: '++id,*requestIds',
          variables: '++id,variable,type',
          basicAuth: '&url'
        });
      db.version(4)
        .stores({
          headers: '&[key+type],key,type',
          statuses: '&key',
          historyUrls: '&url',
          historySockets: '&url',
          requestObject: '++id,url,method,[url+method],type,_name',
          serverExportObjects: '[serverId+requestId],serverId,requestId',
          projectObjects: '++id,*requestIds',
          variables: '++id,variable,type',
          basicAuth: '&url',
          logs: '&time,type'
        });
      db.version(5)
        .stores({
          headers: '&[key+type],key,type',
          statuses: '&key',
          historyUrls: '&url',
          historySockets: '&url',
          requestObject: '++id,url,method,[url+method],type,_name',
          serverExportObjects: '[serverId+requestId],serverId,requestId',
          projectObjects: '++id,*requestIds',
          variables: '++id,variable,type',
          basicAuth: '&url',
          logs: '&time,type',
          cookies: '&uuid,domain,path,name,[domain+path]'
        });
      db.version(6)
        .stores({
          headers: '&[key+type],key,type',
          statuses: '&key',
          historyUrls: '&url',
          historySockets: '&url',
          requestObject: '++id,url,method,[url+method],type,_name',
          serverExportObjects: '[serverId+requestId],serverId,requestId',
          projectObjects: '++id,*requestIds',
          variables: '++id,variable,type',
          basicAuth: '&url',
          logs: '&time,type',
          cookies: '&uuid,_domain,name'
        });
      db.version(7)
        .stores({
          headers: '&[key+type],key,type',
          statuses: '&key',
          historyUrls: '&url',
          historySockets: '&url',
          requestObject: '++id,url,method,[url+method],type,_name',
          serverExportObjects: '[serverId+requestId],serverId,requestId',
          projectObjects: '++id,*requestIds',
          variables: '++id,variable,type',
          basicAuth: '&url,type',
          logs: '&time,type',
          cookies: '&uuid,_domain,name'
        }).upgrade(function(tx) {
          tx.basicAuth.toCollection().modify(function(item) {
            item.type = 'basic';
          });
        });
      return db;
    }

    _mapsObjects(db) {
      // From `app-types`
      db.projectObjects.mapToClass(ProjectObject);
      db.serverExportObjects.mapToClass(ServerExportedObject);
      db.requestObject.mapToClass(RequestObject);
      db.historySockets.mapToClass(HistorySocketObject);
      db.historyUrls.mapToClass(HistoryUrlObject);
      db.statuses.mapToClass(HttpStatusObject);
      db.headers.mapToClass(HttpHeaderObject);
      db.variables.mapToClass(MagicVariableObject);
      db.basicAuth.mapToClass(AuthData);
      db.logs.mapToClass(LogObject);
      db.cookies.mapToClass(Cookie);
    }

    _addHooks(db) {
      var createUpdateTime = (primKey, obj) => {
        obj.updateTime = Date.now();
      };
      var updateUpdateTime = (/*modifications, primKey, obj*/) => {
        return {
          updateTime: Date.now()
        };
      };
      var createDbUuid = () => {
        return this.$.uuid.generate();
      };

      db.projectObjects.hook('creating', createUpdateTime);
      db.projectObjects.hook('updating', updateUpdateTime);

      db.requestObject.hook('creating', createUpdateTime);
      db.requestObject.hook('updating', updateUpdateTime);

      db.variables.hook('creating', createUpdateTime);
      db.variables.hook('updating', updateUpdateTime);

      db.cookies.hook('creating', createDbUuid);
    }
  }
  window.OldAppDexie = OldAppDexie;
})();
