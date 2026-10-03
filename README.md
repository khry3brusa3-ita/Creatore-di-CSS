# Creatore-di-CSS
creator of css in a visual way

#Creatore di CSS

This project does not require third-party libraries or external CDNs.

The application is built with standard **HTML, CSS and JavaScript** and can run locally in a modern browser.


# 🎨 CSS Visual Builder — Suite Completa

Benvenuto nel repository di **CSS Visual Builder**, un editor visuale pensato per costruire e modificare il CSS senza dover scrivere manualmente ogni proprietà. Il progetto combina un editor HTML, una struttura DOM interattiva, una preview live e numerosi strumenti visuali per layout, selettori, valori CSS, animazioni e proprietà avanzate.

L'applicazione è progettata per funzionare **localmente e offline**, senza CDN e senza dipendenze server-side. Il codice è organizzato in moduli separati per mantenere il motore principale stabile e permettere di aggiungere nuovi editor senza modificare continuamente `app.js`.

---

🖱️ **Clicca un elemento nella preview o nella struttura DOM per selezionarlo e modificarlo.**

## 🚀 Funzionalità Principali (Spiegate Semplici)

### 🌐 1. Editor HTML e Preview Live
* **Editor HTML:** incolla direttamente il tuo HTML oppure carica un file `.html` / `.htm` dal computer.
* **Applica:** aggiorna immediatamente la pagina di anteprima con il nuovo HTML.
* **Preview separata:** il contenuto viene visualizzato in un'area di anteprima indipendente.
* **Selezione diretta:** puoi cliccare un elemento direttamente nella preview per individuare il relativo selettore CSS.
* **Modalità Desktop / Mobile:** puoi cambiare rapidamente il formato della preview per controllare il comportamento del layout.

### 🌳 2. Struttura DOM e Selezione degli Elementi
* **Albero DOM interattivo:** mostra la struttura degli elementi presenti nell'HTML.
* **Ricerca DOM:** cerca rapidamente elementi, classi e ID.
* **Selettore corrente:** l'app mostra il selettore dell'elemento attualmente selezionato.
* **Elementi per TAG:** visualizza gli elementi raggruppati per tag HTML e permette di cercarli rapidamente.
* **Selezione multipla:** puoi selezionare più elementi dello stesso contenitore per applicare operazioni di layout insieme.

### 📐 3. Layout Visuale
* **Affianca:** dispone gli elementi in riga.
* **Impila:** dispone gli elementi in colonna.
* **Centra:** centra gli elementi nel contenitore.
* **Distribuisci:** distribuisce lo spazio tra gli elementi.
* **Griglia:** costruisce un layout a griglia.
* **Gap regolabile:** puoi modificare visivamente lo spazio tra gli elementi.
* **Shift / Ctrl + clic:** supporto alla selezione multipla direttamente nella preview.

### 🎛️ 4. Editor delle Proprietà CSS
* **Database locale delle proprietà CSS:** le proprietà sono organizzate e ricercabili direttamente nell'interfaccia.
* **Ricerca proprietà:** trova velocemente una proprietà per nome o categoria.
* **Controlli ON/OFF:** puoi preparare un valore e decidere separatamente se applicarlo o includerlo nell'output CSS.
* **Selettori di stato:** modifica lo stato normale oppure pseudo-classi e pseudo-elementi come `:hover`, `:focus`, `:active`, `:visited`, `::before` e `::after`.
* **Azzera regola:** rimuove le proprietà associate al selettore attivo.
* **Output CSS automatico:** il codice viene rigenerato mentre modifichi i valori.
* **Copia CSS:** copia direttamente il CSS generato negli appunti.

### 🖱️ 5. Spostamento Visuale degli Elementi
* **Modalità Trascina:** abilita lo spostamento diretto degli elementi dentro la preview.
* **Generazione CSS automatica:** lo spostamento viene tradotto in proprietà come `position`, `left` e `top`.
* **Snap configurabile:** puoi impostare una griglia magnetica in pixel per ottenere spostamenti più ordinati e precisi.

