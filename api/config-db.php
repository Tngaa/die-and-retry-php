
<?php

    // Constants utilisés pour se connecter à la BDD
    define('DB_HOST', 'localhost:3306');
    define('DB_NAME', 'videogames');
    define('DB_USER', 'root');
    define('DB_PASSWORD', '');

    // Se connecter au serveur MySql
    $connection = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD) or die("Failed to connect to MySQL: " . mysqli_error());

    // Choisir la BDD videogames
    mysqli_select_db($connection, DB_NAME) or die("Failed to connect to MySQL: " . mysqli_error());
?>
