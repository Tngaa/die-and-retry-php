// Composant principal incluant les componsants login et videogames
var mainVue = new Vue({

    // Id du body
    el: "#main",

    // Variables utilisées dans le composant
    data: {

        // Identifiant lors de la connexion
        username: '',

        // Mot de passe lors de la connexion
        password: '',

        // Message de succès affiché à l'utilisateur
        successMessage: '',

        // Message d'erreur affiché à l'utilisateur
        errorMessage: '',

        // Qui permet de savoir si l'utilisateur est actuellement connecté
        isConnected: false,

        // Titre de la boîte de dialogue de confirmation
        confirmModalTitle: '',

        // Question de la boîte de dialoguee de confirmation
        confirmModalQuestion: '',

        // Jeux vidéos qui sont affichés à l'écran
        videogames: [],

        // Mise en cache des jeux vidéos pour l'utilisation dans le filtrage
        videogamesCache: [],

        // Plateformes qui sont affichées à l'écran sous forme de dropdown list
        platforms: [],

        // Éditeurs qui sont affichés à l'écran de dropdown list
        publishers: [],

        // Développeurs qui sont affichés à l'écran de dropdown list
        developers: [],

        // Valeur du filtre pour les jeux vidéos
        filteringValue: '',

        // Titre de la boîte de dialogue de création ou de modification d'un jeu vidéo
        videogameTitle: '',

        // Variable utilisée pour créer ou mettre à jour un jeu vidéo
        videogameToCreateOrUpdate: {},
    },

    /**
     * Fonction qui s'exécute toute seule après que le composant soit créé
     */
    created: function () {

        // Ceci permet de s'en passer de la page de login lorsque la page est rafraîchie
        // Si l'utilisateur est déjà connecté alors on affiche directement les jeux vidéos
        var isConnected = localStorage.getItem('isConnected');
        if (isConnected == 'true') {
            this.isConnected = true;
            this.getDatas();
        }
    },

    // Fonctions utilisées dans le composant
    methods: {

        /**
         * Afficher le message d'echec pendant 2s
         */
        showErrorMessage: function (message) {
            this.errorMessage = message;
            setTimeout(() => {
                this.errorMessage = '';
            }, 2000)
        },

        /**
         * Afficher le message de succès pendant 2s
         */
        showSuccessMessage: function (message) {
            this.successMessage = message;
            setTimeout(() => {
                this.successMessage = '';
            }, 2000)
        },

        /**
         * Vérifier si le bouton de connexion est cliquable en fonction de saisie de l'identifiant et le mot de passe
         */
        isConnectable: function () {
            return this.username.length == 0 || this.password.length == 0;
        },

        /**
         * Se connecter à l'application
         */
        connect: function () {
            var form = new FormData();
            form.append('username', this.username);
            form.append('password', this.password);

            // Appel en POST pour se connecter
            axios
                .post('api/login.php', form)

                // Quand l'authentification est réussie
                .then(function (response) {

                    mainVue.showSuccessMessage(response.data);

                    // Marquer l'utilisateur comme connecté
                    mainVue.isConnected = true;
                    localStorage.setItem('isConnected', true);

                    // Récupérer aussitôt toutes les données
                    mainVue.getDatas();
                })

                // Quand l'authentification n'est pas réussie
                .catch(function (error) {
                    mainVue.showErrorMessage(error.response.data);
                    mainVue.isConnected = false;
                });
        },

        /**
         * Se déconnecter de l'application
         */
        disconnect: function () {

            // Affichage de la boîte de dialogue de confirmation
            this.confirmModalTitle = 'Déconnexion';
            this.confirmModalQuestion = 'Voulez-vous vous déconnecter de l\'application';

            // Ouvrir la boîte de dialogue
            $('#confirmation').modal('show');

            // Si l'utilisateur confirme alors il se déconnecte
            $("#confirmation-yes").on("click", function () {
                $("#confirmation").modal('hide');

                // Il suffit juste de vider tout le localstorage lié à l'utilisateur
                localStorage.clear();
                mainVue.isConnected = false;
            });
        },

        /**
         * Filtrer les jeux vidéos sur chaque saisie d'un caractère par l'utilisateur
         */
        onChangeFilter: function () {

            // Si la valeur du filtre est vide alors on affecte les copies orinaux des jeux vidéos à la variable affichée
            // Sinon on applique le filtre sur chaque champ des jeux vidéos
            if (this.filteringValue.length == 0) {
                this.videogames = this.videogamesCache;
            } else {
                this.videogames = this.videogamesCache.filter(videogame => {

                    // On crée ici une table qui contient les champs sur lesquels on applique le filtre
                    var filteredProperties = [videogame.title, videogame.releaseDate, videogame.platformName, videogame.publisherName, videogame.developerName];

                    // .some() -> Si au moins un des champs respecte la condition alors cette fonction retourne vrai. Sinon faux
                    return filteredProperties.some(value => {
                        if (value == null) {
                            return false;
                        } else {
                            return value.toLowerCase().includes(this.filteringValue.toLowerCase());
                        }
                    });
                });
            }
        },

        /**
         * Récuperer toutes les données necéssaires
         */
        getDatas: function () {
            this.getPlatforms();
            this.getPublishers();
            this.getDevelopers();
            this.getVideogames();
        },

        /**
         * Récuperer la liste des jeux vidéos
         */
        getVideogames: function () {

            // Appel en GET
            axios.get('api/videogames.php').then(function (response) {
                mainVue.videogamesCache = response.data;
                mainVue.videogames = response.data;
                mainVue.onChangeFilter();
            });
        },

        /**
         * Récuperer la liste des plateformes
         */
        getPlatforms: function () {

            // Appel en GET
            axios.get('api/platforms.php').then(function (response) {
                mainVue.platforms = response.data;
            });
        },

        /**
         * Récuperer la liste des éditeurs
         */
        getPublishers: function () {

            // Appel en GET
            axios.get('api/publishers.php').then(function (response) {
                mainVue.publishers = response.data;
            });
        },

        /**
         * Récuperer la liste des développeurs
         */
        getDevelopers: function () {

            // Appel en GET
            axios.get('api/developers.php').then(function (response) {
                mainVue.developers = response.data;
            });
        },

        /**
         * Ouvrir la boîte de dialogue de la création d'un jeu vidéo
         */
        onCreateVideogame: function () {
            this.videogameToCreateOrUpdate = {};
            this.videogameTitle = 'Création d\'un jeu vidéo';

            // Ouvrir la boîte de dialogue
            $('#create-videogame').modal('show');
        },

        /**
         * Ouvrir la boîte de dialogue de la création d'un jeu vidéo
         */
        onModifyVideogame: function (videogame) {
            this.videogameToCreateOrUpdate.id = videogame.id;
            this.videogameToCreateOrUpdate.title = videogame.title;
            this.videogameToCreateOrUpdate.releaseDate = videogame.releaseDate;
            this.videogameToCreateOrUpdate.idPlatform = this.platforms.find(platform => platform.name == videogame.platformName).id;
            this.videogameToCreateOrUpdate.idPublisher = this.publishers.find(publisher => publisher.name == videogame.publisherName).id;
            this.videogameToCreateOrUpdate.idDeveloper = this.developers.find(developer => developer.name == videogame.developerName).id;
            this.videogameTitle = 'Modification du jeu vidéo : ' + videogame.title;

            // Ouvrir la boîte de dialogue
            $('#create-videogame').modal('show');
        },

        /**
         * Créer ou modifier un jeu vidéo
         */
        saveVideogame: function () {


            // Si id est rempli alors il s'agit d'une modification 
            // Sinon il s'agit d'une création
            if (this.videogameToCreateOrUpdate.id) {


                // Appel en PUT pour modifier
                axios
                    .put('api/videogames.php', this.videogameToCreateOrUpdate)

                    // Quand l'authentification est réussie
                    .then(function (response) {

                        mainVue.showSuccessMessage(response.data);

                        // Récupérer aussitôt toutes les données
                        mainVue.getVideogames();
                    })

                    // Quand l'authentification n'est pas réussie
                    .catch(function (error) {
                        mainVue.showErrorMessage(error.response.data);
                    });
            } else {
                // Appel en POST pour créer
                axios
                    .post('api/videogames.php', this.videogameToCreateOrUpdate)

                    // Quand l'authentification est réussie
                    .then(function (response) {

                        mainVue.showSuccessMessage(response.data);

                        // Récupérer aussitôt toutes les données
                        mainVue.getVideogames();
                    })

                    // Quand l'authentification n'est pas réussie
                    .catch(function (error) {
                        mainVue.showErrorMessage(error.response.data);
                    });
            }

        },

        /**
         * Confirmer la suppression d'un jeu vidéo
         */
        onDeleteVideogame: function (videogame) {

            // Affichage de la boîte de dialogue de confirmation
            this.confirmModalTitle = 'Suppresion';
            this.confirmModalQuestion = 'Confirmez-vous la suppression du jeu ' + videogame.title + ' ?';

            // Ouvrir la boîte de dialogue
            $('#confirmation').modal('show');

            // Si l'utilisateur confirme alors supprimer le jeu vidéo
            $("#confirmation-yes").on("click", function () {
                $("#confirmation").modal('hide');
                mainVue.deleteVideogame(videogame);
            });
        },

        /**
         * Supprimer le jeu vidéo en base de données
         */
        deleteVideogame: function (videogame) {

            // Appel en DELETE
            axios.delete('api/videogames.php', {
                    'data': videogame.id
                })

                // En cas de succès, on rafraîchit la liste des jeux vidéos
                .then(function (response) {
                    mainVue.showSuccessMessage(response.data);
                    mainVue.getVideogames();
                })

                // En cas d'echec, on affiche le message d'erreur
                .catch(function (error) {
                    mainVue.showErrorMessage(error.response.data);
                });
        }
    }
})