### 📦 6. Regole CSS Strutturali e Condizionali
Il modulo delle at-rule permette di costruire visualmente regole che normalmente richiederebbero di scrivere CSS a mano.

* **`@media`:** condizioni responsive basate, ad esempio, sulla larghezza dello schermo.
* **`@container`:** condizioni basate sul contenitore dell'elemento.
* **`@supports`:** genera regole condizionali in base al supporto di una proprietà CSS.
* **`@layer`:** organizza le regole CSS in layer.
* **`@scope`:** limita il campo di applicazione delle regole.
* **`@starting-style`:** permette di definire gli stili iniziali per transizioni e animazioni.
* **Proprietà interne:** ogni at-rule può contenere proprietà CSS attivabili e modificabili.
* **Ricerca e aggiunta proprietà:** puoi cercare una proprietà dal database locale e inserirla direttamente nella regola.
* **Output separato:** le at-rule vengono visualizzate anche in un riquadro di codice dedicato.

### ⏱️ 7. Scroll & View Timelines
* **Scroll timeline:** costruzione di timeline nominate con `scroll-timeline`.
* **View timeline:** costruzione di timeline con `view-timeline` e relativo `view-timeline-inset`.
* **Animation timeline:** collega un'animazione a una timeline nominata oppure a `scroll()` / `view()`.
* **Animation range:** supporto a `animation-range`, `animation-range-start` e `animation-range-end`.

### 🧰 8. Editor Visuali Avanzati
Il progetto dispone di un'area dedicata alle proprietà CSS più complesse, organizzate per categorie.

* **Dimensioni & oggetti:** `box-sizing`, `aspect-ratio`, `object-fit`, `object-position`, `resize`, `min-width`, `max-width`, `min-height`, `max-height` e proprietà correlate.
* **Scrolling & snap:** comportamento dello scrolling, snap, overscroll, scrollbar, margin e padding di scroll.
* **Box model logico:** margin, padding, inset, border e radius nelle varianti logiche.
* **Tipografia avanzata:** wrapping del testo, white-space, word-break, hyphens, line-clamp, text-overflow, text-indent e vertical-align.
* **Masking & Clip SVG:** proprietà `mask-*` e `clip-rule`.
* **Compositing & rendering:** `opacity`, `mix-blend-mode`, `background-blend-mode`, `isolation`, `backdrop-filter`, `will-change`, `transform-style` e `backface-visibility`.
* **SVG & pittura vettoriale:** `fill`, `stroke`, `paint-order`, `vector-effect` e relative proprietà.
* **UI, form & interazione:** `appearance`, `accent-color`, `caret-color`, `color-scheme`, `cursor`, `pointer-events`, `user-select`, `touch-action`, `field-sizing` e `resize`.
* **Colonne & paginazione:** `columns`, `column-count`, `column-width`, `column-gap`, `column-rule`, `column-span`, `break-*`, `orphans` e `widows`.
* **Containment & Anchor Positioning:** `contain`, `container-type`, `container-name`, `content-visibility`, `contain-intrinsic-*`, `anchor-name`, `position-anchor` e `anchor-scope`.
* **Rendering, accessibilità & contenuto:** proprietà relative a rendering del testo/immagini, forced colors, stampa, contenuto e visibilità.
* **Variabili & funzioni CSS:** custom properties e funzioni come `var()`, `calc()`, `min()`, `max()`, `clamp()` ed `env()`.
* **Background avanzato:** repeat, position, size, attachment, origin, clip, blend, colore, immagine e gradienti.
* **Tipografia avanzata:** font family, size, weight, style, stretch, line-height, spacing, allineamento, decoration e impostazioni OpenType/variabili.
* **Flexbox:** editor separati per contenitore e singoli elementi.
* **Grid:** editor per struttura del contenitore, righe, colonne, aree, auto-placement e posizionamento dei singoli elementi.

