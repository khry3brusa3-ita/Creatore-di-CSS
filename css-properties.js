/*
 CSS Visual Builder v0.5 — catalogo locale.
 type indica quale editor mostrare. onByDefault=false prepara una proprietà
 senza inserirla nel CSS finché l'utente non la attiva.
*/
window.CSS_PROPERTY_DATABASE = [
  // Colori / sfondo
  {key:'color',label:'Colore testo',category:'Colori',type:'color',defaultValue:'#222222'},
  {key:'background-color',label:'Colore sfondo',category:'Colori',type:'color',defaultValue:'#ffffff'},
  {key:'background-image',label:'Gradient / immagine',category:'Sfondo',type:'gradient-visual'},
  {key:'background-repeat',label:'Ripetizione sfondo',category:'Sfondo',type:'select',values:['repeat','no-repeat','repeat-x','repeat-y','space','round'],defaultValue:'repeat'},
  {key:'background-position',label:'Posizione sfondo',category:'Sfondo',type:'text',defaultValue:'center'},
  {key:'background-size',label:'Dimensione sfondo',category:'Sfondo',type:'select',values:['auto','cover','contain','100% 100%','50% auto'],defaultValue:'auto'},
  {key:'background-attachment',label:'Attacco sfondo',category:'Sfondo',type:'select',values:['scroll','fixed','local'],defaultValue:'scroll'},
  {key:'background-blend-mode',label:'Blend sfondo',category:'Sfondo',type:'select',values:['normal','multiply','screen','overlay','darken','lighten','color-dodge','color-burn','hard-light','soft-light','difference','exclusion','hue','saturation','color','luminosity'],defaultValue:'normal'},

  // Testo / font
  {key:'font-family',label:'Famiglia font',category:'Testo',type:'select',values:['Arial, sans-serif','Georgia, serif','"Trebuchet MS", sans-serif','Verdana, sans-serif','monospace','system-ui, sans-serif'],defaultValue:'Arial, sans-serif'},
  {key:'font-size',label:'Dimensione testo',category:'Testo',type:'range-number',min:1,max:120,step:1,unit:'px',defaultValue:20},
  {key:'font-weight',label:'Peso testo',category:'Testo',type:'select',values:['100','200','300','400','500','600','700','800','900'],defaultValue:'400'},
  {key:'font-style',label:'Stile testo',category:'Testo',type:'select',values:['normal','italic','oblique'],defaultValue:'normal'},
  {key:'font-variant',label:'Variante font',category:'Testo',type:'select',values:['normal','small-caps','all-small-caps'],defaultValue:'normal'},
  {key:'text-align',label:'Allineamento',category:'Testo',type:'select',values:['left','center','right','justify','start','end'],defaultValue:'left'},
  {key:'text-align-last',label:'Ultima riga',category:'Testo',type:'select',values:['auto','left','center','right','justify','start','end'],defaultValue:'auto'},
  {key:'text-decoration-line',label:'Decorazione',category:'Testo',type:'select',values:['none','underline','overline','line-through','underline overline'],defaultValue:'none'},
  {key:'text-decoration-style',label:'Stile decorazione',category:'Testo',type:'select',values:['solid','double','dotted','dashed','wavy'],defaultValue:'solid'},
  {key:'text-decoration-color',label:'Colore decorazione',category:'Testo',type:'color',defaultValue:'#222222'},
  {key:'text-transform',label:'Trasformazione',category:'Testo',type:'select',values:['none','uppercase','lowercase','capitalize'],defaultValue:'none'},
  {key:'text-indent',label:'Rientro testo',category:'Testo',type:'range-number',min:-100,max:300,step:1,unit:'px',defaultValue:0},
  {key:'letter-spacing',label:'Spaziatura lettere',category:'Testo',type:'range-number',min:-10,max:30,step:0.1,unit:'px',defaultValue:0},
  {key:'word-spacing',label:'Spaziatura parole',category:'Testo',type:'range-number',min:-10,max:50,step:0.1,unit:'px',defaultValue:0},
  {key:'line-height',label:'Interlinea',category:'Testo',type:'range-number',min:0.5,max:4,step:0.1,unit:'',defaultValue:1.5},
  {key:'white-space',label:'Gestione spazi',category:'Testo',type:'select',values:['normal','nowrap','pre','pre-wrap','pre-line','break-spaces'],defaultValue:'normal'},
  {key:'overflow-wrap',label:'A capo parole lunghe',category:'Testo',type:'select',values:['normal','break-word','anywhere'],defaultValue:'normal'},
  {key:'word-break',label:'Interruzione parole',category:'Testo',type:'select',values:['normal','break-all','keep-all','break-word'],defaultValue:'normal'},
  {key:'direction',label:'Direzione testo',category:'Testo',type:'select',values:['ltr','rtl'],defaultValue:'ltr'},

  // Dimensioni / box
  {key:'width',label:'Larghezza',category:'Dimensioni',type:'range-number',min:0,max:1400,step:1,unit:'px',defaultValue:300},
  {key:'height',label:'Altezza',category:'Dimensioni',type:'range-number',min:0,max:1000,step:1,unit:'px',defaultValue:150},
  {key:'min-width',label:'Larghezza minima',category:'Dimensioni',type:'range-number',min:0,max:1400,step:1,unit:'px',defaultValue:0},
  {key:'max-width',label:'Larghezza massima',category:'Dimensioni',type:'range-number',min:0,max:1400,step:1,unit:'px',defaultValue:1200},
  {key:'min-height',label:'Altezza minima',category:'Dimensioni',type:'range-number',min:0,max:1000,step:1,unit:'px',defaultValue:0},
  {key:'max-height',label:'Altezza massima',category:'Dimensioni',type:'range-number',min:0,max:1000,step:1,unit:'px',defaultValue:900},
  {key:'box-sizing',label:'Box sizing',category:'Dimensioni',type:'select',values:['content-box','border-box'],defaultValue:'border-box'},
  {key:'aspect-ratio',label:'Rapporto aspetto',category:'Dimensioni',type:'text',defaultValue:'auto'},

  // Spaziatura
  {key:'margin',label:'Margine',category:'Spaziatura',type:'box-model',min:0,max:200,step:1,unit:'px',defaultValue:10},
  {key:'padding',label:'Padding',category:'Spaziatura',type:'box-model',min:0,max:200,step:1,unit:'px',defaultValue:10},

  // Bordi
  {key:'border-width',label:'Spessore bordo',category:'Bordi',type:'range-number',min:0,max:30,step:1,unit:'px',defaultValue:1},
  {key:'border-style',label:'Stile bordo',category:'Bordi',type:'select',values:['none','solid','dashed','dotted','double','groove','ridge','inset','outset'],defaultValue:'solid'},
  {key:'border-color',label:'Colore bordo',category:'Bordi',type:'color',defaultValue:'#cccccc'},
  {key:'border-radius',label:'Raggio bordi',category:'Bordi',type:'radius-4',defaultValue:'8px'},
  {key:'outline-width',label:'Spessore outline',category:'Bordi',type:'range-number',min:0,max:20,step:1,unit:'px',defaultValue:0},
  {key:'outline-style',label:'Stile outline',category:'Bordi',type:'select',values:['none','solid','dashed','dotted','double'],defaultValue:'none'},
  {key:'outline-color',label:'Colore outline',category:'Bordi',type:'color',defaultValue:'#6ea8ff'},
  {key:'outline-offset',label:'Offset outline',category:'Bordi',type:'range-number',min:-20,max:30,step:1,unit:'px',defaultValue:0},

  // Layout generale
  {key:'display',label:'Display',category:'Layout',type:'select',values:['block','inline','inline-block','flex','inline-flex','grid','inline-grid','flow-root','contents','none'],defaultValue:'block'},
  {key:'visibility',label:'Visibilità',category:'Layout',type:'select',values:['visible','hidden','collapse'],defaultValue:'visible'},
  {key:'position',label:'Posizione',category:'Posizionamento',type:'select',values:['static','relative','absolute','fixed','sticky'],defaultValue:'static'},
  {key:'top',label:'Top',category:'Posizionamento',type:'range-number',min:-500,max:1000,step:1,unit:'px',defaultValue:0},
  {key:'right',label:'Right',category:'Posizionamento',type:'range-number',min:-500,max:1000,step:1,unit:'px',defaultValue:0},
  {key:'bottom',label:'Bottom',category:'Posizionamento',type:'range-number',min:-500,max:1000,step:1,unit:'px',defaultValue:0},
  {key:'left',label:'Left',category:'Posizionamento',type:'range-number',min:-500,max:1000,step:1,unit:'px',defaultValue:0},
  {key:'inset',label:'Inset',category:'Posizionamento',type:'box-model',min:-500,max:1000,step:1,unit:'px',defaultValue:0},
  {key:'z-index',label:'Z-index',category:'Posizionamento',type:'range-number',min:-100,max:100,step:1,unit:'',defaultValue:0},

  // Flex
  {key:'flex-direction',label:'Direzione flex',category:'Flexbox',type:'select',values:['row','row-reverse','column','column-reverse'],defaultValue:'row',onlyWhen:s=>s.display==='flex'||s.display==='inline-flex'},
  {key:'flex-wrap',label:'A capo',category:'Flexbox',type:'select',values:['nowrap','wrap','wrap-reverse'],defaultValue:'nowrap',onlyWhen:s=>s.display==='flex'||s.display==='inline-flex'},
  {key:'justify-content',label:'Distribuzione',category:'Flexbox',type:'select',values:['flex-start','center','flex-end','space-between','space-around','space-evenly','start','end'],defaultValue:'flex-start',onlyWhen:s=>s.display==='flex'||s.display==='inline-flex'},
  {key:'align-items',label:'Allineamento',category:'Flexbox',type:'select',values:['stretch','flex-start','center','flex-end','baseline','start','end'],defaultValue:'stretch',onlyWhen:s=>s.display==='flex'||s.display==='inline-flex'},
  {key:'align-content',label:'Righe flex',category:'Flexbox',type:'select',values:['normal','stretch','flex-start','center','flex-end','space-between','space-around','space-evenly'],defaultValue:'normal',onlyWhen:s=>s.display==='flex'||s.display==='inline-flex'},
  {key:'align-self',label:'Allinea questo elemento',category:'Flexbox',type:'select',values:['auto','stretch','flex-start','center','flex-end','baseline'],defaultValue:'auto'},
  {key:'order',label:'Ordine',category:'Flexbox',type:'range-number',min:-20,max:20,step:1,unit:'',defaultValue:0},
  {key:'flex-grow',label:'Flex grow',category:'Flexbox',type:'range-number',min:0,max:10,step:0.1,unit:'',defaultValue:0},
  {key:'flex-shrink',label:'Flex shrink',category:'Flexbox',type:'range-number',min:0,max:10,step:0.1,unit:'',defaultValue:1},
  {key:'flex-basis',label:'Flex basis',category:'Flexbox',type:'text',defaultValue:'auto'},
  {key:'gap',label:'Gap',category:'Flexbox',type:'range-number',min:0,max:150,step:1,unit:'px',defaultValue:10},
  {key:'row-gap',label:'Row gap',category:'Flexbox',type:'range-number',min:0,max:150,step:1,unit:'px',defaultValue:0},
  {key:'column-gap',label:'Column gap',category:'Flexbox',type:'range-number',min:0,max:150,step:1,unit:'px',defaultValue:0},

  // Grid
  {key:'grid-template-columns',label:'Colonne',category:'Grid',type:'grid-template',defaultValue:'repeat(3, 1fr)',onlyWhen:s=>s.display==='grid'||s.display==='inline-grid'},
  {key:'grid-template-rows',label:'Righe',category:'Grid',type:'grid-template',defaultValue:'auto',onlyWhen:s=>s.display==='grid'||s.display==='inline-grid'},
  {key:'grid-auto-flow',label:'Flusso automatico',category:'Grid',type:'select',values:['row','column','dense','row dense','column dense'],defaultValue:'row',onlyWhen:s=>s.display==='grid'||s.display==='inline-grid'},
  {key:'grid-auto-columns',label:'Colonne automatiche',category:'Grid',type:'text',defaultValue:'auto',onlyWhen:s=>s.display==='grid'||s.display==='inline-grid'},
  {key:'grid-auto-rows',label:'Righe automatiche',category:'Grid',type:'text',defaultValue:'auto',onlyWhen:s=>s.display==='grid'||s.display==='inline-grid'},
  {key:'justify-items',label:'Justify items',category:'Grid',type:'select',values:['stretch','start','center','end'],defaultValue:'stretch',onlyWhen:s=>s.display==='grid'||s.display==='inline-grid'},
  {key:'place-items',label:'Place items',category:'Grid',type:'select',values:['stretch','center','start','end','space-between','space-around','space-evenly'],defaultValue:'stretch'},
  {key:'grid-column',label:'Colonna elemento',category:'Grid',type:'text',defaultValue:'auto'},
  {key:'grid-row',label:'Riga elemento',category:'Grid',type:'text',defaultValue:'auto'},

  // Effetti
  {key:'opacity',label:'Opacità',category:'Effetti',type:'range-number',min:0,max:1,step:0.05,unit:'',defaultValue:1},
  {key:'box-shadow',label:'Ombra',category:'Effetti',type:'shadow',defaultValue:'0 8px 24px rgba(0,0,0,.18)'},
  {key:'filter',label:'Filtro visivo',category:'Effetti',type:'filter-editor',defaultValue:'none'},
  {key:'backdrop-filter',label:'Backdrop filter',category:'Effetti',type:'filter-editor',defaultValue:'none'},
  {key:'transform',label:'Trasformazione',category:'Trasformazioni',type:'transform-advanced',defaultValue:'none'},
  {key:'transform-origin',label:'Origine trasformazione',category:'Trasformazioni',type:'text',defaultValue:'center'},

  // Transizioni / animazioni
  {key:'transition',label:'Transizione',category:'Animazione',type:'transition',defaultValue:'all .25s ease'},
  {key:'animation',label:'Animazione completa',category:'Animazione',type:'animation',defaultValue:'none'},
  {key:'animation-name',label:'Nome animazione',category:'Animazione',type:'text',defaultValue:'none'},
  {key:'animation-duration',label:'Durata animazione',category:'Animazione',type:'range-number',min:0,max:20,step:0.1,unit:'s',defaultValue:0},
  {key:'animation-timing-function',label:'Timing animazione',category:'Animazione',type:'select',values:['ease','linear','ease-in','ease-out','ease-in-out','steps(4)','cubic-bezier(.2,.8,.2,1)'],defaultValue:'ease'},
  {key:'animation-delay',label:'Ritardo animazione',category:'Animazione',type:'range-number',min:0,max:20,step:0.1,unit:'s',defaultValue:0},
  {key:'animation-iteration-count',label:'Ripetizioni',category:'Animazione',type:'select',values:['1','2','3','infinite'],defaultValue:'1'},
  {key:'animation-direction',label:'Direzione animazione',category:'Animazione',type:'select',values:['normal','reverse','alternate','alternate-reverse'],defaultValue:'normal'},
  {key:'animation-fill-mode',label:'Riempimento animazione',category:'Animazione',type:'select',values:['none','forwards','backwards','both'],defaultValue:'none'},

  // Overflow / interazione / liste
  {key:'overflow',label:'Overflow',category:'Comportamento',type:'select',values:['visible','hidden','clip','scroll','auto'],defaultValue:'visible'},
  {key:'overflow-x',label:'Overflow X',category:'Comportamento',type:'select',values:['visible','hidden','clip','scroll','auto'],defaultValue:'visible'},
  {key:'overflow-y',label:'Overflow Y',category:'Comportamento',type:'select',values:['visible','hidden','clip','scroll','auto'],defaultValue:'visible'},
  {key:'cursor',label:'Cursore',category:'Interazione',type:'select',values:['auto','default','pointer','text','move','grab','grabbing','not-allowed','help','wait','crosshair','zoom-in','zoom-out'],defaultValue:'auto'},
  {key:'pointer-events',label:'Pointer events',category:'Interazione',type:'select',values:['auto','none'],defaultValue:'auto'},
  {key:'user-select',label:'Selezione testo',category:'Interazione',type:'select',values:['auto','none','text','all'],defaultValue:'auto'},
  {key:'list-style-type',label:'Tipo elenco',category:'Liste',type:'select',values:['disc','circle','square','decimal','lower-alpha','upper-alpha','none'],defaultValue:'disc'},
  {key:'list-style-position',label:'Posizione marker',category:'Liste',type:'select',values:['outside','inside'],defaultValue:'outside'},

  // Contenuto / colonne / scroll / accessibilità visiva
  {key:'content',label:'Content',category:'Avanzate',type:'text',defaultValue:'none'},
  {key:'columns',label:'Colonne testo',category:'Avanzate',type:'text',defaultValue:'auto'},
  {key:'column-count',label:'Numero colonne',category:'Avanzate',type:'range-number',min:1,max:8,step:1,unit:'',defaultValue:1},
  {key:'scroll-behavior',label:'Scorrimento',category:'Avanzate',type:'select',values:['auto','smooth'],defaultValue:'auto'},
  {key:'scroll-snap-type',label:'Snap scroll',category:'Avanzate',type:'select',values:['none','x mandatory','y mandatory','both mandatory','x proximity','y proximity'],defaultValue:'none'},
  {key:'isolation',label:'Isolation',category:'Avanzate',type:'select',values:['auto','isolate'],defaultValue:'auto'},
  {key:'mix-blend-mode',label:'Blend mode',category:'Avanzate',type:'select',values:['normal','multiply','screen','overlay','darken','lighten','difference','exclusion'],defaultValue:'normal'},
  {key:'object-fit',label:'Object fit',category:'Immagini',type:'select',values:['fill','contain','cover','none','scale-down'],defaultValue:'fill'},
  {key:'object-position',label:'Object position',category:'Immagini',type:'position-2d',defaultValue:'center'},
  {key:'accent-color',label:'Colore controlli',category:'Form',type:'color',defaultValue:'#6ea8ff'},


  // ============================================================
  // CSS moderno esteso — tipografia avanzata
  // ============================================================
  {key:'font-stretch',label:'Compressione font',category:'Tipografia avanzata',type:'select',values:['normal','condensed','semi-condensed','semi-expanded','expanded'],defaultValue:'normal'},
  {key:'font-kerning',label:'Kerning',category:'Tipografia avanzata',type:'select',values:['auto','normal','none'],defaultValue:'auto'},
  {key:'font-variant-ligatures',label:'Legature',category:'Tipografia avanzata',type:'select',values:['normal','none','common-ligatures','no-common-ligatures','discretionary-ligatures'],defaultValue:'normal'},
  {key:'font-feature-settings',label:'OpenType features',category:'Tipografia avanzata',type:'text',defaultValue:'normal'},
  {key:'font-variation-settings',label:'Varianti font',category:'Tipografia avanzata',type:'text',defaultValue:'normal'},
  {key:'font-optical-sizing',label:'Ottimizzazione ottica',category:'Tipografia avanzata',type:'select',values:['auto','none'],defaultValue:'auto'},
  {key:'font-synthesis',label:'Sintesi font',category:'Tipografia avanzata',type:'select',values:['auto','none','weight','style','small-caps'],defaultValue:'auto'},
  {key:'font-size-adjust',label:'Regolazione dimensione font',category:'Tipografia avanzata',type:'text',defaultValue:'none'},
  {key:'text-rendering',label:'Rendering testo',category:'Tipografia avanzata',type:'select',values:['auto','optimizeSpeed','optimizeLegibility','geometricPrecision'],defaultValue:'auto'},
  {key:'text-overflow',label:'Testo eccedente',category:'Tipografia avanzata',type:'select',values:['clip','ellipsis'],defaultValue:'clip'},
  {key:'text-wrap',label:'Avvolgimento testo',category:'Tipografia avanzata',type:'select',values:['wrap','nowrap','balance','pretty'],defaultValue:'wrap'},
  {key:'hyphens',label:'Sillabazione',category:'Tipografia avanzata',type:'select',values:['none','manual','auto'],defaultValue:'manual'},
  {key:'tab-size',label:'Dimensione tab',category:'Tipografia avanzata',type:'range-number',min:1,max:16,step:1,unit:'',defaultValue:4},
  {key:'unicode-bidi',label:'Unicode bidi',category:'Tipografia avanzata',type:'select',values:['normal','embed','isolate','bidi-override','isolate-override','plaintext'],defaultValue:'normal'},
  {key:'writing-mode',label:'Modalità scrittura',category:'Tipografia avanzata',type:'select',values:['horizontal-tb','vertical-rl','vertical-lr'],defaultValue:'horizontal-tb'},
  {key:'text-orientation',label:'Orientamento testo',category:'Tipografia avanzata',type:'select',values:['mixed','upright','sideways'],defaultValue:'mixed'},
  {key:'text-shadow',label:'Ombra testo',category:'Tipografia avanzata',type:'text-shadow',defaultValue:'none'},
  {key:'text-decoration-thickness',label:'Spessore decorazione',category:'Tipografia avanzata',type:'text',defaultValue:'auto'},
  {key:'text-underline-offset',label:'Offset sottolineatura',category:'Tipografia avanzata',type:'text',defaultValue:'auto'},
  {key:'text-emphasis',label:'Enfasi testo',category:'Tipografia avanzata',type:'text',defaultValue:'none'},
  {key:'text-emphasis-position',label:'Posizione enfasi',category:'Tipografia avanzata',type:'select',values:['over','under','over right','under right'],defaultValue:'over'},
  {key:'line-break',label:'Regole interruzione righe',category:'Paragrafi',type:'select',values:['auto','loose','normal','strict','anywhere'],defaultValue:'auto'},
  {key:'box-decoration-break',label:'Decorazione a capo',category:'Tipografia avanzata',type:'select',values:['slice','clone'],defaultValue:'slice'},

  // ============================================================
  // Background / immagini / maschere
  // ============================================================
  {key:'background',label:'Background visuale',category:'Sfondo avanzato',type:'background-visual',defaultValue:'none'},
  {key:'background-origin',label:'Origine sfondo',category:'Sfondo avanzato',type:'select',values:['padding-box','border-box','content-box'],defaultValue:'padding-box'},
  {key:'background-clip',label:'Clip sfondo',category:'Sfondo avanzato',type:'select',values:['border-box','padding-box','content-box','text'],defaultValue:'border-box'},
  {key:'background-position-x',label:'Posizione X sfondo',category:'Sfondo avanzato',type:'text',defaultValue:'center'},
  {key:'background-position-y',label:'Posizione Y sfondo',category:'Sfondo avanzato',type:'text',defaultValue:'center'},
  {key:'image-rendering',label:'Rendering immagine',category:'Immagini',type:'select',values:['auto','smooth','high-quality','crisp-edges','pixelated'],defaultValue:'auto'},
  {key:'image-orientation',label:'Orientamento immagine',category:'Immagini',type:'select',values:['from-image','none'],defaultValue:'from-image'},
  {key:'shape-outside',label:'Forma wrapping',category:'Immagini',type:'text',defaultValue:'none'},
  {key:'shape-margin',label:'Margine forma',category:'Immagini',type:'text',defaultValue:'0'},
  {key:'shape-image-threshold',label:'Soglia trasparenza forma',category:'Immagini',type:'range-number',min:0,max:1,step:0.05,unit:'',defaultValue:0},
  {key:'clip-path',label:'Clip path visuale',category:'Maschere e clip',type:'clip-visual',defaultValue:'none'},
  {key:'mask',label:'Mask completa',category:'Maschere e clip',type:'text',defaultValue:'none'},
  {key:'mask-image',label:'Immagine mask',category:'Maschere e clip',type:'text',defaultValue:'none'},
  {key:'mask-size',label:'Dimensione mask',category:'Maschere e clip',type:'text',defaultValue:'auto'},
  {key:'mask-position',label:'Posizione mask',category:'Maschere e clip',type:'text',defaultValue:'0 0'},
  {key:'mask-repeat',label:'Ripetizione mask',category:'Maschere e clip',type:'select',values:['repeat','repeat-x','repeat-y','no-repeat','space','round'],defaultValue:'repeat'},
  {key:'mask-origin',label:'Origine mask',category:'Maschere e clip',type:'select',values:['border-box','padding-box','content-box','fill-box','stroke-box','view-box'],defaultValue:'border-box'},
  {key:'mask-clip',label:'Clip mask',category:'Maschere e clip',type:'select',values:['border-box','padding-box','content-box','no-clip','fill-box','stroke-box','view-box'],defaultValue:'border-box'},
  {key:'mask-composite',label:'Composizione mask',category:'Maschere e clip',type:'select',values:['add','subtract','intersect','exclude'],defaultValue:'add'},

  // ============================================================
  // Border / corner / outline avanzati
  // ============================================================
  {key:'border-top-width',label:'Bordo superiore — spessore',category:'Bordi avanzati',type:'text',defaultValue:'0'},
  {key:'border-right-width',label:'Bordo destro — spessore',category:'Bordi avanzati',type:'text',defaultValue:'0'},
  {key:'border-bottom-width',label:'Bordo inferiore — spessore',category:'Bordi avanzati',type:'text',defaultValue:'0'},
  {key:'border-left-width',label:'Bordo sinistro — spessore',category:'Bordi avanzati',type:'text',defaultValue:'0'},
  {key:'border-top-color',label:'Bordo superiore — colore',category:'Bordi avanzati',type:'color',defaultValue:'#cccccc'},
  {key:'border-right-color',label:'Bordo destro — colore',category:'Bordi avanzati',type:'color',defaultValue:'#cccccc'},
  {key:'border-bottom-color',label:'Bordo inferiore — colore',category:'Bordi avanzati',type:'color',defaultValue:'#cccccc'},
  {key:'border-left-color',label:'Bordo sinistro — colore',category:'Bordi avanzati',type:'color',defaultValue:'#cccccc'},
  {key:'border-top-style',label:'Bordo superiore — stile',category:'Bordi avanzati',type:'select',values:['none','solid','dashed','dotted','double','groove','ridge','inset','outset'],defaultValue:'none'},
  {key:'border-right-style',label:'Bordo destro — stile',category:'Bordi avanzati',type:'select',values:['none','solid','dashed','dotted','double','groove','ridge','inset','outset'],defaultValue:'none'},
  {key:'border-bottom-style',label:'Bordo inferiore — stile',category:'Bordi avanzati',type:'select',values:['none','solid','dashed','dotted','double','groove','ridge','inset','outset'],defaultValue:'none'},
  {key:'border-left-style',label:'Bordo sinistro — stile',category:'Bordi avanzati',type:'select',values:['none','solid','dashed','dotted','double','groove','ridge','inset','outset'],defaultValue:'none'},
  {key:'border-top-left-radius',label:'Angolo alto sinistra',category:'Bordi avanzati',type:'text',defaultValue:'0'},
  {key:'border-top-right-radius',label:'Angolo alto destra',category:'Bordi avanzati',type:'text',defaultValue:'0'},
  {key:'border-bottom-right-radius',label:'Angolo basso destra',category:'Bordi avanzati',type:'text',defaultValue:'0'},
  {key:'border-bottom-left-radius',label:'Angolo basso sinistra',category:'Bordi avanzati',type:'text',defaultValue:'0'},
  {key:'outline',label:'Outline completo',category:'Bordi avanzati',type:'text',defaultValue:'none'},

  // ============================================================
  // Margin / padding / dimensioni logiche
  // ============================================================
  {key:'margin-block',label:'Margine blocco',category:'Spaziatura logica',type:'text',defaultValue:'0'},
  {key:'margin-inline',label:'Margine inline',category:'Spaziatura logica',type:'text',defaultValue:'0'},
  {key:'margin-block-start',label:'Margine blocco iniziale',category:'Spaziatura logica',type:'text',defaultValue:'0'},
  {key:'margin-block-end',label:'Margine blocco finale',category:'Spaziatura logica',type:'text',defaultValue:'0'},
  {key:'margin-inline-start',label:'Margine inline iniziale',category:'Spaziatura logica',type:'text',defaultValue:'0'},
  {key:'margin-inline-end',label:'Margine inline finale',category:'Spaziatura logica',type:'text',defaultValue:'0'},
  {key:'padding-block',label:'Padding blocco',category:'Spaziatura logica',type:'text',defaultValue:'0'},
  {key:'padding-inline',label:'Padding inline',category:'Spaziatura logica',type:'text',defaultValue:'0'},
  {key:'padding-block-start',label:'Padding blocco iniziale',category:'Spaziatura logica',type:'text',defaultValue:'0'},
  {key:'padding-block-end',label:'Padding blocco finale',category:'Spaziatura logica',type:'text',defaultValue:'0'},
  {key:'padding-inline-start',label:'Padding inline iniziale',category:'Spaziatura logica',type:'text',defaultValue:'0'},
  {key:'padding-inline-end',label:'Padding inline finale',category:'Spaziatura logica',type:'text',defaultValue:'0'},
  {key:'inline-size',label:'Dimensione inline',category:'Dimensioni logiche',type:'text',defaultValue:'auto'},
  {key:'block-size',label:'Dimensione blocco',category:'Dimensioni logiche',type:'text',defaultValue:'auto'},
  {key:'min-inline-size',label:'Inline minima',category:'Dimensioni logiche',type:'text',defaultValue:'auto'},
  {key:'max-inline-size',label:'Inline massima',category:'Dimensioni logiche',type:'text',defaultValue:'none'},
  {key:'min-block-size',label:'Blocco minimo',category:'Dimensioni logiche',type:'text',defaultValue:'auto'},
  {key:'max-block-size',label:'Blocco massimo',category:'Dimensioni logiche',type:'text',defaultValue:'none'},

  // ============================================================
  // Flex / Grid completo
  // ============================================================
  {key:'flex-flow',label:'Flex flow',category:'Flexbox avanzato',type:'select',values:['row nowrap','row wrap','column nowrap','column wrap','row-reverse wrap'],defaultValue:'row nowrap'},
  {key:'place-content',label:'Place content',category:'Flexbox avanzato',type:'text',defaultValue:'normal'},
  {key:'place-self',label:'Place self',category:'Flexbox avanzato',type:'text',defaultValue:'auto'},
  {key:'justify-self',label:'Justify self',category:'Flexbox avanzato',type:'select',values:['auto','normal','stretch','start','center','end'],defaultValue:'auto'},
  {key:'grid-template-areas',label:'Aree Grid',category:'Grid avanzato',type:'text',defaultValue:'none'},
  {key:'grid-template',label:'Template Grid completo',category:'Grid avanzato',type:'text',defaultValue:'none'},
  {key:'grid-area',label:'Area elemento',category:'Grid avanzato',type:'text',defaultValue:'auto'},
  {key:'grid-column-start',label:'Colonna iniziale',category:'Grid avanzato',type:'text',defaultValue:'auto'},
  {key:'grid-column-end',label:'Colonna finale',category:'Grid avanzato',type:'text',defaultValue:'auto'},
  {key:'grid-row-start',label:'Riga iniziale',category:'Grid avanzato',type:'text',defaultValue:'auto'},
  {key:'grid-row-end',label:'Riga finale',category:'Grid avanzato',type:'text',defaultValue:'auto'},

  // ============================================================
  // Multi-column / paginazione
  // ============================================================
  {key:'column-fill',label:'Riempimento colonne',category:'Colonne',type:'select',values:['auto','balance','balance-all'],defaultValue:'balance'},
  {key:'column-rule-width',label:'Spessore separatore colonne',category:'Colonne',type:'text',defaultValue:'medium'},
  {key:'column-rule-style',label:'Stile separatore colonne',category:'Colonne',type:'select',values:['none','solid','dashed','dotted','double','groove','ridge','inset','outset'],defaultValue:'none'},
  {key:'column-rule-color',label:'Colore separatore colonne',category:'Colonne',type:'color',defaultValue:'#cccccc'},
  {key:'column-rule',label:'Separatore colonne',category:'Colonne',type:'text',defaultValue:'none'},
  {key:'column-span',label:'Estensione su colonne',category:'Colonne',type:'select',values:['none','all'],defaultValue:'none'},
  {key:'break-before',label:'Interruzione prima',category:'Paginazione',type:'select',values:['auto','avoid','always','all','avoid-page','page','left','right'],defaultValue:'auto'},
  {key:'break-after',label:'Interruzione dopo',category:'Paginazione',type:'select',values:['auto','avoid','always','all','avoid-page','page','left','right'],defaultValue:'auto'},
  {key:'break-inside',label:'Interruzione interna',category:'Paginazione',type:'select',values:['auto','avoid','avoid-page','avoid-column'],defaultValue:'auto'},

  // ============================================================
  // Liste / tabelle
  // ============================================================
  {key:'list-style-image',label:'Immagine marker',category:'Liste',type:'text',defaultValue:'none'},
  {key:'list-style',label:'Stile lista completo',category:'Liste',type:'text',defaultValue:'disc'},
  {key:'marker',label:'Marker',category:'Liste avanzate',type:'text',defaultValue:'initial'},
  {key:'caption-side',label:'Posizione didascalia tabella',category:'Tabelle',type:'select',values:['top','bottom','block-start','block-end'],defaultValue:'top'},
  {key:'border-collapse',label:'Collasso bordi tabella',category:'Tabelle',type:'select',values:['separate','collapse'],defaultValue:'separate'},
  {key:'border-spacing',label:'Spaziatura bordi tabella',category:'Tabelle',type:'text',defaultValue:'0'},
  {key:'empty-cells',label:'Celle vuote',category:'Tabelle',type:'select',values:['show','hide'],defaultValue:'show'},
  {key:'table-layout',label:'Layout tabella',category:'Tabelle',type:'select',values:['auto','fixed'],defaultValue:'auto'},

  // ============================================================
  // Scroll / viewport / interazione moderna
  // ============================================================
  {key:'scroll-margin',label:'Margine scroll',category:'Scroll',type:'text',defaultValue:'0'},
  {key:'scroll-margin-top',label:'Margine scroll top',category:'Scroll',type:'text',defaultValue:'0'},
  {key:'scroll-margin-right',label:'Margine scroll right',category:'Scroll',type:'text',defaultValue:'0'},
  {key:'scroll-margin-bottom',label:'Margine scroll bottom',category:'Scroll',type:'text',defaultValue:'0'},
  {key:'scroll-margin-left',label:'Margine scroll left',category:'Scroll',type:'text',defaultValue:'0'},
  {key:'scroll-padding',label:'Padding scroll',category:'Scroll',type:'text',defaultValue:'0'},
  {key:'scroll-padding-top',label:'Padding scroll top',category:'Scroll',type:'text',defaultValue:'0'},
  {key:'scroll-padding-right',label:'Padding scroll right',category:'Scroll',type:'text',defaultValue:'0'},
  {key:'scroll-padding-bottom',label:'Padding scroll bottom',category:'Scroll',type:'text',defaultValue:'0'},
  {key:'scroll-padding-left',label:'Padding scroll left',category:'Scroll',type:'text',defaultValue:'0'},
  {key:'scroll-snap-align',label:'Snap align',category:'Scroll',type:'select',values:['none','start','center','end'],defaultValue:'none'},
  {key:'scroll-snap-stop',label:'Snap stop',category:'Scroll',type:'select',values:['normal','always'],defaultValue:'normal'},
  {key:'overscroll-behavior',label:'Overscroll',category:'Scroll',type:'select',values:['auto','contain','none'],defaultValue:'auto'},
  {key:'overscroll-behavior-x',label:'Overscroll X',category:'Scroll',type:'select',values:['auto','contain','none'],defaultValue:'auto'},
  {key:'overscroll-behavior-y',label:'Overscroll Y',category:'Scroll',type:'select',values:['auto','contain','none'],defaultValue:'auto'},
  {key:'touch-action',label:'Touch action',category:'Interazione avanzata',type:'select',values:['auto','none','pan-x','pan-y','pan-left','pan-right','pan-up','pan-down','manipulation'],defaultValue:'auto'},
  {key:'resize',label:'Ridimensionamento',category:'Interazione avanzata',type:'select',values:['none','both','horizontal','vertical','block','inline'],defaultValue:'none'},
  {key:'caret-color',label:'Colore cursore testo',category:'Form',type:'color',defaultValue:'#222222'},
  {key:'appearance',label:'Aspetto nativo',category:'Form',type:'select',values:['auto','none','textfield','button','checkbox','radio','menulist-button'],defaultValue:'auto'},
  {key:'field-sizing',label:'Dimensionamento campo',category:'Form',type:'select',values:['fixed','content'],defaultValue:'fixed'},
  {key:'text-size-adjust',label:'Adattamento testo mobile',category:'Form',type:'select',values:['auto','none'],defaultValue:'auto'},
  {key:'print-color-adjust',label:'Colori stampa',category:'Form',type:'select',values:['economy','exact'],defaultValue:'economy'},

  // ============================================================
  // Rendering / performance / compositing
  // ============================================================
  {key:'will-change',label:'Will change',category:'Rendering',type:'text',defaultValue:'auto'},
  {key:'contain',label:'Containment',category:'Rendering',type:'select',values:['none','strict','content','size','layout','style','paint','inline-size'],defaultValue:'none'},
  {key:'contain-intrinsic-size',label:'Dimensione intrinseca contain',category:'Rendering',type:'text',defaultValue:'none'},
  {key:'contain-intrinsic-width',label:'Larghezza intrinseca',category:'Rendering',type:'text',defaultValue:'auto'},
  {key:'contain-intrinsic-height',label:'Altezza intrinseca',category:'Rendering',type:'text',defaultValue:'auto'},
  {key:'content-visibility',label:'Visibilità contenuto',category:'Rendering',type:'select',values:['visible','auto','hidden'],defaultValue:'visible'},
  {key:'transform-style',label:'Stile 3D',category:'Rendering',type:'select',values:['flat','preserve-3d'],defaultValue:'flat'},
  {key:'backface-visibility',label:'Visibilità retro',category:'Rendering',type:'select',values:['visible','hidden'],defaultValue:'visible'},
  {key:'perspective',label:'Prospettiva',category:'Rendering',type:'text',defaultValue:'none'},
  {key:'perspective-origin',label:'Origine prospettiva',category:'Rendering',type:'text',defaultValue:'center'},
  {key:'view-transition-name',label:'View transition name',category:'Rendering',type:'text',defaultValue:'none'},
  {key:'view-transition-class',label:'View transition class',category:'Rendering',type:'text',defaultValue:'none'},

  // ============================================================
  // SVG / grafica inline
  // ============================================================
  {key:'fill',label:'Riempimento SVG',category:'SVG',type:'color',defaultValue:'#000000'},
  {key:'fill-opacity',label:'Opacità riempimento SVG',category:'SVG',type:'range-number',min:0,max:1,step:0.05,unit:'',defaultValue:1},
  {key:'stroke',label:'Tratto SVG',category:'SVG',type:'color',defaultValue:'none'},
  {key:'stroke-width',label:'Spessore tratto SVG',category:'SVG',type:'text',defaultValue:'1'},
  {key:'stroke-opacity',label:'Opacità tratto SVG',category:'SVG',type:'range-number',min:0,max:1,step:0.05,unit:'',defaultValue:1},
  {key:'stroke-linecap',label:'Terminale tratto SVG',category:'SVG',type:'select',values:['butt','round','square'],defaultValue:'butt'},
  {key:'stroke-linejoin',label:'Giunzione tratto SVG',category:'SVG',type:'select',values:['miter','round','bevel','arcs'],defaultValue:'miter'},
  {key:'paint-order',label:'Ordine pittura SVG',category:'SVG',type:'select',values:['normal','fill stroke markers','stroke fill markers','markers fill stroke'],defaultValue:'normal'},

  // ============================================================
  // Proprietà utili per componenti / UI
  // ============================================================
  {key:'quotes',label:'Virgolette CSS',category:'Contenuto',type:'text',defaultValue:'auto'},
  {key:'counter-reset',label:'Reset contatore',category:'Contenuto',type:'text',defaultValue:'none'},
  {key:'counter-increment',label:'Incremento contatore',category:'Contenuto',type:'text',defaultValue:'none'},
  {key:'counter-set',label:'Imposta contatore',category:'Contenuto',type:'text',defaultValue:'none'},
  {key:'caret-shape',label:'Forma cursore',category:'Form',type:'select',values:['auto','bar','block','underscore'],defaultValue:'auto'},
  {key:'scrollbar-color',label:'Colori scrollbar',category:'Scroll',type:'text',defaultValue:'auto'},
  {key:'scrollbar-width',label:'Larghezza scrollbar',category:'Scroll',type:'select',values:['auto','thin','none'],defaultValue:'auto'},
  {key:'forced-color-adjust',label:'Colori forzati',category:'Accessibilità',type:'select',values:['auto','none','preserve-parent-color'],defaultValue:'auto'},
  {key:'color-scheme',label:'Schema colori',category:'Accessibilità',type:'select',values:['normal','light','dark','light dark'],defaultValue:'normal'},

  // ============================================================
  // Shorthand pratici per chi vuole scrivere CSS in modo compatto
  // ============================================================
  {key:'font',label:'Font completo',category:'Shorthand',type:'text',defaultValue:'normal 400 16px/1.5 sans-serif'},
  {key:'border',label:'Bordo visuale completo',category:'Shorthand',type:'border-visual',defaultValue:'none'},
  {key:'flex',label:'Flex shorthand',category:'Shorthand',type:'text',defaultValue:'0 1 auto'},
  {key:'grid',label:'Grid shorthand',category:'Shorthand',type:'text',defaultValue:'none'},
  {key:'transition-property',label:'Proprietà transizione',category:'Transizioni',type:'text',defaultValue:'all'},
  {key:'transition-duration',label:'Durata transizione',category:'Transizioni',type:'text',defaultValue:'0.25s'},
  {key:'transition-timing-function',label:'Curva transizione',category:'Transizioni',type:'select',values:['ease','linear','ease-in','ease-out','ease-in-out','step-start','step-end'],defaultValue:'ease'},
  {key:'transition-delay',label:'Ritardo transizione',category:'Transizioni',type:'text',defaultValue:'0s'},
  {key:'animation-play-state',label:'Stato animazione',category:'Animazione avanzata',type:'select',values:['running','paused'],defaultValue:'running'},
  // Visual editor moderni
  {key:'color-mix',label:'Color mix',category:'Colori avanzati',type:'text',defaultValue:'color-mix(in srgb, #6ea8ff 50%, white)'},
  {key:'text-decoration',label:'Decorazione completa',category:'Tipografia',type:'text',defaultValue:'none'},
  {key:'text-box-trim',label:'Trim casella testo',category:'Tipografia avanzata',type:'select',values:['none','trim-start','trim-end','trim-both'],defaultValue:'none'},
  {key:'text-box-edge',label:'Bordo casella testo',category:'Tipografia avanzata',type:'select',values:['auto','cap alphabetic','text','ex','ideographic','ideographic-ink','cap','x'],defaultValue:'auto'},
  {key:'offset-path',label:'Percorso movimento visuale',category:'Motion',type:'motion-visual',defaultValue:'none'},
  {key:'offset-distance',label:'Distanza percorso',category:'Motion',type:'range-number',min:0,max:100,step:1,unit:'%',defaultValue:0},
  {key:'offset-rotate',label:'Rotazione sul percorso',category:'Motion',type:'text',defaultValue:'auto'},
  {key:'offset-anchor',label:'Ancora percorso',category:'Motion',type:'text',defaultValue:'auto'},
]
