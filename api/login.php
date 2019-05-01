
    <?php
        include 'config-db.php';
        
        
        // On récupère les paramètres d'authentification et on vérifie si ils ne sont pas vides
        if (isset($_POST['username']) && isset($_POST['password'])) {
            $username = $_POST['username'];
            $password = $_POST['password'];

            // Vérifier le login en base de données
            if (checkLogin($username, $password)) {
                echo 'Bienvenue ' . $username;
            } else {
                echo 'Identifiant ou mot de passe incorrect';
                http_response_code(403);
            }
            
            // else {
            //     throw new Exception('Identifiant ou mot de passe incorrect', 400);
            // }
        } else {
            echo 'Identifiant ou mot de passe manquant';
            http_response_code(400);
        }

        /**
         * Vérifier l'authentification de l'utilisateur
         */
        function checkLogin($username, $password)
        {
            // Récupérer la connexion au serveur défini précédemment
            global $connection;

            // https://md5decrypt.net pour encrypter un mot de passe et le mettre en BDD
            // admin == 21232f297a57a5a743894a0e4a801fc3
            $md5password = md5($password);

            // Chercher si un utilisateur correspond avec ce login
            $query = "SELECT username FROM users WHERE username = '$username' AND password = '$md5password'";
            $result = mysqli_query($connection, $query);
        
            // Si il n'y aucune lignée retournée alors il s'agit d'une erreur liée au login
            if (!$result || mysqli_num_rows($result) <= 0) {
                return false;
            } else {
                return true;
            }
        }
    ?>