### 🎨 9. Costruttori di Valori Complessi
* **Colore con alpha:** costruzione di valori colore con trasparenza.
* **Funzioni matematiche CSS:** generatori visuali per `calc()`, `min()`, `max()` e `clamp()`.
* **Gradienti:** editor con più color stop e supporto a gradienti lineari, radiali e conici, comprese le varianti `repeating-*`.
* **Filtri combinati:** puoi costruire una catena di filtri come `blur`, `brightness`, `contrast`, `saturate`, `grayscale`, `sepia`, `opacity`, `invert`, `hue-rotate` e `drop-shadow`.
* **Copia rapida:** ogni costruttore può mostrare il relativo output CSS e copiarlo.

### 🧩 10. Selector Lab e CSS Nesting
* **Compositore di selettori:** costruisce selettori CSS senza scriverne manualmente tutta la sintassi.
* **Pseudo-classi e pseudo-elementi:** include stati come `:hover`, `:focus`, `:checked`, `:disabled`, `:valid`, `:invalid`, `:first-child`, `:last-child`, `:nth-child()`, `:not(...)` e pseudo-elementi come `::before`, `::after`, `::placeholder`, `::selection` e `::marker`.
* **Combinatori:** supporto a discendenti, figli (`>`), fratelli adiacenti (`+`) e fratelli generali (`~`).
* **Attributi:** costruzione di selettori basati su attributi HTML.
* **Trasferimento diretto:** il selettore creato nel Selector Lab può essere inviato direttamente all'editor visuale avanzato.
* **CSS Nesting:** editor per selettore padre, selettore annidato e dichiarazioni CSS.

### 🧱 11. At-rule Speciali
Oltre alle regole strutturali principali, il progetto include un editor separato per at-rule che non funzionano come normali blocchi con selettore.

* **`@font-face`:** famiglia, sorgente font, display, stile, peso, stretch e unicode range.
* **`@property`:** definizione di custom property tipizzate con syntax, inherits e valore iniziale.
* **`@page`:** regole per la stampa, dimensione, margini e orientamento della pagina.
* **`@counter-style`:** creazione di stili personalizzati per i contatori.
* **`@view-transition`:** configurazione delle view transitions.
* **`@import`, `@namespace`, `@charset`:** supporto alle principali direttive CSS globali.

### 🖼️ 12. Editor Grafici Interattivi
Il modulo `css-builder-visual-editors.js` contiene editor specializzati con anteprime in tempo reale.

* **Transform 2D/3D:** modifica traslazione, rotazione, scala, skew e prospettiva tramite controlli numerici e uno stage interattivo.
* **Box Shadow:** offset, blur, spread, colore, alpha e `inset` con preview live.
* **Gradient Editor:** stop multipli trascinabili e generazione automatica del gradient.
* **Border & Radius:** quattro lati del bordo indipendenti e quattro raggi degli angoli separati.
* **Filter:** catena di filtri con preview live.
* **Backdrop Filter:** anteprima dell'effetto applicato al contenuto dietro l'elemento.
* **Mask:** `mask-image`, posizione, dimensione, repeat e mode, con supporto alla preview WebKit.
* **Text Shadow:** offset, blur, colore e alpha.
* **Box Model:** larghezza, altezza, margin, padding e bordi con editor visivo.
* **Flexbox:** configurazione del contenitore Flex e dei relativi elementi.
* **Grid:** configurazione della struttura Grid e del posizionamento degli elementi.
* **Clip / punti e curve:** strumenti visuali per lavorare con forme e funzioni di clipping.
* **Cubic Bezier:** editor grafico dei punti di controllo per costruire funzioni di easing.
* **Transition:** gestione di più proprietà, durata, ritardo, timing function e preset di easing.

