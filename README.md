# **ft_transcendence** - METH PROJECT

**Un projet web complet combinant les technologies modernes et des fonctionnalités innovantes.**  

## **Table des matières**  
1. [Introduction](#introduction)  
2. [Technologies utilisées](#technologies-utilisées)
3. [Accès](#accès)
4. [Installation](#installation)  
5. [Module majeur & mineur](#module-majeur-&-mineur)
6. [Autheurs](#autheurs)

---

## **Introduction**  
**ft_transcendence** est un projet réalisé dans le cadre du cursus de l'École 42. Il s'agit d'une application web complète, combinant un front-end moderne avec une architecture back-end robuste, permettant aux utilisateurs de jouer a Pong, pour le plaisir, en local, en ligne, en ranked.


---

## **Technologies utilisées**  
- **Front-end** : HTML, CSS, JS (Vanilla), ThreeJS
- **Back-end** : Python (Django), WebSockets
- **Jeu** : JS, ThreeJS
- **Base de données** : PostgreSQL  
- **Authentification** : Création de compte par mail et confirmation et authentification par 42.
- **Autres** : Docker pour la containerisation. 

---

## **Accès**

Nous avons la chance qu'un des membres de notre équipe puisse héberger le site sur son serveur.
Vous pouvez donc accéder à notre site avec toutes les fonctionnalités depuis :

```
meth.tmoron.fr
```

Si vous avez le moindre bug sur le site, veillez contacter un membre de l'équipe pour la corriger.

---

## **Installation**  

### **Prérequis**  
- Docker & Docker Compose  
- PostgreSQL  

### **Étapes d'installation**  

1. Clonez le dépôt :  
   ```bash  
   git clone https://github.com/METH_Transcendence/ft_transcendence.git  
   cd ft_transcendence  
   ```  

2. Installez les dépendances :  
   ```bash  
   npm install  
   ```  

3. Configurez les variables d'environnement :  
   - Créez un fichier `.env` à la racine et renseignez les valeurs nécessaires :  
     ```
     DB_NAME=""
     DB_USERNAME=""
     DB_PASSWORD=""
     DB_HOST=""
      
     UID_42=""
     SECRET_42=""
      
     ICLOUD_USER=""
     ICLOUD_PASS=""
     SERVER_URL="https://localhost:8000"
     ```  

4. Lancez le projet :  
   ```bash  
   make
   ```  

5. Accédez à l'application sur [http://localhost:3000](http://localhost:3000).  

---

## **Module majeur & mineur**  
- **Utiliser un framework backend**
- **Utiliser une base de données backend**  
- **Gestion utilisateur standard, authentification, utilisateurs en tournois**  
- **Implementer une authentification à distance**  
- **Joueur à distance**  
- **Ajout d'un second jeu avec historique et matchmaking**  
- **Option de personnalisation du jeu**  
- **Live chat**  
- **Implementer un adversaire contole par IA**  
- **Panneaux d'affichage (Dashboard), statistiques des parties**
- **RGPD friendly**  
- **Utilisation de technique avancées 3D**  
- **Supoort sur tous types d'appareils (PC/Telephone, VR, Manette)**  
- **Responsive**  

## **Autheurs**  

- Mathis, madegryc [https://github.com/Misthaa] - Front-end/Design
- Eddy, edbernar [https://github.com/Kum1ta] - Full Stack
- Tom, tomoron [https://github.com/ARandomPig] - Back-end
- Hugo, hubourge [https://github.com/Bonjoire] - Game
