# PROMPTS.md

Méthodologie IA — Figma to Code Challenge, édition 4 (HemoLink).

## Outils sollicités

- **Cursor** (agent de code) : conception, architecture, implémentation, copywriting, animations.
- **Aucun générateur d’image** : visuels volontairement SVG / canvas / CSS pour une identité originale, non stock.
- **Aucune maquette Figma fournie** (contrainte de l’édition 4) : le design a été arbitré dans le dialogue, puis posé en tokens avant le code.

## Séquence des prompts significatifs

### 1. Intention initiale

Demande de devenir l’assistant du challenge, avec Next.js, GSAP, Framer Motion, Tailwind, et une exigence d’animations « jamais vues », de profondeur artistique et de performance.

**Ce que j’ai retenu (et ce que j’ai écarté)**  
Retenu : stack demandée, niveau de finition, originalité.  
Écarté : le 3D / WebGL lourd (Three.js). Sur une landing informative, il aurait flatté la technique et refroidi le propos — exactement ce que le brief punit. Choix : canvas 2D de corpuscules + GSAP + Lenis.

### 2. Lecture du brief (fichier `brief.txt`)

Le brief a été lu en entier avant toute ligne de code. Arbitrages qui en découlent :

| Brief | Décision |
| --- | --- |
| Page froide = hors sujet | Ton éditorial, vouvoiement, copy anti-héroïsme |
| 3 certitudes (éligibilité, lieu, déroulé) | Hero + CTAs + ordre des sections calés là-dessus |
| Fusion de sections autorisée | C4 + C5 fusionnés dans le parcours 45 min |
| Pas de backend | Données locales, horaires calculés dans le navigateur |
| Simulateur : âge, poids, dernier don | Sexe ajouté uniquement pour le délai 3/4 mois |
| 8 centres min. | 10 centres, 10 villes, types de dons et accueil variés |
| PROMPTS.md obligatoire | Ce fichier, rédigé au fil de l’eau |

### 3. Direction créative (non générée « par défaut »)

Prompt implicite : *ne pas livrer la landing IA générique rouge + goutte + cards.*

Parti pris retenu : **« Le rendez-vous »** — le don comme créneau de 45 minutes, pas comme sacrifice. Palette papier / cramoisi / or. Typo Fraunces + Outfit. Fil SVG (DrawSVG) comme progress bar.

Écarté après réflexion :

- Dark mode médical full-bleed
- Compteur de « vies sauvées » agressif
- Custom cursor permanent (bruit visuel, conflit accessibilité / tactile)
- Formulaire d’éligibilité en une page type back-office

### 4. Implémentation

Demandes opérationnelles (internes à l’agent) : scaffold Next.js, tokens, sections C1–C8, algo d’éligibilité, filtres centres, a11y FAQ, reduced-motion.

Ajustements manuels notables pendant l’implémentation :

- **Nom npm** : `hemolink` en minuscules (contrainte npm) ; marque affichée `HemoLink`.
- **Pin GSAP** : le parcours horizontal pine uniquement le bloc des cartes, pas les conseils avant/pendant/après — sinon le récit se bloque trop longtemps.
- **Statut ouvert/fermé** : calculé après hydratation pour éviter un mismatch SSR (serveur UTC vs visiteur).
- **Quiz** : micro-attente (« on vérifie le pouls ») pour l’état de chargement exigé, sans fake latency abusive (700 ms).
- **Disclaimer médical** : répété sous le quiz et au footer, conformément à l’annexe du brief.

## Limites rencontrées avec l’outil

- Un passage en **mode plan** a été proposé pour figer le parti pris avant le code ; il a été refusé. L’agent a donc tranché la direction créative puis implémenté — le risque étant un moins bon alignement visuel si le challenger avait une autre esthétique en tête. À ajuster ensuite (palette, ton, nom).
- L’outil ne « voit » pas le site comme un internaute : le feeling scroll / pin / Lenis doit être validé à l’œil, à 390 px et 1440 px, avec et sans `prefers-reduced-motion`.
- Les adresses et horaires des centres sont **plausibles mais fictifs**. Un vrai lien EFS exigerait une source officielle ; le brief autorise le statique illustratif.
- SplitText / DrawSVG : API importée depuis le package public `gsap` (plugins désormais libres). Si un build casse sur l’export, le fallback est un split manuel + `stroke-dashoffset`.
- L’IA tend vers le générique ; la retenue (moins de 3D, moins de CTA « Sauvez des vies », plus de phrases calmes) a été un **contre-prompt volontaire**, pas un réflexe du modèle.

## Ce que le challenger a encore à piloter

- Relire le copy à voix haute : couper ce qui sonne encore « IA ».
- Tester le quiz (mineur, < 50 kg, délai non écoulé, premier don).
- Déployer (Vercel) et coller l’URL dans le README.
- Décider si le nom **HemoLink** reste, ou s’il devient une marque plus personnelle.