### ↔️ 13. Pannello Ridimensionabile e Responsive UI
* **Sidebar ridimensionabile:** puoi allargare o restringere il pannello delle impostazioni trascinando la maniglia centrale.
* **Controllo da tastiera:** frecce sinistra/destra per piccole regolazioni e `Home` / `End` per i limiti.
* **Salvataggio della larghezza:** la dimensione del pannello viene memorizzata localmente nel browser.
* **Layout responsive:** sui dispositivi più piccoli il ridimensionatore viene nascosto per lasciare spazio alla UI mobile.

### 💾 14. Progetto, Esportazione e Salvataggio
* **Scarica progetto:** il progetto può essere esportato per conservarne il lavoro.
* **Caricamento HTML:** puoi ripartire da un file HTML già esistente.
* **Stato locale:** alcune impostazioni dell'interfaccia vengono conservate tramite `localStorage`, come la larghezza della sidebar e altri dati locali utilizzati dai moduli.
* **Output CSS:** il CSS generato può essere copiato separatamente dal resto del progetto.
* **Architettura estendibile:** gli editor aggiuntivi mantengono il proprio stato in moduli separati, rendendo più semplice aggiungere nuove funzioni.

### 🧪 15. JavaScript Lab
Il progetto è stato pensato anche per integrare un'area **JavaScript Lab** dedicata al comportamento dinamico della pagina, oltre alla parte visuale HTML/CSS.

* **Editor JavaScript:** spazio dedicato per scrivere e provare codice JS insieme alla pagina HTML/CSS.
* **Interazione con la preview:** il JavaScript può lavorare sugli elementi creati nel progetto.
* **Separazione dei moduli:** HTML, CSS e JavaScript possono essere gestiti in aree distinte, pur facendo parte dello stesso progetto.
* **Salvataggio del JS nel progetto:** l'integrazione del contenuto del JavaScript Lab nel sistema di salvataggio JSON è prevista come parte della gestione completa dello stato del progetto.

> **Nota:** nelle versioni del progetto già presenti nel repository, il nucleo documentato è `v2.12`; il JavaScript Lab e il salvataggio completo di tutto il suo contenuto possono quindi dipendere dall'integrazione più recente del progetto.

---

## 📁 Struttura del Progetto

```text
CSS Visual Builder/
│
├── index.html
├── app.js
├── style.css
├── css-properties.js
├── css-builder-extensions.js
└── css-builder-visual-editors.js
```

### `index.html`
Contiene la struttura principale dell'interfaccia, la preview, i pannelli e il caricamento dei moduli JavaScript.

### `app.js`
Costituisce il motore principale dell'editor: gestione HTML, DOM, selezione, proprietà CSS, preview, layout e output CSS.

### `css-properties.js`
Contiene il database locale delle proprietà CSS utilizzato dai controlli e dalle ricerche.

### `css-builder-extensions.js`
Aggiunge le funzionalità avanzate senza modificare direttamente il nucleo principale, tra cui at-rule, timeline, Selector Lab, CSS Nesting e altri strumenti.

### `css-builder-visual-editors.js`
Contiene gli editor grafici interattivi per trasformazioni, ombre, gradienti, bordi, filtri, mask, text shadow, box model, Flexbox, Grid, Bezier e transition.

### `style.css`
Gestisce l'interfaccia dell'applicazione, il layout responsive, la preview dei pannelli e gli stili degli editor visuali.

---

## ▶️ Avvio del Progetto

1. Scarica tutti i file del progetto nella stessa cartella.
2. Apri `index.html` direttamente in un browser moderno oppure usa **VS Code + Live Server**.
3. Non sono necessari server, installazioni o CDN esterne.
4. Inserisci o carica il tuo HTML e inizia a modificare gli elementi dalla struttura DOM oppure direttamente dalla preview.

---

## 🧱 Architettura del Progetto

Una delle caratteristiche principali del progetto è la separazione tra **motore principale** ed **estensioni**.

`app.js` gestisce il funzionamento fondamentale dell'editor, mentre i moduli aggiuntivi estendono l'interfaccia e producono CSS senza dover riscrivere continuamente il nucleo.

