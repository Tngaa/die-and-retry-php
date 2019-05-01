
  <?php
    include 'config-db.php';

    // Récupérer la connexion au serveur défini précédemment
    global $connection;

    // Vérifier la requête si elle est HTTP GET : fournir (au client) la liste des développeurs
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        
        // Chercher si un utilisateur correspond avec ce login
        $query = "SELECT * FROM developers";
        $result = mysqli_query($connection, $query);
        
        // Réponse qui devra contenir les développeurs sous format JSON
        $developers = array();
    
        while ($row = mysqli_fetch_assoc($result)) {
            $developers[] = array_map('utf8_encode', $row);
        }
    
        header('Content-Type: application/json');
        
        echo json_encode($developers);

        exit;
    }

  ?>