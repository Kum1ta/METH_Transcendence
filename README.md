# **ft_transcendence** - METH PROJECT

<div align="center">
    <h4>A complete web project combining modern technologies and innovative features.</h2>
    <img src="https://github.com/user-attachments/assets/25c2523f-751c-4b55-971f-e238258f4c1a" alt="meth_home">
    <p style="font-size=2px">Home page</p>
    <p>Welcome to METH's GitHub page! Come and try our game on PC, smartphone, and even VR, blending the old with the modern.</p>
</div>


## **Table of Contents**  
1. [Introduction](#introduction)  
2. [Technologies Used](#technologies-used)  
3. [Access](#access)  
4. [Installation](#installation)  
5. [Major & Minor Modules](#major-and-minor-modules)  
6. [Authors](#authors)  

---

## **Introduction**  
**ft_transcendence** is a project developed as part of the 42 school curriculum. It is a complete web application, combining a modern front-end with a robust back-end architecture, enabling users to play Pong for fun, locally, online, or in ranked mode.

---

## **Technologies Used**  
- **Front-end**: HTML, CSS, JS (Vanilla), ThreeJS  
- **Back-end**: Python (Django), WebSockets  
- **Game**: JS, ThreeJS  
- **Database**: PostgreSQL  
- **Authentication**: Account creation via email confirmation and 42 authentication.  
- **Others**: Docker for containerization.  

---

## **Access**  

We are fortunate to have a team member hosting the website on their server.  
You can access the site with all its features at: 

```
meth.tmoron.fr
```

If you encounter any bugs on the site, please contact a team member to resolve them.

---

## **Installation**

### **Prerequisites**  
- Docker & Docker Compose  

### **Installation Steps**  

1. Clone the repository:  
   ```bash  
   git clone https://github.com/Kum1ta/METH_Transcendence.git 
   cd METH_Transcendence 
   ```  

2. Configure environment variables :
   - Create a `.env` file in `docker-compose` folder and fill in the required values :
     
     ```bash
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

3. Launch the project :
   ```bash  
   make
   ``` 

4. Access the application at [https://localhost:8000/](https://localhost:8000/)

---

## **Major and Minor Modules**
- **Use a backend framework**
- **Use a backend database**
- **Standard user management, authentication, and tournament users**
- **Implement remote authentication**
- **Remote multiplayer support**
- **Add a second game with history and matchmaking**
- **Game customization options**
- **Live chat**
- **Implement an AI-controlled opponent**
- **Dashboards and game statistics**
- **GDPR compliance**
- **Advanced 3D techniques**
- **Support for all devices (PC/Phone, VR, Gamepad)**
- **Responsive design**

## **Authors**  

- Mathis, madegryc [https://github.com/Misthaa] - Front-end/Design
- Eddy, edbernar [https://github.com/Kum1ta] - Full Stack
- Tom, tomoron [https://github.com/ARandomPig] - Back-end
- Hugo, hubourge [https://github.com/Bonjoire] - Game
