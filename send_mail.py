import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def envoyer_email_icloud(destinataire, sujet, html_message, expediteur, mot_de_passe):
	msg = MIMEMultipart()
	nom_expediteur = 'PTME'
	msg['From'] = f'{nom_expediteur} <ptme@tmoron.fr>'
	msg['To'] = destinataire
	msg['Subject'] = sujet
	msg.attach(MIMEText(html_message, 'html'))
	try:
		serveur = smtplib.SMTP('smtp.mail.me.com', 587)
		serveur.ehlo()
		serveur.starttls()
		serveur.ehlo()
		serveur.login(expediteur, mot_de_passe)
		serveur.sendmail(expediteur, destinataire, msg.as_string())
		serveur.quit()
		print("E-mail envoyé avec succès !")
	except Exception as e:
		print(f"Erreur lors de l'envoi de l'e-mail : {e}")

expediteur = 'tom.moron@icloud.com'
mot_de_passe = 'mot_de_passe'
destinataire = 'eddydhj@gmail.com'
sujet = 'Création de compte'
message = '''
<!DOCTYPE html>
<html lang="fr">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<style>
		body {
			margin: 0;
			padding: 0;
			font-family: Arial, sans-serif;
			background-color: #1e1e1e;
			color: #ffffff;
		}
		.container {
			max-width: 600px;
			margin: 0 auto;
			padding: 20px;
			background-color: #2c2c2c;
			border-radius: 8px;
		}
		h1 {
			text-align: center;
			font-size: 24px;
			margin-bottom: 50px;
			background-color: #1e1e1e;
			padding: 20px;
			border-radius: 8px;
			color: #ffffff;
		}
		p {
			color: #cccccc;
			font-size: 16px;
		}
		.button {
			display: inline-block;
			padding: 10px 20px;
			font-size: 16px;
			color: #ffffff;
			background-color: #0f0f0f;
			border-radius: 5px;
			text-decoration: none;
			margin: 20px;
			margin-left: 25%;
			margin-right: 25%;
			width: 50%;
			text-align: center;
		}
		.footer {
			font-size: 12px;
			background-color: #1e1e1e;
			padding: 10px;
			text-align: center;
			border-radius: 8px;
			margin-top: 20px;
		}
	</style>
</head>
<body>
	<table class="container" role="presentation">
		<tr>
			<td>
				<h1>Bienvenue chez PTME !</h1>
				<p>Bonjour [Nom],</p>
				<p>Merci d'avoir créé un compte avec PTME ! Nous sommes ravis de vous accueillir parmi nous.</p>
				<p>Pour compléter votre inscription, veuillez vérifier votre adresse e-mail en cliquant sur le bouton ci-dessous :</p>
				<p><a href="[Lien de vérification]" class="button">Confirmer mon adresse e-mail</a></p>
				<p>Si vous n'avez pas demandé cette inscription, vous pouvez ignorer cet e-mail.</p>
				<p>Merci,</p>
				<p>L'équipe PTME</p>
				<div class="footer">
					<p>42, 49 Bd Besson Bey, 16000 Angoulême, France</p>
				</div>
			</td>
		</tr>
	</table>
</body>
</html>
'''

envoyer_email_icloud(destinataire, sujet, message, expediteur, mot_de_passe)