# WORDLE
 ## INSTALACION Y EJECUCIÓN DEL PROYECTO
 `` npm install``
`` npm run dev``
 ## CREAR BD CON LA FUNCIÓN DE POSTGRES
 * Ir a el archivo  `` /config/postgres/postgres-sequelize`` y comentar la linea y descomentar la linea 28 (``//await connection.sync();``)
 * luego de eso ejecutar el programa `` npm run dev`` y se creara la base de datos
 * volver a comentar esta linea ya que tiene DROP IF EXISTS
 * tomar en cuenta antes que se debe crear la bd en postgres con el nombre de ``wordle``
## API's
* Adjunto archivo postman ``Wordle.postman_collection.json`` para probar las apis
## TEST UNITARIOS
* Para ejecutar los test unitarios ejecutar el comando ``npm run test``

 
