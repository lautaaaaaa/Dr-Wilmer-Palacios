/* ════════════════════════════════════════════════════════════════════
   Dr. Wilmer Palacios. Galería de casos.

   Lee window.CASOS (casos-data.js) y arma la lista, los filtros, el
   contador y el lightbox. Para agregar casos NO hay que tocar este
   archivo: solo casos-data.js.

   Se carga después de main.js. Es independiente: main.js no sabe que
   esta página existe, y todos sus módulos hacen early-return cuando no
   encuentran sus elementos, así que conviven sin pisarse.
   ════════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  var CASOS = window.CASOS || [];
  var lista = document.getElementById('casos-lista');
  if (!lista) return;

  var RUTA = 'assets/casos/';
  var TANDA = 6;              // casos por tanda (dos filas de la grilla)

  // Etiquetas legibles de cada valor de filtro.
  var ETIQUETAS = {
    tipo:     { primaria: 'Primaria', secundaria: 'Secundaria' },
    abordaje: { abierto: 'Abordaje abierto', cerrado: 'Abordaje cerrado' },
    injerto:  { costal: 'Injerto costal', septal: 'Injerto septal', 'sin-injerto': 'Sin injerto' }
  };
  var EJES = ['tipo', 'abordaje', 'injerto'];

  var filtros = { tipo: null, abordaje: null, injerto: null };
  var visibles = [];          // casos que pasan el filtro actual
  var pintados = 0;           // cuántos de esos ya están en el DOM

  // ─── HELPERS ────────────────────────────────────────────────────────
  function el(tag, clase, texto) {
    var n = document.createElement(tag);
    if (clase) n.className = clase;
    if (texto != null) n.textContent = texto;
    return n;
  }

  function badgesDe(caso) {
    var out = [];
    EJES.forEach(function(eje) {
      var v = caso[eje];
      if (v && ETIQUETAS[eje][v]) out.push(ETIQUETAS[eje][v]);
    });
    return out;
  }

  function parrafos(texto) {
    return texto.split('\n').filter(function(p) { return p.trim() !== ''; });
  }

  function numeroDe(caso) {
    return 'Caso ' + caso.id.replace('caso-', '');
  }

  // ─── FILTROS ────────────────────────────────────────────────────────
  function cuenta(eje, valor) {
    return CASOS.filter(function(c) { return c[eje] === valor; }).length;
  }

  function initFiltros() {
    var cont = document.getElementById('casos-filtros');
    if (!cont) return;

    EJES.forEach(function(eje) {
      // Solo se dibuja el eje si algún caso tiene ese dato: con pocos
      // casos cargados, un filtro vacío es ruido.
      var valores = Object.keys(ETIQUETAS[eje]).filter(function(v) { return cuenta(eje, v) > 0; });
      if (!valores.length) return;

      var grupo = el('div', 'casos-filtro-grupo');
      grupo.appendChild(el('span', 'casos-filtro-grupo__label', eje));

      valores.forEach(function(valor) {
        var chip = el('button', 'chip');
        chip.type = 'button';
        chip.appendChild(document.createTextNode(ETIQUETAS[eje][valor]));
        chip.appendChild(el('span', 'chip__n', cuenta(eje, valor)));
        chip.addEventListener('click', function() {
          // Volver a tocar el chip activo lo desactiva.
          filtros[eje] = (filtros[eje] === valor) ? null : valor;
          sincronizarChips();
          aplicarFiltros();
        });
        chip.dataset.eje = eje;
        chip.dataset.valor = valor;
        grupo.appendChild(chip);
      });

      cont.appendChild(grupo);
    });

    var resultado = el('span', 'casos-filtros__resultado');
    resultado.id = 'casos-resultado';
    cont.appendChild(resultado);

    var reset = el('button', 'casos-filtros__reset', 'Ver todos');
    reset.type = 'button';
    reset.id = 'casos-reset';
    reset.hidden = true;
    reset.addEventListener('click', function() {
      EJES.forEach(function(eje) { filtros[eje] = null; });
      sincronizarChips();
      aplicarFiltros();
    });
    cont.appendChild(reset);
  }

  function sincronizarChips() {
    var chips = document.querySelectorAll('#casos-filtros .chip');
    Array.prototype.forEach.call(chips, function(chip) {
      var activo = filtros[chip.dataset.eje] === chip.dataset.valor;
      chip.classList.toggle('is-active', activo);
      chip.setAttribute('aria-pressed', activo ? 'true' : 'false');
    });
    var hayFiltro = EJES.some(function(eje) { return filtros[eje] !== null; });
    var reset = document.getElementById('casos-reset');
    if (reset) reset.hidden = !hayFiltro;
  }

  function aplicarFiltros() {
    visibles = CASOS.filter(function(c) {
      return EJES.every(function(eje) {
        return filtros[eje] === null || c[eje] === filtros[eje];
      });
    });
    pintados = 0;
    lista.innerHTML = '';

    var resultado = document.getElementById('casos-resultado');
    if (resultado) {
      resultado.textContent = visibles.length === CASOS.length
        ? ''
        : visibles.length + (visibles.length === 1 ? ' caso' : ' casos');
    }

    if (!visibles.length) {
      var vacio = el('p', 'casos-vacio', 'No hay casos publicados con esa combinación todavía.');
      lista.appendChild(vacio);
    }
    pintarTanda();
  }

  // ─── PINTAR UN CASO ─────────────────────────────────────────────────
  function crearCaso(caso, indice) {
    var art = el('article', 'caso reveal');
    art.id = caso.id;

    // ── Visor ──
    var visor = el('div', 'caso__visor');
    var marco = el('div', 'caso__marco');

    caso.fotos.forEach(function(archivo, i) {
      var img = el('img', 'caso__foto' + (i === 0 ? ' is-current' : ''));
      img.src = RUTA + archivo;
      img.alt = caso.titulo + ', antes y después, vista ' + (i + 1) + ' de ' + caso.fotos.length;
      // La primera foto de los dos primeros casos carga de inmediato:
      // es lo que se ve al abrir la página. El resto, diferido.
      img.loading = (indice < 3 && i === 0) ? 'eager' : 'lazy';
      img.decoding = 'async';
      marco.appendChild(img);
    });

    marco.appendChild(el('span', 'caso__tag caso__tag--antes', 'Antes'));
    marco.appendChild(el('span', 'caso__tag caso__tag--despues', 'Después'));

    var estado = { i: 0 };

    function mostrar(n) {
      var total = caso.fotos.length;
      estado.i = (n + total) % total;
      var fotos = marco.querySelectorAll('.caso__foto');
      Array.prototype.forEach.call(fotos, function(f, k) {
        f.classList.toggle('is-current', k === estado.i);
      });
      var puntos = visor.querySelectorAll('.caso__punto');
      Array.prototype.forEach.call(puntos, function(p, k) {
        p.classList.toggle('is-active', k === estado.i);
        p.setAttribute('aria-current', k === estado.i ? 'true' : 'false');
      });
      var cont = visor.querySelector('.caso__contador');
      if (cont) cont.textContent = 'Vista ' + (estado.i + 1) + ' de ' + total;
    }

    if (caso.fotos.length > 1) {
      var prev = el('button', 'caso__nav caso__nav--prev', '‹');
      prev.type = 'button';
      prev.setAttribute('aria-label', 'Vista anterior');
      prev.addEventListener('click', function(e) { e.stopPropagation(); mostrar(estado.i - 1); });

      var next = el('button', 'caso__nav caso__nav--next', '›');
      next.type = 'button';
      next.setAttribute('aria-label', 'Vista siguiente');
      next.addEventListener('click', function(e) { e.stopPropagation(); mostrar(estado.i + 1); });

      marco.appendChild(prev);
      marco.appendChild(next);

      // Swipe en touch.
      var x0 = null;
      marco.addEventListener('touchstart', function(e) { x0 = e.touches[0].clientX; }, { passive: true });
      marco.addEventListener('touchend', function(e) {
        if (x0 === null) return;
        var dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 45) mostrar(estado.i + (dx < 0 ? 1 : -1));
        x0 = null;
      });
    }

    marco.addEventListener('click', function() { abrirLightbox(caso, estado.i); });
    visor.appendChild(marco);

    // Puntos + contador
    var angulos = el('div', 'caso__angulos');
    if (caso.fotos.length > 1) {
      caso.fotos.forEach(function(_, i) {
        var p = el('button', 'caso__punto' + (i === 0 ? ' is-active' : ''));
        p.type = 'button';
        p.setAttribute('aria-label', 'Ver vista ' + (i + 1));
        p.addEventListener('click', function() { mostrar(i); });
        angulos.appendChild(p);
      });
    }
    var contador = el('span', 'caso__contador',
      caso.fotos.length > 1 ? 'Vista 1 de ' + caso.fotos.length : '1 vista');
    angulos.appendChild(contador);
    visor.appendChild(angulos);

    // ── Info ──
    var info = el('div', 'caso__info');
    info.appendChild(el('span', 'caso__num', numeroDe(caso)));
    info.appendChild(el('h2', 'caso__titulo', caso.titulo));

    var badges = badgesDe(caso);
    if (badges.length || caso.postop) {
      var meta = el('div', 'caso__meta');
      badges.forEach(function(b) { meta.appendChild(el('span', 'caso__badge', b)); });
      if (caso.postop) meta.appendChild(el('span', 'caso__badge caso__badge--postop', caso.postop));
      info.appendChild(meta);
    }

    /* En la tarjeta va solo el primer párrafo, recortado por CSS a unas
       pocas líneas: las descripciones del Dr. van de una línea a cinco
       párrafos, y en una grilla eso descuadra todas las tarjetas. El texto
       completo está en el lightbox. */
    var trozos = parrafos(caso.desc);
    var desc = el('div', 'caso__desc');
    desc.appendChild(el('p', null, trozos[0]));
    info.appendChild(desc);

    var zoom = el('button', 'caso__zoom', 'Ver caso completo');
    zoom.type = 'button';
    zoom.addEventListener('click', function() { abrirLightbox(caso, estado.i); });
    info.appendChild(zoom);

    art.appendChild(visor);
    art.appendChild(info);
    return art;
  }

  // ─── CARGA POR TANDAS ───────────────────────────────────────────────
  /* Los .reveal de esta página los observa este módulo, no main.js:
     main.js recorre los .reveal una sola vez al cargar, y acá los casos
     se crean después (y siguen apareciendo al scrollear).

     No se usa requestAnimationFrame para mostrarlos: el navegador lo
     congela mientras la pestaña está en segundo plano, y los casos
     quedaban en opacidad 0 para siempre. Con IntersectionObserver
     aparecen al entrar en pantalla, y un temporizador de seguridad los
     destapa igual si el observer no llega a dispararse. */
  var observadorReveal = ('IntersectionObserver' in window)
    ? new IntersectionObserver(function(entradas) {
        entradas.forEach(function(e) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            observadorReveal.unobserve(e.target);
          }
        });
      }, { threshold: 0.05 })
    : null;

  function revelar(nodo) {
    if (!observadorReveal) { nodo.classList.add('is-visible'); return; }
    observadorReveal.observe(nodo);
    setTimeout(function() { nodo.classList.add('is-visible'); }, 2500);
  }

  function pintarTanda() {
    var hasta = Math.min(pintados + TANDA, visibles.length);
    for (var i = pintados; i < hasta; i++) {
      var nodo = crearCaso(visibles[i], i);
      lista.appendChild(nodo);
      revelar(nodo);
    }
    pintados = hasta;

    var mas = document.getElementById('casos-mas');
    if (mas) mas.hidden = pintados >= visibles.length;
  }

  function initCargaProgresiva() {
    var mas = document.getElementById('casos-mas');
    var btn = document.getElementById('casos-mas-btn');
    if (btn) btn.addEventListener('click', pintarTanda);
    if (!mas || !('IntersectionObserver' in window)) return;

    // Al acercarse al final de lo pintado, entra la tanda siguiente.
    var obs = new IntersectionObserver(function(entradas) {
      entradas.forEach(function(e) {
        if (e.isIntersecting && pintados < visibles.length) pintarTanda();
      });
    }, { rootMargin: '600px 0px' });
    obs.observe(mas);
  }

  // ─── LIGHTBOX ───────────────────────────────────────────────────────
  var lb = {};
  var lbCaso = null, lbIndice = 0;

  function initLightbox() {
    lb.raiz    = document.getElementById('lightbox');
    if (!lb.raiz) return;
    lb.img     = document.getElementById('lb-img');
    lb.num     = document.getElementById('lb-num');
    lb.titulo  = document.getElementById('lb-titulo');
    lb.meta    = document.getElementById('lb-meta');
    lb.desc    = document.getElementById('lb-desc');
    lb.cont    = document.getElementById('lb-contador');
    lb.prev    = document.getElementById('lb-prev');
    lb.next    = document.getElementById('lb-next');

    document.getElementById('lb-cerrar').addEventListener('click', cerrarLightbox);
    lb.prev.addEventListener('click', function() { moverLightbox(-1); });
    lb.next.addEventListener('click', function() { moverLightbox(1); });

    // Clic en el fondo cierra; clic en la imagen hace zoom.
    lb.raiz.addEventListener('click', function(e) {
      if (e.target === lb.raiz || e.target.classList.contains('lb__visor')) cerrarLightbox();
    });
    initZoom();

    document.addEventListener('keydown', function(e) {
      if (!lb.raiz.classList.contains('is-open')) return;
      if (e.key === 'Escape') cerrarLightbox();
      if (e.key === 'ArrowLeft') moverLightbox(-1);
      if (e.key === 'ArrowRight') moverLightbox(1);
    });
  }

  /* ─── ZOOM CON DESPLAZAMIENTO ──────────────────────────────────────────
     La versión anterior solo hacía scale() sobre el centro: se ampliaba
     la foto pero no había forma de mirar una punta nasal que quedaba
     fuera de la pantalla. Ahora la transformación es
     translate(x, y) scale(e), y:

       · la rueda amplía y reduce sobre el puntero,
       · arrastrando se recorre la foto,
       · un clic simple alterna entre tamaño normal y 2,4x, ampliando
         justo donde se hizo clic,
       · los desplazamientos se limitan al borde de la foto para que no
         se pueda arrastrar al vacío.

     La cuenta para ampliar sobre un punto: si `c` es el puntero medido
     desde el centro de la foto, el punto de la imagen que hay debajo es
     p = (c - x) / e. Para que ese mismo punto siga debajo del puntero con
     la escala nueva, el desplazamiento pasa a ser x' = c - p * e'. */
  var zoom = { e: 1, x: 0, y: 0 };
  var ESCALA_MAX = 4;
  var ESCALA_CLIC = 2.4;

  function aplicarZoom(conTransicion) {
    lb.img.style.transition = conTransicion ? 'transform 0.28s var(--ease-out)' : 'none';
    lb.img.style.transform = 'translate(' + zoom.x + 'px, ' + zoom.y + 'px) scale(' + zoom.e + ')';
    lb.img.classList.toggle('is-zoomed', zoom.e > 1.01);
  }

  function limitarZoom() {
    // Cuánto sobra de la foto a cada lado una vez ampliada.
    var sobraX = (lb.img.offsetWidth  * (zoom.e - 1)) / 2;
    var sobraY = (lb.img.offsetHeight * (zoom.e - 1)) / 2;
    zoom.x = Math.max(-sobraX, Math.min(sobraX, zoom.x));
    zoom.y = Math.max(-sobraY, Math.min(sobraY, zoom.y));
  }

  function reiniciarZoom() {
    zoom.e = 1; zoom.x = 0; zoom.y = 0;
    aplicarZoom(false);
  }

  function escalarHacia(escalaNueva, clienteX, clienteY, conTransicion) {
    escalaNueva = Math.max(1, Math.min(ESCALA_MAX, escalaNueva));
    var caja = lb.img.getBoundingClientRect();
    var centroX = caja.left + caja.width / 2;
    var centroY = caja.top + caja.height / 2;
    var cx = clienteX - centroX;
    var cy = clienteY - centroY;
    var px = (cx - zoom.x) / zoom.e;
    var py = (cy - zoom.y) / zoom.e;
    zoom.x = cx - px * escalaNueva;
    zoom.y = cy - py * escalaNueva;
    zoom.e = escalaNueva;
    if (zoom.e === 1) { zoom.x = 0; zoom.y = 0; }
    limitarZoom();
    aplicarZoom(conTransicion);
  }

  function initZoom() {
    var arrastrando = false, movio = false, ultimoX = 0, ultimoY = 0;

    lb.img.addEventListener('wheel', function(e) {
      e.preventDefault();
      escalarHacia(zoom.e * (e.deltaY < 0 ? 1.18 : 1 / 1.18), e.clientX, e.clientY, false);
    }, { passive: false });

    lb.img.addEventListener('pointerdown', function(e) {
      arrastrando = true;
      movio = false;
      ultimoX = e.clientX;
      ultimoY = e.clientY;
      // Capturar el puntero permite seguir arrastrando aunque el cursor
      // se salga de la foto. Va protegido porque tira excepción si el
      // puntero ya no está activo, y ahí se cortaba el arrastre entero.
      try { lb.img.setPointerCapture(e.pointerId); } catch (err) {}
    });

    lb.img.addEventListener('pointermove', function(e) {
      if (!arrastrando) return;
      var dx = e.clientX - ultimoX;
      var dy = e.clientY - ultimoY;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) movio = true;
      ultimoX = e.clientX;
      ultimoY = e.clientY;
      if (zoom.e <= 1.01) return;   // sin ampliar no hay nada que recorrer
      zoom.x += dx;
      zoom.y += dy;
      limitarZoom();
      aplicarZoom(false);
    });

    function soltar(e) {
      if (!arrastrando) return;
      arrastrando = false;
      try {
        if (lb.img.hasPointerCapture && lb.img.hasPointerCapture(e.pointerId)) {
          lb.img.releasePointerCapture(e.pointerId);
        }
      } catch (err) {}
      // Un clic sin arrastre alterna la ampliación.
      if (!movio) {
        if (zoom.e > 1.01) reiniciarZoom();
        else escalarHacia(ESCALA_CLIC, e.clientX, e.clientY, true);
      }
    }
    lb.img.addEventListener('pointerup', soltar);
    lb.img.addEventListener('pointercancel', soltar);
    // Evita que el navegador arrastre la imagen como si fuera un enlace.
    lb.img.addEventListener('dragstart', function(e) { e.preventDefault(); });
  }

  function pintarLightbox() {
    reiniciarZoom();
    lb.img.src = RUTA + lbCaso.fotos[lbIndice];
    lb.img.alt = lbCaso.titulo + ', antes y después, vista ' + (lbIndice + 1);
    lb.num.textContent = numeroDe(lbCaso);
    lb.titulo.textContent = lbCaso.titulo;

    lb.meta.innerHTML = '';
    badgesDe(lbCaso).forEach(function(b) { lb.meta.appendChild(el('span', 'lb__badge', b)); });
    if (lbCaso.postop) lb.meta.appendChild(el('span', 'lb__badge', lbCaso.postop));

    lb.desc.innerHTML = '';
    parrafos(lbCaso.desc).forEach(function(p) { lb.desc.appendChild(el('p', null, p)); });

    var total = lbCaso.fotos.length;
    lb.cont.textContent = 'Vista ' + (lbIndice + 1) + ' de ' + total;
    lb.prev.hidden = total < 2;
    lb.next.hidden = total < 2;
  }

  function abrirLightbox(caso, indice) {
    if (!lb.raiz) return;
    lbCaso = caso;
    lbIndice = indice || 0;
    pintarLightbox();
    lb.raiz.classList.add('is-open');
    lb.raiz.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lb-abierto');
  }

  function moverLightbox(paso) {
    var total = lbCaso.fotos.length;
    lbIndice = (lbIndice + paso + total) % total;
    pintarLightbox();
  }

  function cerrarLightbox() {
    lb.raiz.classList.remove('is-open');
    lb.raiz.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lb-abierto');
  }

  // ─── ARRANQUE ───────────────────────────────────────────────────────
  initFiltros();
  initLightbox();
  initCargaProgresiva();
  sincronizarChips();
  aplicarFiltros();

  /* ─── SALTO POR ANCLA (casos.html#caso-07) ────────────────────────────
     Tres detalles que hicieron falta para que funcione de verdad:

     1. behavior:'instant'. styles.css pone `html { scroll-behavior: smooth }`
        y con scroll suave el navegador descarta el salto programático que
        sale durante la carga.
     2. Se hace en window.load, no antes. Al terminar el script todavía
        faltan las fuentes de Google y las primeras fotos: la posición del
        caso cambia más de 1000px entre un momento y el otro, así que un
        salto temprano cae en cualquier lado.

     3. Se repite el salto un instante después del load: el navegador
        restaura su propia posición de scroll DESPUÉS del evento load, y esa
        restauración pisaba el salto. Por eso también se desactiva la
        restauración automática.

     La altura final la da el scroll-margin-top de .caso, que descuenta el
     nav fijo y la barra de filtros. */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  function saltarAlAncla() {
    if (!location.hash) return;
    var idx = CASOS.findIndex(function(c) { return '#' + c.id === location.hash; });
    if (idx < 0) return;
    while (pintados <= idx && pintados < visibles.length) pintarTanda();
    var destino = document.getElementById(location.hash.slice(1));
    if (!destino) return;

    /* Se reintenta durante el primer segundo: las fotos de más abajo
       siguen cargando y cada una que entra corre el documento, así que
       un único salto queda desfasado. Se corta apenas el caso está
       arriba de todo. */
    var intentos = [0, 120, 350, 700, 1100];
    intentos.forEach(function(ms) {
      setTimeout(function() {
        var y = destino.getBoundingClientRect().top;
        if (Math.abs(y - 130) < 8) return;   // ya está en su sitio
        destino.scrollIntoView({ behavior: 'instant', block: 'start' });
      }, ms);
    });
  }

  if (document.readyState === 'complete') {
    saltarAlAncla();
  } else {
    window.addEventListener('load', saltarAlAncla);
  }
  // Si el ancla cambia con la página ya abierta (enlace interno, o el
  // visitante pegando otra URL), se vuelve a saltar.
  window.addEventListener('hashchange', saltarAlAncla);
})();
