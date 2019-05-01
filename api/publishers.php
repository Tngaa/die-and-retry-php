
  <?php
    include 'config-db.php';

    // Récupérer la connexion au serveur défini précédemment
    global $connection;

    // Vérifier la requête si elle est HTTP GET : fournir (au client) la liste des éditeurs
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        
        // Chercher si un utilisateur correspond avec ce login
        $query = "SELECT * FROM publishers";
        $result = mysqli_query($connection, $query);
        
        $publishers = array();
        
        while ($row = mysqli_fetch_assoc($result)) {
            $publishers[] = array_map('utf8_encode', $row);
        }
        
        header('Content-Type: application/json');
        
        // Réponse qui devra contenir les éditeurs sous format JSON
        echo json_encode($publishers);

        exit;
    }

  ?>