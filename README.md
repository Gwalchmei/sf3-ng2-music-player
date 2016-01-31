# sf3-ng2-music-player

The main goal of this project is to discover both Symfony3 and Angular 2.
The two apps are currently in the same project for dev purpose but will be separated in a near future (with a back in Silex instead of Symfony3).
The purpose is to fetch and listen to songs stored in the server.

### Version
1.0

### Tech

* [Angular 2] - in TypeScript
* [Symfony3]

### Installation

For the Symfony3 part (in root folder) :
```
$ composer install
```
The app has one user stored in memory (security.yml) password is bcrypt encoded and stored in app/parameters.yml under the gwalchmei_password key.
To generate password :
```
$ php bin/console security:encode-password
```

For the Angular2 part (in web/ folder) :
Install the dependencies :
```
$ npm install
```
Compile the TypeScript (let it run during dev) :
```
$ npm start
```

The songs are stored in web/music/ folder (no database access)

### Todos

 - Write Tests
 - Add Code Comments
 - Styling
 - Separate Apps
 - Silex back
 - Add song on server ?
 - Database storage ?
 - Enhance Security

License
----

MIT

**Free Software, Hell Yeah!**

   [Angular 2]: <https://angular.io/>
   [Symfony3]: <http://symfony.com/>


