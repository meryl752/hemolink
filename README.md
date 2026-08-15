# HemoLink

Landing page informative sur le don de sang — **Figma to Code Challenge, édition 4**.

> *Vous avez déjà tout ce qu’il faut.*

HemoLink n’est pas une campagne de culpabilité. C’est une ressource pour les adultes qui n’ont jamais donné : trop d’inconnues, trop d’idées reçues, pas assez de clarté. La page répond à trois questions, dans cet ordre :

1. **Puis-je donner ?**
2. **Où est-ce que je vais ?**
3. **Que va-t-il m’arriver pendant 45 minutes ?**

Projet pédagogique indépendant. Aucune transaction, aucun compte, aucun téléchargement. Les données des centres et des réserves sont illustratives.

## Parti pris

Le brief interdit une page techniquement parfaite mais froide. Le parti pris est donc **éditorial et rassurant**, pas hospitalier.

- **Ton** : tutoiement évité, vouvoiement calme. On ne recrute pas des héros ; on accompagne un premier geste.
- **Métaphore** : le *fil de vie* — une veine dessinée au scroll, un pouls discret, des cellules qui dérivent. Le sang comme matière vivante, pas comme pictogramme.
- **Couleur** : papier chaud (`#F4EDE4`), encres profondes, cramoisi de velours (`#B91C2C`), or pâle. Pas de blanc clinique, pas de rouge sirène.
- **Typo** : Fraunces (display, un peu irrégulière, humaine) + Outfit (interface).
- **Animation** : au service du récit. GSAP ScrollTrigger pour le parcours horizontal et les révélations, Framer Motion pour le quiz, canvas pour le champ cellulaire du hero. `prefers-reduced-motion` est respecté.

## Stack

| Couche | Choix |
| --- | --- |
| Framework | Next.js 16 (App Router) + TypeScript |
| Style | Tailwind CSS v4, tokens `@theme` |
| Scroll | Lenis + GSAP ScrollTrigger |
| Motion | GSAP 3 (SplitText, DrawSVG, CustomEase) + Framer Motion |
| Data | Fichiers statiques (`src/data`) — pas de backend |

## Contenu (brief C1–C8)

| Réf. | Section |
| --- | --- |
| C1 | *Une poche. Trois destins.* — globules, plasma, plaquettes |
| C2 | Trois critères généraux (âge, poids, délai) |
| C3 | Simulateur d’éligibilité (âge, poids, sexe, dernier don) |
| C4–C5 | Parcours 45 min + conseils avant / pendant / après |
| C6 | Annuaire de 10 centres, recherche et filtres |
| C7 | Réserves par groupe sanguin (niveaux illustratifs) |
| C8 | FAQ & idées reçues, navigation clavier |

## Algorithme d’éligibilité

Implémenté dans `src/lib/eligibility.ts` :

- 18–65 ans révolus
- 50 kg minimum
- Délai : 3 mois (homme) / 4 mois (femme)
- Jamais donné → délai considéré comme rempli
- Délai non écoulé → date de prochaine éligibilité
- Âge ou poids hors critères → motif explicite

**Seul un entretien médical professionnel peut confirmer l’aptitude au don.** Mentionnée sous le quiz et dans le pied de page.

## Lancer le projet

```bash
npm install
npm run dev
```

Build de production :

```bash
npm run build
npm start
```

## Déploiement

Production : [hemolink-steel.vercel.app](https://hemolink-steel.vercel.app)

Le projet Vercel `hemolink` est relié au dépôt GitHub. Un push sur `main` déclenche le build et la mise en production.

## Accessibilité

- Lien d’évitement, `lang="fr"`, focus visible
- FAQ : `aria-expanded`, régions, flèches Haut / Bas / Home / End
- États de chargement, vide et erreur sur le quiz et l’annuaire
- Horaires des centres calculés côté client (fuseau `Europe/Paris`) pour éviter un décalage SSR

## Livrables challenge

- Code : ce dépôt
- Méthodologie IA : [`PROMPTS.md`](./PROMPTS.md)
- Déploiement : [hemolink-steel.vercel.app](https://hemolink-steel.vercel.app)
