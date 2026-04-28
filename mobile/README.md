# Configuration de l'API

Ajouter la ligne suivante à la fin du fichier `local.properties` :
```properties
API_URL=http://10.0.2.2:3000/api
```

> **Note :** `10.0.2.2` est l'adresse IP spéciale pour accéder à `localhost` depuis un émulateur Android.  
> Sur un **appareil physique**, remplacez `10.0.2.2` par l'adresse IP locale de votre machine (ex: `192.168.x.x`) où l'API est hébergée.