Gli editor visuali comunicano tramite eventi custom, come `cvb:visual-editor-change`, così le nuove funzioni possono rimanere relativamente indipendenti dal codice principale.

Questo approccio rende il progetto più facile da mantenere e permette di aggiungere nuovi editor specializzati senza trasformare `app.js` in un unico file gigantesco.

---

## 📝 Stato del Progetto

La base documentata nel repository arriva alla **v2.12** per gli editor HTML/CSS visuali.

Le estensioni successive possono includere nuovi moduli, in particolare il **JavaScript Lab** e il completamento del sistema di salvataggio del progetto in un unico file JSON, comprendendo anche il codice JavaScript e lo stato completo dell'interfaccia.

---

# 🎨 CSS Visual Builder — Complete Suite

Welcome to the repository of **CSS Visual Builder**, a visual editor designed to build and modify CSS without manually writing every property. The project combines an HTML editor, an interactive DOM tree, a live preview, and a wide collection of visual tools for layout, selectors, CSS values, animations, and advanced browser features.

The application is designed to run **locally and offline**, without CDNs or server-side dependencies. The code is split into separate modules so the core engine can remain stable while new editors are added independently.

---

🖱️ **Click an element in the preview or in the DOM tree to select and edit it.**

## 🚀 Main Features (Explained Simply)

### 🌐 1. HTML Editor and Live Preview
* **HTML editor:** paste HTML directly or load an `.html` / `.htm` file.
* **Apply:** refresh the preview with the current HTML.
* **Separate preview:** the page is displayed in an independent preview area.
* **Direct selection:** click an element in the preview to select its CSS selector.
* **Desktop / Mobile preview:** switch between desktop and mobile preview modes.

### 🌳 2. DOM Structure and Element Selection
* **Interactive DOM tree:** displays the hierarchy of HTML elements.
* **DOM search:** find elements, classes and IDs quickly.
* **Current selector:** shows the selector of the active element.
* **Elements by TAG:** browse elements grouped by HTML tag.
* **Multi-selection:** select multiple elements from the same container for layout operations.

### 📐 3. Visual Layout
* **Row layout:** place elements side by side.
* **Column layout:** stack elements vertically.
* **Center:** center selected elements.
* **Distribute:** distribute available space between elements.
* **Grid:** create a grid-based arrangement.
* **Adjustable gap:** control the distance between selected elements.
* **Shift / Ctrl + click:** multi-selection directly inside the preview.

### 🎛️ 4. CSS Property Editor
* **Local CSS property database:** searchable CSS properties organized by category.
* **Property search:** find properties quickly.
* **ON/OFF controls:** prepare a value without necessarily applying/exporting it.
* **Pseudo states:** edit normal state, `:hover`, `:focus`, `:active`, `:visited`, `::before` and `::after`.
* **Clear rule:** remove the styles associated with the active selector.
* **Automatic CSS output:** generated CSS updates while values change.
* **Copy CSS:** copy generated CSS directly to the clipboard.

### 🖱️ 5. Visual Element Dragging
* **Drag mode:** move elements directly inside the preview.
* **Automatic CSS:** movement is translated into properties such as `position`, `left` and `top`.
* **Configurable snapping:** use a pixel grid to keep movements aligned.

### 📦 6. Structural and Conditional CSS Rules
* **`@media`**, **`@container`**, **`@supports`**, **`@layer`**, **`@scope`** and **`@starting-style`**.
* Editable selectors and properties inside each rule.
* Search and insertion of properties from the local CSS database.
* Separate output for generated at-rules.

### ⏱️ 7. Scroll & View Timelines
* Named scroll timelines using `scroll-timeline`.
* Named view timelines using `view-timeline`.
* `animation-timeline` connected to named timelines, `scroll()` or `view()`.
* Visual controls for `animation-range`, `animation-range-start` and `animation-range-end`.

