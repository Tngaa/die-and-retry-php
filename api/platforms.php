
  <?php
    include 'config-db.php';

    // Récupérer la connexion au serveur défini précédemment
    global $connection;

    // Vérifier la requête si elle est HTTP GET : fournir (au client) la liste des plateformes
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        
        // Chercher si un utilisateur correspond avec ce login
        $query = "SELECT * FROM platform";
        $result = mysqli_query($connection, $query);
        
        $platforms = array();
    
        while ($row = mysqli_fetch_assoc($result)) {
            $platforms[] = array_map('utf8_encode', $row);
        }
    
        header('Content-Type: application/json');
        
        // Réponse qui devra contenir les plateformes sous format JSON
        echo json_encode($platforms);

        exit;
    }

  ?>