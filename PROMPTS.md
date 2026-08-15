# PROMPTS.md

Méthodologie IA — Figma to Code Challenge, édition 4 (HemoLink).

## Outils sollicités

- **Cursor** (agent de code) : conception, architecture, implémentation, copy, animations, coupe mobile.
- **Générateur d’images (via Cursor)** : uniquement là où une photo libre manquait ou ne cadrait pas (portraits du hero, quelques visuels d’impact, deux façades de centres).
- **Photos existantes, licence libre** : Unsplash, Pexels, Wikimedia Commons — parcours, une partie de l’impact, la plupart des centres.
- **Aucune maquette Figma fournie** (contrainte de l’édition 4) : le design a été arbitré dans le dialogue, puis posé en tokens avant le code.

Le brief n’impose pas « que des vraies photos ». Il impose une identité originale, pas un thème tout fait. Les images sont un mélange volontaire : photos documentaires là où ça existe, images générées là où le cadrage (infirmière regardant le formulaire, regard baissé) devait coller à la mise en page.

## Séquence des prompts significatifs

### 1. Intention initiale

Demande de devenir l’assistant du challenge, avec Next.js, GSAP, Framer Motion, Tailwind, et une exigence d’animations soignées, de profondeur artistique et de performance.

**Ce que j’ai retenu (et ce que j’ai écarté)**  
Retenu : stack demandée, niveau de finition, originalité.  
Écarté : le 3D / WebGL lourd (Three.js). Sur une landing informative, il aurait flatté la technique et refroidi le propos — exactement ce que le brief punit. Choix : GSAP + Lenis, veine SVG, pas de spectacle 3D.

### 2. Lecture du brief (`brief.txt`)

Le brief a été lu en entier avant toute ligne de code. Arbitrages :

| Brief | Décision |
| --- | --- |
| Page froide = hors sujet | Ton éditorial, vouvoiement, copy anti-héroïsme |
| 3 certitudes (éligibilité, lieu, déroulé) | Quiz dans le hero, puis centres, puis parcours |
| Fusion de sections autorisée | C4 + C5 fusionnés dans « Une expérience qui ne dure que 45 min » |
| Pas de backend | Données locales, horaires calculés dans le navigateur |
| Simulateur : âge, poids, dernier don | Sexe ajouté uniquement pour le délai 3/4 mois |
| 8 centres min. | 8 centres, plusieurs villes (d’autres prévus après la soumission) |
| Mention médicale obligatoire | Sous le quiz **et** sous le logo du footer |
| PROMPTS.md obligatoire | Ce fichier |

### 3. Direction créative

Prompt implicite : *ne pas livrer la landing IA générique rouge + goutte + cards.*

Parti pris : **« Le rendez-vous »** — le don comme créneau de 45 minutes, pas comme sacrifice. Palette papier / cramoisi / argent. Typo Fraunces + Outfit.

Écarté :

- Dark mode médical
- Compteur de « vies sauvées »
- Custom cursor (conflit tactile / a11y)
- Quiz en une page type back-office

### 4. Images — ce qui a vraiment été fait

Au départ, l’intention était SVG / canvas seulement. Ça ne tenait pas le hero ni les centres : trop abstrait, trop « template ».

Arbitrage final :

- **Hero** : portraits générés (médecin / infirmière), cadrés pour le desktop (cinéma) et le mobile (regard vers le formulaire).
- **Parcours** : photos Unsplash / Pexels (repas, bras, pansement, jus).
- **Impact** : mélange Unsplash et photos réalisées / générées pour HemoLink (crédits dans `public/impact/CREDITS.txt`).
- **Centres** : Wikimedia Commons quand une vue de l’établissement existait ; **deux façades générées** (Ouidah, Tanguiéta) faute de photo libre exploitable. Crédits dans `public/centers/CREDITS.txt`.

### 5. Implémentation et coupe mobile

Le desktop (≥ 1024 px) a été figé une fois le théâtre hero en place (pin 340 vh, trois temps). Le mobile a été recoupé **sans casser ce desktop** : autre rythme, mêmes contenus.

Ajustements manuels notables :

- **Desktop gelé** : les pins GSAP (hero, critères, impact) restent derrière `min-width: 1024px`.
- **Hero mobile** : page titre (deux lockups gauche / droite), puis infirmière + formulaire au scroll. SplitText retiré du titre mobile (conflit React `removeChild`).
- **Critères mobile** : veine droite calée sur le centre des points ; les faits (`18 et 65 ans`, etc.) en rouge, pas les intros.
- **Impact mobile** : carrousel snap, une carte + aperçu de la suivante. Lenis désactivé sous 1024 px (le swipe horizontal ne passait pas).
- **Statut ouvert/fermé** : calculé après hydratation (fuseau visiteur vs SSR).
- **Quiz** : micro-attente pour l’état de chargement exigé (~700 ms).
- **Centres** : recherche par ville ; état vide « Votre zone n’est pas encore prise en compte ! ».
- **Copy parcours** : tiret retiré ; phase Après reformulée à la voix (collation, pansement un moment, hydratation).

## Limites rencontrées avec l’outil

- L’agent ne voit pas le site comme un internaute : le scroll, le pin et le tactile se valident à l’œil, à 390 px et 1440 px.
- Les centres sont **plausibles mais illustratifs**. Un lien officiel EFS / CNTS exigerait une source ; le brief autorise le statique.
- SplitText sur un titre React imbriqué a cassé le DOM (`removeChild`). Fallback : animer des lignes déjà dans le markup, sans splitter.
- L’IA pousse au générique ; la retenue (pas de 3D, pas de CTA « Sauvez des vies », vouvoiement) a été un **contre-prompt**, pas un réflexe du modèle.
- Une phrase de `PROMPTS.md` (« aucun générateur d’image ») est devenue fausse dès les portraits du hero. Elle est corrigée ici.

## Après la soumission

Le site est en ligne : [hemolink-steel.vercel.app](https://hemolink-steel.vercel.app).  
Les centres supplémentaires (jusqu’à 10+) et d’autres finitions peuvent suivre sans nouvelle « première version » : le dépôt reste vivant.