### 🧰 8. Advanced Visual Editors
* Advanced sizing and object properties.
* Scrolling and scroll snap.
* Logical box model properties.
* Advanced typography and text layout.
* Masking, SVG painting and clipping.
* Compositing and rendering properties.
* UI/form/interactions properties.
* Columns and pagination.
* Containment and anchor positioning.
* Rendering, accessibility and content-related properties.
* CSS custom properties and functions.
* Advanced backgrounds and gradients.
* Advanced typography and OpenType-related settings.
* Flexbox and CSS Grid editors.

### 🎨 9. Complex CSS Value Builders
* Colors with alpha.
* `calc()`, `min()`, `max()` and `clamp()` builders.
* Multi-stop gradient editor with linear, radial and conic variants, including `repeating-*` forms.
* Combined filter chains.
* Individual CSS output with copy support.

### 🧩 10. Selector Lab and CSS Nesting
* Visual selector composer.
* Pseudo-classes and pseudo-elements.
* Child, descendant and sibling combinators.
* Attribute selectors.
* Direct transfer to the advanced editor target.
* CSS Nesting editor with parent selector, nested selector and editable declarations.

### 🧱 11. Special At-Rules
* `@font-face`
* `@property`
* `@page`
* `@counter-style`
* `@view-transition`
* `@import`, `@namespace`, `@charset`

### 🖼️ 12. Interactive Graphic Editors
* 2D/3D Transform editor.
* Box Shadow editor.
* Gradient editor.
* Border & Radius editor.
* Filter and Backdrop Filter editors.
* Mask editor.
* Text Shadow editor.
* Box Model editor.
* Flexbox editor.
* Grid editor.
* Clip / point and curve tools.
* Cubic Bezier timing-function editor.
* Transition editor with presets and multiple properties.

### ↔️ 13. Resizable and Responsive Workspace
* Resizable left settings panel.
* Keyboard controls for panel width.
* Local persistence of sidebar width.
* Responsive behavior on smaller screens.

### 💾 14. Project, Export and Saving
* Project download and reload workflow.
* HTML file loading.
* Local browser state for interface settings.
* Independent CSS output copying.
* Modular state management for visual editor extensions.

### 🧪 15. JavaScript Lab
The project is also designed to include a dedicated **JavaScript Lab** for dynamic behavior alongside the visual HTML/CSS editor.

* Dedicated JavaScript editing area.
* JavaScript interaction with the preview page.
* Separation between HTML, CSS and JavaScript while keeping them inside the same project.
* Planned inclusion of JavaScript Lab content in the complete JSON project save system.

> **Note:** the repository files currently documented here are based on the `v2.12` HTML/CSS core; the most recent JavaScript Lab and complete JSON integration may therefore depend on the latest project iteration.

---

## 📁 Project Structure

```text
CSS Visual Builder/
│
├── index.html
├── app.js
├── style.css
├── css-properties.js
├── css-builder-extensions.js
└── css-builder-visual-editors.js
```

## ▶️ Running the Project

1. Keep all project files in the same folder.
2. Open `index.html` directly in a modern browser or use **VS Code + Live Server**.
3. No server installation or external CDN is required.
4. Load or paste HTML and start editing from the DOM tree or directly from the live preview.

---

## 🧱 Project Architecture

The project separates the **core editor** from its **extension modules**.

`app.js` contains the main editor engine, while the extension modules add advanced rules, selector tools, value builders and interactive visual editors without requiring constant changes to the core.

Visual editors communicate through custom events such as `cvb:visual-editor-change`, keeping the additional modules relatively independent from the main application logic.

This structure makes the project easier to maintain and leaves room for future CSS, animation and JavaScript tools.

---

## 📝 Project Status

The repository version documented here reaches **v2.30** for the visual HTML/CSS editor and its advanced visual modules.

Further iterations can extend the project with additional JavaScript Lab functionality and a fully unified JSON project format containing HTML, CSS, JavaScript and the complete interface state.

