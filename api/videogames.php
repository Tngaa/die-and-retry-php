
  <?php
    include 'config-db.php';

    // Récupérer la connexion au serveur défini précédemment
    global $connection;

    // Vérifier la requête si elle est HTTP GET : fournir (au client) la liste des jeux vidéos
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        
        // Chercher si un utilisateur correspond avec ce login
        $query = "SELECT vg.id, vg.title, vg.releaseDate, pf.name AS 'platformName', pb.name AS 'publisherName', dv.name AS 'developerName' FROM videogames vg LEFT JOIN platform pf ON vg.idPlatform = pf.id LEFT JOIN publishers pb ON vg.idPublisher = pb.id LEFT JOIN developers dv ON vg.idDeveloper = dv.id";
        $result = mysqli_query($connection, $query);
        
        $videogames = array();
        
        while ($row = mysqli_fetch_assoc($result)) {
            $videogames[] = array_map('utf8_encode', $row);
        }
        
        header('Content-Type: application/json');
        
        // Réponse qui devra contenir les jeux vidéos sous format JSON
        echo json_encode($videogames);

        exit;
    }

    // Vérifier la requête si elle est HTTP POST : Créer un jeu vidéo
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {

      // On récupère le jeu video à créer
        $content = file_get_contents("php://input");

        if (isset($content)) {

          // On le convertit en objet php
            $videogame = json_decode($content);

            // On crée le jeu vidéo en BDD
            $query = "INSERT INTO videogames (title, releasedate, idplatform, idpublisher, iddeveloper) VALUES('$videogame->title', '$videogame->releaseDate', $videogame->idPlatform, $videogame->idPublisher, $videogame->idDeveloper)";
            $result = mysqli_query($connection, $query);
  
            // Si ça se passe mal alors on retourne un message d'erreur
            if (!$result) {
                die('Problème lors de la création en BDD');
            }
        
            echo "Création réussie";

            exit;
        }
    }

    // Vérifier la requête si elle est HTTP PUT : Modifier un jeu vidéo
    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {

      // On récupère le jeu video à créer
        $content = file_get_contents("php://input");

        if (isset($content)) {

            // On le convertit en objet php
            $videogame = json_decode($content);

            // On teste si l'id du jeu vidéo est vide
            if (!isset($videogame->id)) {
                echo 'Id du jeu vidéo est vide';
                http_response_code(403);
                exit;
            }

            // On crée le jeu vidéo en BDD
            $query = "UPDATE videogames SET title = '$videogame->title', releasedate = '$videogame->releaseDate', idplatform = $videogame->idPlatform, idpublisher = $videogame->idPublisher, iddeveloper = $videogame->idDeveloper WHERE id = $videogame->id";
            $result = mysqli_query($connection, $query);
  
            // Si ça se passe mal alors on retourne un message d'erreur
            if (!$result) {
                die('Problème lors de la modification en BDD');
            }
        
            echo "Modification réussie";

            exit;
        }
    }

    // Vérifier la requête si elle est HTTP DELETE : supprimer un jeu vidéo
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

      // On récupère l'id du jeux vidéo à supprimer
        $id = file_get_contents("php://input");

        if (isset($id)) {

            // On supprime le jeu vidéo correspondant à l'id
            $query = "DELETE FROM videogames WHERE id = $id";
            $result = mysqli_query($connection, $query);
  
            // Si ça se passe mal alors on retourne un message d'erreur
            if (!$result) {
                die('Problème lors de la suppression en BDD');
            }
        
            echo "Suppression réussie";

            exit;
        }
    }

  ?>