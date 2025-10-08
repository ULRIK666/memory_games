<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once 'includes/auth.php';
$auth = new Auth();
$isLoggedIn = $auth->isLoggedIn();
$username = $isLoggedIn ? $_SESSION['username'] : '';
?>
<!DOCTYPE html>
<html lang="no">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FAQ - MindMatrix</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="hexagon-background" id="hexagon-container"></div>

    <!-- Same Header as index.php -->
    <?php include 'includes/header.php'; ?>

    <main class="main-container">
        <div class="content-section">
            <h1 class="content-title">Ofte Stilte Spørsmål</h1>
            
            <div class="faq-item">
                <div class="faq-question">Hva er MindMatrix?</div>
                <div class="faq-answer">
                    MindMatrix er en plattform for kognitiv trening som fokuserer på å forbedre hukommelse, 
                    mønstergjenkjenning og problemløsningsevner gjennom morsomme og utfordrende spill.
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question">Hvordan fungerer poengsystemet?</div>
                <div class="faq-answer">
                    Poeng gis basert på prestasjoner i hvert spill. Høyere nivåer og raskere gjennomføring 
                    gir flere poeng. Leaderboard viser de beste spillerne for hvert spill.
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question">Kan jeg spille uten konto?</div>
                <div class="faq-answer">
                    Du kan prøve spillene uten konto, men for å lagre progresjon, delta på leaderboards 
                    og se detaljert statistikk, må du opprette en gratis konto.
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question">Hvor ofte bør jeg trene?</div>
                <div class="faq-answer">
                    Anbefalt er 15-20 minutter daglig for beste resultater. Konsistens er viktigere enn 
                    lengde på treningsøktene.
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question">Er spillene egnet for alle aldre?</div>
                <div class="faq-answer">
                    Ja! Spillene er designet for alle fra 8 til 80+ år. Vanskelighetsgraden tilpasses 
                    automatisk basert på prestasjoner.
                </div>
            </div>
        </div>
    </main>

    <?php include 'includes/footer.php'; ?>
    <script src="script.js"></script>
</body>
</html>