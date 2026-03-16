# Tournoi Multisport Loches

Application web complète pour la gestion d'un tournoi multisport convivial à Loches, France.

## 🏆 Fonctionnalités

### 📱 Interface Publique
- **Page d'accueil attractive** avec présentation du concept
- **Système de gestion des sports** avec configuration flexible
- **Inscription des équipes** avec génération automatique de QR codes
- **Recrutement des bénévoles** avec gestion des missions
- **Planning des matchs** avec filtrage par sport/terrain
- **Classement en direct** avec mode écran géant
- **Page partenaires** avec gestion des niveaux de partenariat
- **Design responsive** et mobile-first

### 🛠️ Dashboard Administrateur
- **Gestion des sports** (ajout/suppression, configuration)
- **Gestion des équipes** (consultation, QR codes, modification)
- **Gestion des bénévoles** (assignation des missions)
- **Gestion des matchs** (programmation, modification)
- **Saisie des scores** en temps réel
- **Scanner QR codes** pour enregistrement des arrivées
- **Export des données** au format JSON
- **Statistiques en temps réel**

## 🚀 Démarrage Rapide

1. **Clonez ou téléchargez** les fichiers du projet
2. **Ouvrez `index.html`** dans votre navigateur web
3. **Accédez au dashboard admin** via `admin.html`

## 📁 Structure du Projet

```
Event Sport/
├── index.html          # Page principale du site
├── admin.html          # Dashboard administrateur
├── styles.css          # Styles complets avec design moderne
├── app.js              # Logique principale de l'application
├── admin.js            # Fonctionnalités admin spécifiques
└── README.md           # Documentation du projet
```

## 🎯 Sports Inclus par Défaut

1. **Football petit terrain** (5v5, 16 équipes max, 4 poules)
2. **Basket 3v3** (3v3, 12 équipes max, 3 poules)
3. **Rugby flag** (6v6, 8 équipes max, 2 poules)
4. **Padel** (2v2, 16 équipes max, 4 poules)
5. **Spikeball** (2v2, 8 équipes max, 2 poules)
6. **Lancer de vortex** (1v1, 20 équipes max, 4 poules)

## 💡 Utilisation

### Pour les Participants
1. **Inscrivez votre équipe** via le formulaire d'inscription
2. **Recevez un QR code unique** par email
3. **Présentez votre QR code** à l'accueil le jour J
4. **Suivez les scores** en temps réel sur le site

### Pour les Organisateurs
1. **Configurez les sports** selon vos besoins
2. **Générez le tournoi** automatiquement
3. **Assignez les bénévoles** aux différentes missions
4. **Saisissez les scores** pendant les matchs
5. **Utilisez le mode écran géant** pour l'affichage public

### Pour les Bénévoles
1. **Inscrivez-vous** via le formulaire dédié
2. **Indiquez vos disponibilités** et missions préférées
3. **Recevez votre assignation** par les organisateurs

## 🔧 Configuration

### Paramètres Personnalisables
- **Nom du tournoi**
- **Date et lieu**
- **Contacts organisateurs**
- **Sports et leurs règles**
- **Nombre d'équipes maximum**
- **Taille des équipes**
- **Nombre de poules**

### Personnalisation Design
- **Couleurs** définies dans les variables CSS
- **Polices** via Google Fonts (Poppins)
- **Icônes** via Font Awesome
- **Responsive design** adaptatif

## 📊 Gestion des Données

### Stockage Local
- **LocalStorage** pour la persistance des données
- **Export JSON** pour sauvegarder les informations
- **Import possible** pour restaurer les données

### Types de Données
- **Sports** (configuration)
- **Équipes** (inscriptions, QR codes)
- **Bénévoles** (missions, disponibilités)
- **Matchs** (programmation, scores)
- **Classements** (calculs automatiques)
- **Partenaires** (informations, niveaux)

## 🎨 Caractéristiques Techniques

### Frontend
- **HTML5** sémantique et accessible
- **CSS3** moderne avec animations
- **JavaScript ES6+** pour la logique
- **Responsive design** mobile-first
- **Animations CSS** pour l'expérience utilisateur

### Bibliothèques Externes
- **Font Awesome 6.4.0** pour les icônes
- **QRCode.js** pour la génération de QR codes
- **HTML5-QRCode** pour le scan QR codes
- **Google Fonts** pour les typographies

### Fonctionnalités Avancées
- **Gestion d'état** avec JavaScript
- **Modales** pour les formulaires
- **Filtrage** et recherche en temps réel
- **Calculs automatiques** des classements
- **Mode plein écran** pour l'affichage

## 🌐 Navigation

### Pages Principales
- **Accueil** - Présentation du tournoi
- **Le Tournoi** - Concept et infrastructures
- **Sports** - Liste et gestion des disciplines
- **Inscriptions** - Formulaire pour les équipes
- **Bénévoles** - Recrutement et missions
- **Planning** - Emploi du temps des matchs
- **Live** - Scores et classements en direct
- **Partenaires** - Sponsors et soutiens
- **Contact** - Informations et formulaire

### Dashboard Admin
- **Dashboard** - Statistiques et actions rapides
- **Sports** - Gestion des disciplines
- **Équipes** - Consultation et modification
- **Bénévoles** - Assignation des missions
- **Matchs** - Programmation et scores
- **Scan QR** - Enregistrement des arrivées
- **Partenaires** - Gestion des sponsors
- **Paramètres** - Configuration générale

## 🔒 Sécurité

### Mesures Implémentées
- **Validation des formulaires** côté client
- **Sanitization** des entrées utilisateur
- **Pas de données sensibles** stockées localement
- **Mode hors ligne** complet possible

### Recommandations
- **HTTPS** pour la production
- **Validation serveur** pour les formulaires critiques
- **Sauvegardes régulières** des données
- **Accès sécurisé** au dashboard admin

## 📱 Compatibilité

### Navigateurs Supportés
- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

### Appareils
- **Desktop** (Windows, Mac, Linux)
- **Tablettes** (iPad, Android)
- **Smartphones** (iOS, Android)

## 🚀 Évolutions Possibles

### Fonctionnalités Futures
- **Notifications push** pour les participants
- **Chat intégré** entre équipes
- **Photos et vidéos** des matchs
- **Statistiques avancées** et historiques
- **Multi-tournois** sur la même plateforme
- **API REST** pour intégrations externes

### Améliorations Techniques
- **PWA** pour installation mobile
- **Base de données** côté serveur
- **Authentification** sécurisée
- **Paiement en ligne** pour les inscriptions
- **Streaming** des matchs en direct

## 📞 Support

### Pour les Organisateurs
- **Documentation complète** dans ce README
- **Code commenté** pour faciliter la maintenance
- **Structure modulaire** pour les évolutions

### Pour les Participants
- **Interface intuitive** et guide d'utilisation
- **FAQ** intégrée au site
- **Contact organisateur** pour les questions

## 📜 Licence

Ce projet est open source et peut être librement utilisé et modifié pour des événements similaires.

---

**Développé avec ❤️ pour le Tournoi Multisport de Loches**
