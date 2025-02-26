export const validateMail = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Verify Your Email</h1>
    </div>
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
        <p>Hello,</p>
        <p>Thank you for signing up! Your verification code is:</p>
        <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4CAF50;">{verificationCode}</span>
        </div>
        <p>Enter this code on the verification page to complete your registration.</p>
        <p>This code will expire in 15 minutes for security reasons.</p>
        <p>If you didn't create an account with us, please ignore this email.</p>
        <p>Best regards,<br>Your App Team</p>
    </div>
</body>
</html>

`;

export const templateSendWelcomeEmail = `
    <!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue sur B-Hub !</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(to right, #2c3e50, #3498db); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Bienvenue sur B-Hub !</h1>
    </div>
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
        <p>Salut {nomUtilisateur},</p>
        <p>Nous sommes ravis de t'accueillir sur B-Hub, le réseau social et forum dédié aux passionnés de tech comme toi !</p>
        <h2 style="color: #2c3e50;">Voici comment tirer le meilleur de B-Hub :</h2>
        <ol style="color: #2c3e50;">
            <li>Complète ton profil en ajoutant tes domaines d'expertise tech</li>
            <li>Rejoins des forums sur tes sujets tech préférés</li>
            <li>Partage tes connaissances et pose tes questions à la communauté</li>
            <li>Connecte-toi avec d'autres passionnés de tech</li>
        </ol>
        <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Explorer B-Hub maintenant</a>
        </div>
        <p>Tu as une question sur une nouvelle technologie ? Besoin d'aide pour un projet ? N'hésite pas à consulter nos <a href="#" style="color: #3498db;">forums</a> ou à lancer une discussion !</p>
        <div style="text-align: center; margin-top: 20px;">
            <p style="font-weight: bold; color: #2c3e50;">Suis-nous pour les dernières actus tech :</p>
            <a href="#" style="color: #3498db; margin: 0 10px; text-decoration: none;">Twitter</a>
            <a href="#" style="color: #3498db; margin: 0 10px; text-decoration: none;">LinkedIn</a>
            <a href="#" style="color: #3498db; margin: 0 10px; text-decoration: none;">GitHub</a>
        </div>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 12px; color: #777; text-align: center;">
            Tu reçois cet email car tu t'es inscrit sur B-Hub. Si tu n'as pas créé de compte, merci d'ignorer cet email.<br>
            © 2023 B-Hub. Tous droits réservés.
        </p>
    </div>
</body>
</html>
`;

export const templateForgotPassword = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation de votre mot de passe B-Hub</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(to right, #2c3e50, #3498db); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Réinitialisation de votre mot de passe B-Hub</h1>
    </div>
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
        <p>Bonjour {nomUtilisateur},</p>
        <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte B-Hub. Si vous n'avez pas fait cette demande, vous pouvez ignorer cet email.</p>
        <p>Pour réinitialiser votre mot de passe, cliquez sur le bouton ci-dessous :</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="{lienResetPassword}" style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Réinitialiser mon mot de passe</a>
        </div>
        <p>Ou copiez et collez le lien suivant dans votre navigateur :</p>
        <p style="word-break: break-all; color: #3498db;">{lienResetPassword}</p>
        <p>Ce lien expirera dans 1 heure pour des raisons de sécurité.</p>
        <p>Si vous n'avez pas demandé de réinitialisation de mot de passe, veuillez sécuriser votre compte en changeant votre mot de passe immédiatement.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 12px; color: #777; text-align: center;">
            Ceci est un email automatique, merci de ne pas y répondre. Si vous avez besoin d'aide, contactez notre <a href="#" style="color: #3498db;">support</a>.<br>
            © 2023 B-Hub. Tous droits réservés.
        </p>
    </div>
</body>
</html> 
`;

export const templateSendResetPasswordSucces = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mot de passe réinitialisé avec succès - B-Hub</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(to right, #2c3e50, #3498db); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Mot de passe réinitialisé avec succès</h1>
    </div>
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
        <p>Bonjour {nomUtilisateur},</p>
        <p>Nous vous confirmons que votre mot de passe B-Hub a été réinitialisé avec succès.</p>
        <div style="background-color: #e8f5e9; border-left: 4px solid #4caf50; padding: 10px; margin: 20px 0;">
            <p style="margin: 0; color: #1b5e20;">
                <strong>Votre compte est maintenant sécurisé avec votre nouveau mot de passe.</strong>
            </p>
        </div>
        <p>Si vous n'avez pas effectué cette action, veuillez immédiatement :</p>
        <ol>
            <li>Changer votre mot de passe en vous connectant à votre compte</li>
            <li>Vérifier les activités récentes sur votre compte</li>
            <li>Contacter notre équipe de support</li>
        </ol>
        <div style="text-align: center; margin: 30px 0;">
            <a href="{lienConnexion}" style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Se connecter à B-Hub</a>
        </div>
        <p>Pour toute question ou préoccupation concernant votre compte, n'hésitez pas à contacter notre <a href="{lienSupport}" style="color: #3498db;">équipe de support</a>.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 12px; color: #777; text-align: center;">
            Ceci est un email automatique, merci de ne pas y répondre.<br>
            © 2023 B-Hub. Tous droits réservés.
        </p>
    </div>
</body>
</html>
`;
